# Prompt 6 para Kombai — Certificado de Votación + Compartir en Redes

## Qué necesito

Después de que el usuario "paga" (por ahora simulado), se muestra una **pantalla de éxito** con su **certificado de votación oficial** listo para descargar y compartir en redes sociales.

## El Certificado (Golden Ballot Pass)

Es una **imagen/tarjeta vertical en formato 9:16** (formato Stories de Instagram / TikTok) que contiene:

1. **Marco dorado metálico** con bordes elegantes
2. **Sello en la esquina superior**: "VOTO OFICIAL VERIFICADO" con un número de serie (ej: #004812)
3. **En el centro, grande**: La foto/avatar del jugador elegido como GOAT (#1), con una corona dorada encima o un efecto de brillo
4. **Nombre del GOAT** debajo de la foto, en tipografía grande y dorada
5. **Lista del Top 10 completo** debajo, en texto más pequeño pero legible:
   - #1 Messi — 25 pts
   - #2 Pelé — 18 pts
   - (etc.)
6. **Nombre/@ del votante** (si lo proporcionó)
7. **Marca de agua** discreta con el logo "THE GOLDEN VOTE" y la URL de la web
8. **Código QR pequeño** en la esquina inferior que lleva a la web

## La Pantalla de Éxito

Cuando se muestra después del pago:

1. Animación de celebración (confetti dorado, partículas, lo que se vea bien)
2. El certificado se muestra centrado y grande
3. **Botones de acción**:
   - 🖼️ **"Descargar Imagen HD"** — descarga la tarjeta como imagen PNG
   - 🐦 **"Compartir en X (Twitter)"** — abre Twitter con un texto pre-escrito polémico + la imagen adjunta. Ejemplo de texto:
     > "Mi GOAT oficial es [NOMBRE]. Acabo de certificar mi voto en el Super Balón de Oro histórico. ¿Tú a quién pones #1? 🏆 #SuperBallonDor #GOAT [URL]"
   - 📱 **"Compartir en Instagram"** — instrucciones de cómo compartir en stories
   - 🔗 **"Copiar link"** — copia el link de la web al portapapeles
4. **Botón secundario**: "Votar de nuevo" (volver al tier list)
5. **Texto motivacional**: "Tu voto ya está en el ranking global. Comparte tu certificado y demuéstrale al mundo quién es el verdadero GOAT."

## Estilo visual
- Pantalla de celebración con fondo oscuro y partículas/confetti dorado
- El certificado debe verse REAL y PREMIUM — como un documento oficial elegante
- Los botones de compartir deben ser grandes y fáciles de usar
- Que el usuario sienta orgullo de compartir esta imagen

## Nota técnica
- Por ahora el certificado puede ser un componente visual (HTML/CSS) renderizado en pantalla
- La funcionalidad de "descargar como imagen" se puede implementar con html-to-canvas después
- El texto de Twitter puede ser un link `https://twitter.com/intent/tweet?text=...`

