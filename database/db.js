/**
 * Database Module for THE GOLDEN VOTE
 * Production-grade persistence with SQLite (better-sqlite3) in WAL mode.
 * Provides atomic transactions, idempotency guards, and full audit logs.
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(path.join(DB_DIR, 'golden_vote.db'), { verbose: null });

// WAL mode enables concurrent reads and fast writes with crash safety
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS player_scores (
    category TEXT NOT NULL,
    player_id TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (category, player_id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    serial TEXT,
    provider TEXT NOT NULL, -- 'paypal' | 'wompi' | 'stripe' | 'test'
    external_order_id TEXT UNIQUE,
    idempotency_key TEXT UNIQUE,
    voter_name TEXT NOT NULL,
    voter_handle TEXT NOT NULL,
    category TEXT NOT NULL,
    total_points INTEGER NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL,
    exchange_rate REAL,
    status TEXT NOT NULL, -- 'PENDING', 'COMPLETED', 'DECLINED', 'REFUNDED'
    allocation_json TEXT NOT NULL,
    raw_payload_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS votes_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serial TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    category TEXT NOT NULL,
    player_id TEXT NOT NULL,
    points INTEGER NOT NULL,
    voter_name TEXT NOT NULL,
    voter_handle TEXT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_reversed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(payment_id) REFERENCES payments(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    provider TEXT,
    reference_id TEXT,
    details_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS meta_sequences (
    key TEXT PRIMARY KEY,
    val INTEGER NOT NULL
  );
`);

// Initialize default sequence if not present
const initSeq = db.prepare(`INSERT OR IGNORE INTO meta_sequences (key, val) VALUES ('tx_serial', 4840)`);
initSeq.run();

// Seed initial player scores from live-votes-store.json or defaults if empty
const countScores = db.prepare(`SELECT count(*) as count FROM player_scores`).get();
if (countScores.count === 0) {
  const insertScore = db.prepare(`INSERT OR REPLACE INTO player_scores (category, player_id, points) VALUES (?, ?, ?)`);
  const initialHistoric = {
    '3': 14280, // Lionel Messi
    '1': 12940, // Pelé
    '2': 11850, // Diego Maradona
    '4': 10420, // Cristiano Ronaldo
    '5': 7890,  // Johan Cruyff
    '6': 6510,  // Alfredo Di Stéfano
    '7': 5430,  // Franz Beckenbauer
    '8': 4890,  // Zinedine Zidane
    '9': 4120,  // Ronaldo Nazário
    '10': 3870  // Ronaldinho
  };
  const initial2026 = {
    '101': 9850, // Vinicius Júnior
    '102': 8940, // Kylian Mbappé
    '105': 8430, // Rodri
    '104': 7920, // Jude Bellingham
    '103': 7510, // Erling Haaland
    '106': 6890, // Lamine Yamal
    '108': 5120, // Florian Wirtz
    '107': 4890, // Harry Kane
    '110': 4230, // Dani Carvajal
    '109': 3950  // Phil Foden
  };

  const seedTx = db.transaction(() => {
    for (const [id, pts] of Object.entries(initialHistoric)) {
      insertScore.run('historic', String(id), pts);
    }
    for (const [id, pts] of Object.entries(initial2026)) {
      insertScore.run('current2026', String(id), pts);
    }
  });
  seedTx();
}

/**
 * Get next global transaction serial
 */
function getNextSerial() {
  const updateSeq = db.prepare(`UPDATE meta_sequences SET val = val + 1 WHERE key = 'tx_serial' RETURNING val`);
  const row = updateSeq.get();
  return `#GV-2026-${String(row.val).padStart(6, '0')}`;
}

/**
 * Log an audit event
 */
