require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const crypto = require('crypto');

// Database and payment services
const dbService = require('./database/db');
const paypalService = require('./services/paypal');
const wompiService = require('./services/wompi');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Optimization Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows PayPal / Wompi CDN & Google Fonts seamlessly
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());

// Raw body parser for webhook signature verifications
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON body parser
app.use(express.json());

// Server-Sent Events (SSE) Hub for real-time live scrutinizing
let sseClients = [];

app.get('/api/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Escrutinio en tiempo real conectado', clientId })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

function broadcastLiveEvent(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(c => {
    try {
      c.res.write(msg);
    } catch(e) {}
  });
}

// ============================================================================
// 1. PUBLIC CONFIGURATION & LEADERBOARDS
// ============================================================================
app.get('/api/config', (req, res) => {
  res.json({
    paypalClientId: paypalService.clientId || 'sb',
    paypalConfigured: paypalService.isConfigured(),
    wompiPublicKey: wompiService.publicKey || '',
    wompiConfigured: wompiService.isConfigured(),
    usdCopRate: wompiService.usdCopRate,
    pricePerPointUsd: 1.00
  });
});

app.get('/api/leaderboard', (req, res) => {
  try {
    const data = dbService.getLeaderboard();
    res.json(data);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Database read error' });
  }
});

// ============================================================================
// 2. PAYPAL INTEGRATION (Orders v2 API)
// ============================================================================

/**
 * Create PayPal Order
 * Strictly validates point count on the server (1 Punto = 1 USD).
 */
