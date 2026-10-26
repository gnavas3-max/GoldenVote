# Prompt 8 para Kombai — Footer, FAQ (SEO) y Meta Tags

## Qué necesito

La sección final de la web: un **footer completo** con FAQ (para SEO), links importantes y los meta tags para que el link se vea genial cuando se comparta en redes sociales.

## Sección FAQ (Preguntas Frecuentes)

Coloca un bloque de preguntas frecuentes en formato **acordeón** (clic para expandir) ANTES del footer. Las preguntas deben responder lo que la gente busca en Google:

1. **¿Por qué Pelé nunca ganó el Balón de Oro?**
   > Porque entre 1956 y 1994, el Balón de Oro solo podía ser ganado por jugadores de nacionalidad europea. Pelé, al ser brasileño, quedaba automáticamente excluido aunque fuera el mejor del mundo.

2. **¿Por qué Maradona nunca ganó el Balón de Oro?**
   > A pesar de jugar en el Napoli y Barcelona (clubes europeos), Maradona no podía competir porque el requisito era tener NACIONALIDAD europea, no solo jugar en Europa. Siendo argentino, quedó excluido.

3. **¿Qué fue el Super Balón de Oro de 1989?**
   > En 1989, la revista France Football entregó por única vez el Super Balón de Oro para conmemorar 30 años de la Copa de Europa. Ganó Alfredo Di Stéfano, que tenía pasaporte español. Pelé y Maradona fueron excluidos por las mismas reglas.

4. **¿Cómo funciona la votación?**
   > Cada persona arma su Top 10 de los mejores futbolistas de la historia, arrastrando jugadores de un pool de 50 leyendas. El puesto #1 vale 25 puntos, el #2 vale 18, y así sucesivamente. Cada voto cuesta $1 USD y se suma al ranking global en tiempo real.

5. **¿Puedo votar por un jugador que no esté en la lista?**
   > Sí. Tienes un "voto comodín" que te permite agregar a cualquier jugador que no esté en el Top 50 oficial.

6. **¿Cuánto cuesta votar?**
   > $1.00 USD por voto. El pago se realiza de forma segura a través de Stripe.

7. **¿Qué recibo al votar?**
   > Recibes un certificado digital oficial ("Golden Ballot Pass") con tu Top 10 personalizado, listo para descargar y compartir en tus redes sociales.

8. **¿Cuántas veces puedo votar?**
   > Puedes votar una vez. Un voto, una voz.

## Footer

- Logo "THE GOLDEN VOTE" en versión pequeña
- Links: Inicio | La Historia | Votar | Ranking | FAQ
- Links legales: Términos y Condiciones | Política de Privacidad
- Texto: "© 2026 The Golden Vote. Todos los derechos reservados."
- Redes sociales: íconos de Twitter/X, Instagram, TikTok (placeholder links)
- Texto sutil: "Este proyecto no está afiliado con France Football ni con la ceremonia oficial del Balón de Oro."

## Meta Tags para Redes Sociales (Open Graph)

Agrega estos meta tags en el `<head>` de la página:

```html
<title>THE GOLDEN VOTE — ¿Quién es el verdadero GOAT del fútbol?</title>
<meta name="description" content="En 1989 Pelé y Maradona fueron excluidos del Super Balón de Oro. Hoy el mundo decide. Arma tu Top 10, vota por $1 USD y comparte tu certificado oficial." />
<meta property="og:title" content="THE GOLDEN VOTE — El Debate Definitivo del Fútbol" />
<meta property="og:description" content="Pelé, Maradona, Messi, CR7... ¿Quién merece el Super Balón de Oro histórico? Vota y demuéstralo." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="THE GOLDEN VOTE — ¿Quién es tu GOAT?" />
<meta name="twitter:description" content="Arma tu Top 10 de los mejores de la historia y certifica tu voto. $1 USD." />
```

## Estilo visual
- FAQ con acordeones elegantes, bordes dorados sutiles
- Footer minimalista, oscuro, con tipografía pequeña
- Mantén la coherencia con toda la web