function logAudit(eventType, provider, referenceId, details) {
  try {
    const stmt = db.prepare(`INSERT INTO audit_logs (event_type, provider, reference_id, details_json) VALUES (?, ?, ?, ?)`);
    stmt.run(eventType, provider, referenceId, JSON.stringify(details || {}));
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}

/**
 * Atomic Order Settlement & Vote Allocation
 * Guarantees that points are only credited ONCE per successful payment.
 */
const settlePaymentAndAllocateVotes = db.transaction((params) => {
  const {
    paymentId,
    provider,
    externalOrderId,
    voterName,
    voterHandle,
    category,
    totalPoints,
    amountCents,
    currency,
    exchangeRate,
    allocation,
    rawPayload
  } = params;

  // 1. Check if payment already recorded
  const checkPayment = db.prepare(`SELECT * FROM payments WHERE id = ? OR (external_order_id = ? AND external_order_id IS NOT NULL)`);
  const existing = checkPayment.get(paymentId, externalOrderId);

  if (existing) {
    if (existing.status === 'COMPLETED') {
      logAudit('PAYMENT_ALREADY_SETTLED', provider, externalOrderId, { paymentId });
      return { alreadySettled: true, payment: existing };
    }
    // Update existing pending payment
    const updateStmt = db.prepare(`
      UPDATE payments 
      SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP, raw_payload_json = ?
      WHERE id = ?
    `);
    updateStmt.run(JSON.stringify(rawPayload || {}), existing.id);
  } else {
    // Insert new completed payment record
    const insertStmt = db.prepare(`
      INSERT INTO payments (
        id, provider, external_order_id, idempotency_key, voter_name, voter_handle,
        category, total_points, amount_cents, currency, exchange_rate, status,
        allocation_json, raw_payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, ?)
    `);
    insertStmt.run(
      paymentId, provider, externalOrderId, paymentId, voterName, voterHandle,
      category, totalPoints, amountCents, currency, exchangeRate || 1.0,
      JSON.stringify(allocation), JSON.stringify(rawPayload || {})
    );
  }

  // 2. Allocate votes to ledger and player_scores
  const serial = getNextSerial();
  db.prepare(`UPDATE payments SET serial = ? WHERE id = ?`).run(serial, existing ? existing.id : paymentId);
  const insertVote = db.prepare(`
    INSERT INTO votes_ledger (serial, payment_id, category, player_id, points, voter_name, voter_handle)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const updatePlayerScore = db.prepare(`
    INSERT INTO player_scores (category, player_id, points)
    VALUES (?, ?, ?)
    ON CONFLICT(category, player_id) DO UPDATE SET points = points + excluded.points
  `);

  for (const [playerId, points] of Object.entries(allocation)) {
    const pts = parseInt(points, 10) || 0;
    if (pts > 0) {
      insertVote.run(serial, paymentId, category, String(playerId), pts, voterName, voterHandle);
      updatePlayerScore.run(category, String(playerId), pts);
    }
  }

  logAudit('VOTES_CREDITED_SUCCESS', provider, externalOrderId, {
    serial,
    paymentId,
    totalPoints,
    amountCents,
    currency
  });

  return {
    alreadySettled: false,
    serial,
    paymentId,
    externalOrderId,
    voterName,
    voterHandle,
    category,
    totalPoints,
    allocation
  };
});

/**
 * Handle Chargeback or Refund with Traceable Reversal
 */
const reversePayment = db.transaction((externalOrderId, reason) => {
  const payment = db.prepare(`SELECT * FROM payments WHERE external_order_id = ?`).get(externalOrderId);
  if (!payment) {
    throw new Error(`Payment with external_order_id ${externalOrderId} not found.`);
  }
  if (payment.status === 'REFUNDED') {
    return { alreadyRefunded: true };
  }

  // Mark payment refunded
  db.prepare(`UPDATE payments SET status = 'REFUNDED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(payment.id);

  // Find all ledger entries for this payment
  const votes = db.prepare(`SELECT * FROM votes_ledger WHERE payment_id = ? AND is_reversed = 0`).all(payment.id);

  const deductScore = db.prepare(`
    UPDATE player_scores 
    SET points = MAX(0, points - ?)
    WHERE category = ? AND player_id = ?
  `);

  const markReversed = db.prepare(`UPDATE votes_ledger SET is_reversed = 1 WHERE id = ?`);

  for (const vote of votes) {
    deductScore.run(vote.points, vote.category, vote.player_id);
    markReversed.run(vote.id);
  }

  logAudit('PAYMENT_REVERSED', payment.provider, externalOrderId, { reason, totalPoints: payment.total_points });

  return { success: true, reversedPoints: payment.total_points };
});

/**
 * Read Leaderboards
 */
function getLeaderboard() {
  const scores = db.prepare(`SELECT category, player_id, points FROM player_scores`).all();
  const historic = {};
  const current2026 = {};

  for (const row of scores) {
    if (row.category === 'historic') {
      historic[row.player_id] = row.points;
    } else {
      current2026[row.player_id] = row.points;
    }
  }

  const recentTransactions = db.prepare(`
    SELECT serial, category, voter_name as voterName, voter_handle as voterHandle, 
           total_points as totalVotes, (amount_cents / 100.0) as amountUsd,
           allocation_json, created_at as timestamp
    FROM payments 
    WHERE status = 'COMPLETED'
    ORDER BY created_at DESC 
    LIMIT 20
  `).all().map(t => ({
    ...t,
    allocation: JSON.parse(t.allocation_json || '{}')
  }));

  return { historic, current2026, recentTransactions };
}

module.exports = {
  db,
  settlePaymentAndAllocateVotes,
  reversePayment,
  getLeaderboard,
  logAudit
};
