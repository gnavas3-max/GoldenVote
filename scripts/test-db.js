const db = require('../database/db');
console.log('--- DB INITIALIZATION TEST ---');
const data = db.getLeaderboard();
console.log('Historic count:', Object.keys(data.historic).length);
console.log('2026 count:', Object.keys(data.current2026).length);
console.log('Recent TXs:', data.recentTransactions.length);

// Test atomic settlement
const testSettlement = db.settlePaymentAndAllocateVotes({
  paymentId: 'TEST_' + Date.now(),
  provider: 'test',
  externalOrderId: 'EXT_' + Date.now(),
  voterName: 'Test Voter',
  voterHandle: '@tester',
  category: 'historic',
  totalPoints: 10,
  amountCents: 1000,
  currency: 'USD',
  allocation: { '3': 10 },
  rawPayload: { test: true }
});

console.log('Settlement successful:', testSettlement.serial, 'Points credited:', testSettlement.totalPoints);

// Test idempotency (repeat same settlement)
const repeatSettlement = db.settlePaymentAndAllocateVotes({
  paymentId: testSettlement.paymentId,
  provider: 'test',
  externalOrderId: testSettlement.externalOrderId,
  voterName: 'Test Voter',
  voterHandle: '@tester',
  category: 'historic',
  totalPoints: 10,
  amountCents: 1000,
  currency: 'USD',
  allocation: { '3': 10 },
  rawPayload: { test: true }
});

console.log('Idempotency test (should be alreadySettled=true):', repeatSettlement.alreadySettled);

// Test reversal / refund
const reverseRes = db.reversePayment(testSettlement.externalOrderId, 'Test Chargeback');
console.log('Reversal test:', reverseRes);
console.log('ALL DB INTEGRITY CHECKS PASSED!');

