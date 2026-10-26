# Guía de Identidad Visual — THE GOLDEN VOTE

## Nombre del Proyecto
**THE GOLDEN VOTE** / *El Super Balón de Oro*

## Tagline
"El Debate Definitivo del Fútbol"

## Mood Board (Referencia de Sensación)
- Noche de gala de premios en París
- Cartas doradas de FIFA Ultimate Team
- Pantalla de resultados electorales en vivo
- Álbum Panini pero premium/digital
- El brillo del trofeo del Balón de Oro bajo focos

## Paleta de Colores

### Primarios
| Color | Hex | Uso |
|---|---|---|
| Obsidian | #09090B | Fondo principal |
| Carbon | #121216 | Fondo de tarjetas/secciones |
| Smoke | #1A1A1F | Fondo de elementos secundarios |

### Acentos Dorados
| Color | Hex | Uso |
|---|---|---|
| Gold Light | #FFE082 | Brillos, glows, acentos de luz |
| Gold Primary | #D4AF37 | Bordes, íconos, badges, texto importante |
| Gold Dark | #8C6D1F | Sombras doradas, gradientes |
| Gold Gradient | linear-gradient(135deg, #FFDF73 0%, #D4AF37 50%, #8C6D1F 100%) | Barras, botones CTA, marcos |

### Categorías
| Color | Hex | Uso |
|---|---|---|
| Controversy Red | #FF4444 | Categoría "Polémica Histórica" |
| Winner Gold | #D4AF37 | Categoría "Ganadores Oficiales" |
| Legend Silver | #8B8B8B | Categoría "Leyendas" |
| Modern Cyan | #00D4FF | Categoría "Siglo XXI" |

### Texto
| Color | Hex | Uso |
|---|---|---|
| White | #FFFFFF | Títulos principales |
| Light Gray | #E0E0E0 | Texto de cuerpo |
| Medium Gray | #888888 | Texto secundario, captions |
| Gold Text | #D4AF37 | Texto destacado, labels |

## Tipografía

### Display / Títulos
- **Fuente sugerida:** Cinzel, Syne, Playfair Display, o similar display/serif moderna
- **Uso:** H1, H2, títulos de sección, nombres de jugadores destacados
- **Peso:** Bold, Semibold
- **Estilo:** Uppercase para títulos principales

### Cuerpo / UI
- **Fuente sugerida:** Plus Jakarta Sans, Inter, DM Sans, o similar sans-serif geométrica
- **Uso:** Párrafos, botones, labels, navegación
- **Peso:** Regular, Medium, Semibold

## Efectos Visuales

### Glassmorphism
```css
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(212, 175, 55, 0.15);
```

### Golden Glow
```css
box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
```

### Card Hover (Reflejo Holográfico)
```css
/* Al pasar el cursor, un gradiente diagonal se mueve por la tarjeta */
background: linear-gradient(135deg, transparent 40%, rgba(255, 224, 130, 0.1) 50%, transparent 60%);
```

## Principios de Diseño

1. **Premium, no pretencioso**: Se ve caro pero es accesible. $1 USD.
2. **Divertido, no infantil**: Gamificado como un videojuego, serio como un debate histórico.
3. **Emocional, no frío**: Cada interacción (arrastrar un jugador, ver el ranking) debe provocar emoción.
4. **Limpio, no vacío**: Espaciado generoso pero con suficiente contenido para que no se sienta desierto.
5. **Coherente, no monótono**: La paleta oscura/dorada es la base, pero cada sección tiene su personalidad.

