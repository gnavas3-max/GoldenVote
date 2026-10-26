/**
 * Wompi (Colombia) Integration Service
 * Converts USD points to COP at configurable exchange rate.
 * Generates SHA-256 integrity signature according to official Wompi specifications:
 * Checksum = SHA256(reference + amountInCents + currency + integritySecret)
 * Also verifies event signatures from Wompi webhooks.
 */
const crypto = require('crypto');

class WompiService {
  constructor() {
    this.publicKey = process.env.WOMPI_PUBLIC_KEY || '';
    this.privateKey = process.env.WOMPI_PRIVATE_KEY || '';
    this.integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';
    this.eventsSecret = process.env.WOMPI_EVENTS_SECRET || '';
    this.environment = process.env.WOMPI_ENVIRONMENT || 'sandbox'; // 'sandbox' | 'production'
    this.usdCopRate = parseFloat(process.env.USD_COP_RATE || '4200'); // Configurable rate, e.g. 4,200 COP per USD
  }

  getBaseUrl() {
    return this.environment === 'production'
      ? 'https://production.wompi.co/v1'
      : 'https://sandbox.wompi.co/v1';
  }

  isConfigured() {
    return !!(this.publicKey && !this.publicKey.includes('placeholder'));
  }

  /**
   * Convert USD to COP Cents (Wompi handles COP in standard cents: e.g. 42,000 COP = 4200000 cents)
   * 1 Point = 1 USD = USD_COP_RATE * 100 COP cents
   */
  calculateCopAmount(points) {
    const copAmount = Math.round(points * this.usdCopRate);
    const amountInCents = copAmount * 100;
    return {
      points,
      usdCopRate: this.usdCopRate,
      copAmount,
      amountInCents
    };
  }

  /**
   * Generate SHA-256 integrity signature for Wompi Checkout Widget
   * Formula: SHA256(reference + amountInCents + currency + integritySecret)
   */
  generateIntegritySignature(reference, amountInCents, currency = 'COP') {
    if (!this.integritySecret) {
      return null;
    }
    const rawString = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  /**
   * Prepare a checkout session for Wompi Widget
   */
  prepareCheckoutData({ points, reference, redirectUrl }) {
    const { copAmount, amountInCents, usdCopRate } = this.calculateCopAmount(points);
    const currency = 'COP';
    const signature = this.generateIntegritySignature(reference, amountInCents, currency);

    return {
      publicKey: this.publicKey,
      currency,
      amountInCents,
      copAmount,
      usdCopRate,
      reference,
      signatureIntegrity: signature,
      redirectUrl: redirectUrl || ''
    };
  }

  /**
   * Verify Wompi Webhook Event Signature
   * Wompi sends:
   * event.signature.checksum: SHA256(event.data.transaction.id + status + amount_in_cents + timestamp + eventsSecret)
   * event.signature.properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents']
   */
  verifyWebhookEvent(body, headers) {
    if (!this.eventsSecret) {
      console.warn('WOMPI_EVENTS_SECRET not set. Skipping signature check in test environment.');
      return true;
    }

    try {
      const event = typeof body === 'string' ? JSON.parse(body) : body;
      const signature = event.signature;
      if (!signature || !signature.checksum || !signature.properties) {
        return false;
      }

      // Concatenate properties according to Wompi specs
      let concatenated = '';
      for (const prop of signature.properties) {
        const parts = prop.split('.');
        let val = event.data;
        for (const p of parts) {
          val = val ? val[p] : undefined;
        }
        concatenated += val !== undefined ? String(val) : '';
      }
      concatenated += String(event.timestamp);
      concatenated += this.eventsSecret;

      const expectedChecksum = crypto.createHash('sha256').update(concatenated).digest('hex');
      return expectedChecksum.toLowerCase() === signature.checksum.toLowerCase();
    } catch (err) {
      console.error('Wompi signature verification error:', err.message);
      return false;
    }
  }

  /**
   * Fetch transaction status from Wompi API for authoritative verification
   */
  async getTransaction(transactionId) {
    const response = await fetch(`${this.getBaseUrl()}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${this.privateKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Wompi transaction: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }
}

module.exports = new WompiService();

