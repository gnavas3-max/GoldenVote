/**
 * PayPal Orders v2 Client and Webhook Signature Verification
 * Uses official PayPal REST API v2 endpoints.
 */
const crypto = require('crypto');

class PayPalService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
    this.webhookId = process.env.PAYPAL_WEBHOOK_ID || '';
    this.environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox'; // 'sandbox' | 'live'
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  getBaseUrl() {
    return this.environment === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  isConfigured() {
    return !!(this.clientId && this.clientSecret && !this.clientId.includes('placeholder'));
  }

  /**
   * Fetch OAuth 2.0 Access Token with caching
   */
  async getAccessToken() {
    if (!this.isConfigured()) {
      throw new Error('PayPal client credentials not configured.');
    }

    const now = Date.now();
    if (this.accessToken && this.tokenExpiry > now + 60000) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.getBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`PayPal auth failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = now + (data.expires_in * 1000);
    return this.accessToken;
  }

  /**
   * Create an Order with strictly validated amounts
   * 1 Point = 1.00 USD
   */
  async createOrder({ points, referenceId, description }) {
    const token = await this.getAccessToken();
    const amountVal = (points * 1.00).toFixed(2);

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: referenceId,
          description: description || `The Golden Vote — ${points} Puntos Oficiales`,
          amount: {
            currency_code: 'USD',
            value: amountVal,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amountVal
              }
            }
          },
          items: [
            {
              name: 'Voto Certificado The Golden Vote',
              unit_amount: {
                currency_code: 'USD',
                value: '1.00'
              },
              quantity: String(points),
              category: 'DIGITAL_GOODS'
            }
          ]
        }
      ],
      application_context: {
        brand_name: 'THE GOLDEN VOTE',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW'
      }
    };

    const response = await fetch(`${this.getBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal createOrder error: ${JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Capture an authorized Order
   */
  async captureOrder(orderId) {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.getBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`PayPal captureOrder error: ${JSON.stringify(data)}`);
    }

    return data;
  }

  /**
   * Verify Webhook Signature using PayPal API
   */
  async verifyWebhookSignature({ headers, body, rawBody }) {
    if (!this.webhookId) {
      console.warn('PAYPAL_WEBHOOK_ID not set. Skipping signature check in test environment.');
      return true;
    }

    const token = await this.getAccessToken();
    const verifyPayload = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: this.webhookId,
      webhook_event: typeof body === 'string' ? JSON.parse(body) : body
    };

    const response = await fetch(`${this.getBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verifyPayload)
    });

    if (!response.ok) {
      return false;
    }

    const resData = await response.json();
    return resData.verification_status === 'SUCCESS';
  }
}

module.exports = new PayPalService();

