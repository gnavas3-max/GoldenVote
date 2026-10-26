# Prompt 5 para Kombai — Modal de Resumen + Pago

## Qué necesito

Cuando el usuario completa su Top 10 y hace clic en "CONFIRMAR MI VOTO — $1 USD", se abre un **modal/overlay** con el resumen de su votación y la opción de pagar.

## Qué debe tener el modal

### Parte 1: Resumen Visual
- Título: "Tu Voto Oficial"
- Muestra los 10 jugadores elegidos en orden, con:
  - Posición (#1 a #10)
  - Foto/avatar del jugador
  - Nombre
  - Puntos que aporta
- El GOAT (#1) debe verse más destacado que el resto
- Total de puntos repartidos: 101 puntos

### Parte 2: Datos del Votante (opcional)
- Campo: "Tu nombre o nickname" (opcional)
- Campo: "Tu @ de Twitter/Instagram" (opcional)
- Estos datos se usarán para personalizar el certificado de votación

### Parte 3: Pago
- Precio claro y grande: **"$1.00 USD"**
- Texto: "Tu voto se sumará al ranking global en tiempo real"
- Botones de pago (por ahora son placeholders, no conectados a Stripe todavía):
  - Botón Apple Pay (negro)
  - Botón Google Pay (blanco/negro)
  - Botón "Pagar con tarjeta"
  - Botón PayPal (azul)
- Debajo: texto pequeño de seguridad "Pago seguro procesado por Stripe 🔒"

### Parte 4: Botón de cerrar
- Una X en la esquina para cerrar el modal si el usuario quiere cambiar algo

## Estilo visual
- Modal con fondo oscuro semi-transparente (backdrop blur)
- El modal en sí con fondo oscuro y bordes dorados sutiles
- Que se sienta como el paso final antes de hacer historia
- Animación suave al abrir y cerrar

## Nota importante
Los botones de pago son SOLO visuales por ahora. No necesitan funcionar. Solo necesitan verse exactamente como se verían los botones reales de Apple Pay, Google Pay y Stripe.