app.post('/api/payments/paypal/create-order', async (req, res) => {
  try {
    const { totalPoints, allocation, category, voterName, voterHandle } = req.body;
    
    // Strict server-side validation
    const points = parseInt(totalPoints, 10);
    if (!points || isNaN(points) || points <= 0 || points > 100000) {
      return res.status(400).json({ error: 'Cantidad de puntos inválida.' });
    }

    if (!allocation || typeof allocation !== 'object' || Object.keys(allocation).length === 0) {
      return res.status(400).json({ error: 'Debe seleccionar al menos un jugador.' });
    }

    const internalTxId = 'PAYPAL_' + crypto.randomUUID();
    const amountCents = points * 100; // Integer cents strictly calculated on server

    // If PayPal keys are configured, create real PayPal Order via Orders v2 API
    if (paypalService.isConfigured()) {
      const order = await paypalService.createOrder({
        points,
        referenceId: internalTxId,
        description: `The Golden Vote — ${points} Puntos Oficiales (${category})`
      });

      // Save pending record in DB
      const insertPending = dbService.db.prepare(`
        INSERT INTO payments (
          id, provider, external_order_id, idempotency_key, voter_name, voter_handle,
          category, total_points, amount_cents, currency, status, allocation_json
        ) VALUES (?, 'paypal', ?, ?, ?, ?, ?, ?, ?, 'USD', 'PENDING', ?)
      `);
      insertPending.run(
        internalTxId, order.id, internalTxId, voterName || 'Aficionado Oficial',
        voterHandle || '@anonimo', category, points, amountCents, JSON.stringify(allocation)
      );

      return res.json({
        orderId: order.id,
        internalTxId
      });
    } else {
      // Safe local sandbox simulation fallback
      return res.json({
        orderId: 'SANDBOX_ORDER_' + Date.now(),
        internalTxId,
        isSimulated: true
      });
    }
  } catch (error) {
    console.error('PayPal create-order error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Capture PayPal Order after voter authorizes payment
 * Authoritatively credits points into database upon PayPal confirmation.
 */
app.post('/api/payments/paypal/capture-order', async (req, res) => {
  try {
    const { orderId, totalPoints, allocation, category, voterName, voterHandle } = req.body;
    const points = parseInt(totalPoints, 10);

    if (!orderId) {
      return res.status(400).json({ error: 'Falta orderId de PayPal.' });
    }

    let captureResult = null;
    let externalStatus = 'COMPLETED';

    if (paypalService.isConfigured()) {
      captureResult = await paypalService.captureOrder(orderId);
      externalStatus = captureResult.status; // Must be 'COMPLETED'
      if (externalStatus !== 'COMPLETED') {
        return res.status(400).json({ error: `El estado del pago es ${externalStatus}, no se acreditaron votos.` });
      }
    }

    // Atomic settlement in database
    const settlement = dbService.settlePaymentAndAllocateVotes({
      paymentId: 'PAYPAL_' + orderId,
      provider: 'paypal',
      externalOrderId: orderId,
      voterName: voterName || 'Aficionado Oficial',
      voterHandle: voterHandle || '@anonimo',
      category: category || 'historic',
      totalPoints: points,
      amountCents: points * 100,
      currency: 'USD',
      allocation: allocation || {},
      rawPayload: captureResult || { status: 'COMPLETED_MOCK' }
    });

    // Broadcast live event via SSE
    broadcastLiveEvent({
      type: 'VOTE_CONFIRMED',
      serial: settlement.serial,
      category: settlement.category,
      voterName: settlement.voterName,
      voterHandle: settlement.voterHandle,
      totalVotes: settlement.totalPoints,
      allocation: settlement.allocation,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      serial: settlement.serial,
      message: 'Pago de PayPal verificado y votos acreditados.'
    });
  } catch (error) {
    console.error('PayPal capture error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 3. WOMPI INTEGRATION (COLOMBIA / COP CHECKOUT)
// ============================================================================

/**
 * Create Wompi Checkout Parameters
 * Converts USD points to COP at configurable rate and signs with integrity secret.
 */
app.post('/api/payments/wompi/create-checkout', (req, res) => {
  try {
    const { totalPoints, allocation, category, voterName, voterHandle, redirectUrl } = req.body;
    const points = parseInt(totalPoints, 10);

    if (!points || isNaN(points) || points <= 0 || points > 100000) {
      return res.status(400).json({ error: 'Cantidad de puntos inválida.' });
    }

    if (!allocation || typeof allocation !== 'object' || Object.keys(allocation).length === 0) {
      return res.status(400).json({ error: 'Debe seleccionar al menos un jugador.' });
    }

    const reference = `TGV-WOMPI-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const checkoutData = wompiService.prepareCheckoutData({
      points,
      reference,
      redirectUrl
    });

    // Save pending payment record in DB
    const insertPending = dbService.db.prepare(`
      INSERT INTO payments (
        id, provider, external_order_id, idempotency_key, voter_name, voter_handle,
        category, total_points, amount_cents, currency, exchange_rate, status, allocation_json
      ) VALUES (?, 'wompi', ?, ?, ?, ?, ?, ?, ?, 'COP', ?, 'PENDING', ?)
    `);
    insertPending.run(
      reference, reference, reference, voterName || 'Aficionado Oficial',
      voterHandle || '@anonimo', category, points, checkoutData.amountInCents,
      checkoutData.usdCopRate, JSON.stringify(allocation)
    );

    res.json(checkoutData);
  } catch (error) {
    console.error('Wompi create-checkout error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Wompi Webhook Notification Endpoint
 * Authoritative point accreditation based on verified Wompi webhook event.
 */
app.post('/api/webhooks/wompi', (req, res) => {
  try {
    const rawBody = req.body.toString('utf8');
    const isValid = wompiService.verifyWebhookEvent(rawBody, req.headers);

    if (!isValid) {
      dbService.logAudit('WOMPI_INVALID_SIGNATURE', 'wompi', null, { rawBody });
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(rawBody);
    const tx = event.data && event.data.transaction;

    if (!tx) {
      return res.status(400).send('No transaction data');
    }

    const reference = tx.reference;
    const status = tx.status; // 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR'

    // Look up original pending order
    const pending = dbService.db.prepare(`SELECT * FROM payments WHERE external_order_id = ? OR id = ?`).get(reference, reference);

    if (!pending) {
      dbService.logAudit('WOMPI_TRANSACTION_NOT_FOUND', 'wompi', reference, tx);
      return res.status(200).json({ received: true });
    }

    if (status === 'APPROVED') {
      const settlement = dbService.settlePaymentAndAllocateVotes({
        paymentId: pending.id,
        provider: 'wompi',
        externalOrderId: tx.id || reference,
        voterName: pending.voter_name,
        voterHandle: pending.voter_handle,
        category: pending.category,
        totalPoints: pending.total_points,
        amountCents: tx.amount_in_cents || pending.amount_cents,
        currency: tx.currency || 'COP',
        exchangeRate: pending.exchange_rate,
        allocation: JSON.parse(pending.allocation_json || '{}'),
        rawPayload: tx
      });

      if (!settlement.alreadySettled) {
        broadcastLiveEvent({
          type: 'VOTE_CONFIRMED',
          serial: settlement.serial,
          category: settlement.category,
          voterName: settlement.voterName,
          voterHandle: settlement.voterHandle,
          totalVotes: settlement.totalPoints,
          allocation: settlement.allocation,
          timestamp: new Date().toISOString()
        });
      }
    } else if (status === 'DECLINED' || status === 'ERROR') {
      dbService.db.prepare(`UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, pending.id);
      dbService.logAudit('WOMPI_PAYMENT_FAILED', 'wompi', reference, { status, tx });
    } else if (status === 'VOIDED') {
      // Possible chargeback / void
      dbService.reversePayment(reference, 'Wompi Transaction Voided');
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Wompi webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 4. PAYPAL WEBHOOK NOTIFICATION ENDPOINT
// ============================================================================
app.post('/api/webhooks/paypal', async (req, res) => {
  try {
    const rawBody = req.body.toString('utf8');
    const headers = req.headers;

    const isValid = await paypalService.verifyWebhookSignature({
      headers,
      body: rawBody,
      rawBody
    });

    if (!isValid) {
      dbService.logAudit('PAYPAL_INVALID_SIGNATURE', 'paypal', null, { headers });
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event_type;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = event.resource;
      const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;

      // Ensure points are settled
      const pending = dbService.db.prepare(`SELECT * FROM payments WHERE external_order_id = ? OR id = ?`).get(orderId, 'PAYPAL_' + orderId);
      if (pending && pending.status !== 'COMPLETED') {
        const settlement = dbService.settlePaymentAndAllocateVotes({
          paymentId: pending.id,
          provider: 'paypal',
          externalOrderId: orderId,
          voterName: pending.voter_name,
          voterHandle: pending.voter_handle,
          category: pending.category,
          totalPoints: pending.total_points,
          amountCents: Math.round(parseFloat(resource.amount.value) * 100),
          currency: resource.amount.currency_code,
          allocation: JSON.parse(pending.allocation_json || '{}'),
          rawPayload: resource
        });

        if (!settlement.alreadySettled) {
          broadcastLiveEvent({
            type: 'VOTE_CONFIRMED',
            serial: settlement.serial,
            category: settlement.category,
            voterName: settlement.voterName,
            voterHandle: settlement.voterHandle,
            totalVotes: settlement.totalPoints,
            allocation: settlement.allocation,
            timestamp: new Date().toISOString()
          });
        }
      }
    } else if (eventType === 'PAYMENT.CAPTURE.REFUNDED' || eventType === 'PAYMENT.CAPTURE.REVERSED') {
      const resource = event.resource;
      const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
      dbService.reversePayment(orderId, `PayPal Event: ${eventType}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// 5. STATIC ASSETS & SINGLE PAGE APP
// ============================================================================
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '7d' }));
app.use('/data', express.static(path.join(__dirname, 'data'), { maxAge: '1h' }));

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://thegoldenvote.football/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thegoldenvote.football/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏆 THE GOLDEN VOTE 2026 — SERVIDOR EN PRODUCCIÓN ACTIVO`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`🔒 Pasarela PayPal: ${paypalService.isConfigured() ? 'LIVE / SANDBOX ACTIVO' : 'MODO SIMULACIÓN LOCAL'}`);
  console.log(`💳 Pasarela Wompi: ${wompiService.isConfigured() ? 'LIVE / SANDBOX ACTIVO' : 'MODO SIMULACIÓN LOCAL'}`);
  console.log(`💾 Base de Datos: SQLite WAL (Atomic Transactions & Idempotency)`);
  console.log(`📡 Escrutinio en tiempo real (SSE) activo`);
  console.log(`=======================================================`);
});
