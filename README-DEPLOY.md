# 🏆 The Golden Vote — Manual de Producción, Seguridad y Pasarelas de Pago

Arquitectura empresarial de pagos en producción para **THE GOLDEN VOTE** (1 PUNTO = US$1.00), integrando **PayPal (API Orders v2)**, **Wompi (Colombia / COP)** y persistencia transaccional ACID con **SQLite WAL**, prevención de fraude, idempotencia criptográfica y libro contable auditado (*ledger*).

---

## 1. Arquitectura del Sistema

```
                      ┌───────────────────────────────────────┐
                      │    NAVEGADOR CLIENTE (Frontend)      │
                      │  UI Lujo Oscuro + Ranking en Vivo     │
                      │  (1 Punto = 1 USD / COP Wompi)       │
                      └───────┬──────────────────────┬────────┘
                              │                      │
             PayPal Checkout  │                      │ Wompi Widget Checkout
             (Orders v2)      │                      │ (Integrity SHA-256)
                              ▼                      ▼
                      ┌───────────────────────────────────────┐
                      │      BACKEND NODE.JS / EXPRESS        │
                      │   - Validación Estricta de Montos    │
                      │   - Cero Confianza en Input Cliente  │
                      │   - Conversión USD/COP en Servidor   │
                      └───────┬──────────────────────┬────────┘
                              │                      │
             Verificación API │                      │ Webhooks & Signatures
             & Idempotencia   │                      │ (Events Secret)
                              ▼                      ▼
                      ┌───────────────────────────────────────┐
                      │      SQLITE PERSISTENTE (WAL MODE)    │
                      │   - payments (Estados, IDs, Hash)     │
                      │   - votes_ledger (Trazabilidad 100%)  │
                      │   - player_scores (Puntos Atómicos)   │
                      │   - audit_logs (Eventos Inmutables)   │
                      └───────────────────────────────────────┘
```

---

## 2. Reglas Críticas de Negocio & Seguridad

1. **1 Punto = Exactamente US$1.00 (100 centavos USD)**:
   - Los precios e importes **nunca** se confían al frontend. El servidor calcula:
     $$\text{amount\_cents} = \text{totalPoints} \times 100$$
2. **Acreditación Atómica & Anti-Duplicados (Idempotencia)**:
   - Ningún voto se acredita dos veces aunque PayPal o Wompi reenvíen el webhook repetidamente.
   - Cada liquidación opera en una transacción `better-sqlite3` con modo WAL (*Write-Ahead Logging*).
3. **No Acreditación por Redirección**:
   - Los votos solo se acreditan tras verificación de firma de webhook o captura autorizada en el backend vía API.
4. **Soporte de Reversión (Contracargos y Devoluciones)**:
   - Si se detecta un evento `REFUNDED` o `VOIDED`, el sistema descuenta los votos del ranking con trazabilidad en el ledger de auditoría.
5. **Wompi (Colombia)**:
   - Cobra en pesos colombianos (COP). El servidor calcula el valor con la tasa configurable `USD_COP_RATE` (ej. 4.200 COP/USD):
     $$\text{amount\_in\_cents} = \text{puntos} \times \text{USD\_COP\_RATE} \times 100$$
   - Genera la firma SHA-256 obligatoria:
     $$\text{SHA256}(\text{reference} + \text{amount\_in\_cents} + \text{currency} + \text{integrity\_secret})$$

---

## 3. Variables de Entorno (`.env`)

Copia el archivo `.env.example` a `.env` y configura tus llaves:

```ini
PORT=3000
NODE_ENV=production

# -------------------------------------------------------------
# 1. PAYPAL CHECKOUT (API Orders v2)
# https://developer.paypal.com/dashboard/applications
# -------------------------------------------------------------
PAYPAL_ENVIRONMENT=sandbox  # Cambiar a 'live' en producción
PAYPAL_CLIENT_ID=BAA8dDuR0cjYiGEEupDLLLeEfSwf81SfYLkTO3gxI_x59hMaQWL0X_S4B0ycLz9Y6PYIzLGZU3dfqAlKCA
PAYPAL_CLIENT_SECRET=EHcY-s0RPx-_Qa1h_bXaFbWvUbqiQ21f3rxKIb96k5ao-_q0dyzfGmyovHr727_FKy4Zd9vYLRIj4R3t
PAYPAL_WEBHOOK_ID=tu_paypal_webhook_id

# -------------------------------------------------------------
# 2. WOMPI (COLOMBIA - PSE, Nequi, Bancolombia, Tarjetas)
# https://comercios.wompi.co o https://sandbox.wompi.co
# -------------------------------------------------------------
WOMPI_ENVIRONMENT=sandbox  # Cambiar a 'production' en producción
WOMPI_PUBLIC_KEY=pub_prod_... / pub_test_...
WOMPI_PRIVATE_KEY=prv_prod_... / prv_test_...
WOMPI_INTEGRITY_SECRET=prod_integrity_... / test_integrity_...
WOMPI_EVENTS_SECRET=prod_events_... / test_events_...
USD_COP_RATE=4200
```

---

## 4. Endpoints del Backend

| Método | Endpoint | Descripción | Seguridad |
|---|---|---|---|
| `GET` | `/api/config` | Retorna llaves públicas y tasa USD/COP | Público |
| `GET` | `/api/leaderboard` | Retorna ranking actual y últimas compras | Cacheable |
| `GET` | `/api/live-stream` | SSE para actualización en tiempo real | Conexión permanente |
| `POST` | `/api/payments/paypal/create-order` | Crea orden oficial PayPal Orders v2 | Validación estricta |
| `POST` | `/api/payments/paypal/capture-order` | Captura orden y acredita votos | Transacción atómica |
| `POST` | `/api/payments/wompi/create-checkout` | Genera parámetros y firma SHA-256 | Integridad servidor |
| `POST` | `/api/webhooks/paypal` | Webhook oficial de PayPal | Firma PayPal API |
| `POST` | `/api/webhooks/wompi` | Webhook oficial de Wompi | Firma SHA-256 |

---

## 5. Pruebas Automatizadas de Seguridad & Pagos

Para ejecutar la batería completa de pruebas que valida montos, firmas, idempotencia, acreditación y reversión de contracargos:

```bash
node scripts/test-payments.js
```

Resultados garantizados:
- ✅ Conversión USD $\rightarrow$ COP y cálculo exacto de centavos.
- ✅ Firma criptográfica SHA-256 de Wompi.
- ✅ Acreditación atómica en base de datos SQLite y generación de serial `#GV-2026-XXXXXX`.
- ✅ Detección y bloqueo de notificaciones duplicadas (Idempotencia).
- ✅ Reversión automática del ranking ante contracargos/devoluciones.
- ✅ Registro inmutable en tabla `audit_logs`.

---

## 6. Despliegue en Producción (Vercel / Railway / Render / VPS)

### Opción A: Railway o Render (Recomendado para Node + SQLite/Postgres)
1. Conecta tu repositorio de GitHub en el panel de Railway o Render.
2. Agrega las variables de entorno detalladas arriba.
3. El comando de inicio es: `npm start`.

### Opción B: Servidor VPS propio (Ubuntu / Debian / Docker)
```bash
# 1. Clonar repositorio e instalar dependencias
git clone <tu-repositorio>
cd rapIA
npm install --production

# 2. Configurar variables reales en .env
cp .env.example .env
nano .env

# 3. Iniciar con PM2 para alta disponibilidad
npm install -g pm2
pm2 start server.js --name "golden-vote"
pm2 save
pm2 startup
```

# 2. Configurar variables reales en .env
cp .env.example .env
nano .env

# 3. Iniciar con PM2 para alta disponibilidad
npm install -g pm2
pm2 start server.js --name "golden-vote"
pm2 save
pm2 startup
```

