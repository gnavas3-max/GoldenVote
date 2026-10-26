# Prompt 4 para Kombai — Tier List / Tablero de Votación Interactivo

## Qué necesito

Esta es LA sección más importante de toda la web. Aquí el usuario arma su Top 10 de los mejores futbolistas de la historia. Funciona como un **Tier List interactivo**.

## Cómo funciona

La pantalla se divide en DOS zonas:

### ZONA IZQUIERDA (o arriba en móvil): "Tu Top 10"
Son **10 casillas vacías numeradas del #1 al #10** donde el usuario coloca a sus elegidos.

- **Casilla #1 — "TU GOAT"**: Es más grande que las demás. Tiene un marco especial dorado, quizás una corona o un efecto de brillo. Cuando el usuario pone un jugador aquí, debe sentirse ÉPICO.
- **Casillas #2 a #10**: Más pequeñas, en fila vertical. Cada una muestra el número de posición y los puntos que vale:
  - #1 = 25 puntos
  - #2 = 18 puntos
  - #3 = 15 puntos
  - #4 = 12 puntos
  - #5 = 10 puntos
  - #6 = 8 puntos
  - #7 = 6 puntos
  - #8 = 4 puntos
  - #9 = 2 puntos
  - #10 = 1 punto

- Las casillas vacías se ven como espacios con borde punteado y texto "Arrastra un jugador aquí"
- Cuando un jugador está colocado, la casilla muestra: foto del jugador, nombre, país (banderita), y los puntos que vale en esa posición
- El usuario puede **arrastrar para reordenar** sus jugadores entre las 10 casillas
- Cada casilla tiene un botón pequeño (X) para quitar al jugador y devolverlo al pool

### ZONA DERECHA (o abajo en móvil): "Pool de Leyendas"
Aquí están los **50 jugadores disponibles** para elegir.

Usa los datos del archivo `data/players-top50.json`.

Cada jugador se muestra como una **tarjeta pequeña/compacta** tipo cromo de fútbol:
- Foto placeholder (cuadrado con las iniciales del jugador)
- Nombre
- Bandera del país
- Categoría (con un puntito de color según la categoría)
- Botón o acción para agregarlo al Top 10 (clic o drag & drop)

**Filtros** en la parte superior del pool:
- "Todos" (default)
- "Ganadores Oficiales" (dorado)
- "Polémica Histórica" (rojo — los que fueron excluidos)
- "Leyendas" (gris)
- "Siglo XXI" (azul)

**Buscador**: Un campo de búsqueda rápida para filtrar por nombre

**Botón especial SIEMPRE VISIBLE** abajo del pool:
"➕ ¿Tu ídolo no está aquí? Agrega un jugador comodín"
- Al hacer clic, abre un modal/drawer donde el usuario escribe el nombre del jugador que quiere agregar
- Solo se permite UN comodín por votación
- El comodín se agrega al Top 10 como cualquier otro jugador

## Interactividad
- **Drag & drop** es el método principal para mover jugadores del pool al Top 10
- También debe funcionar con **clic** (para móvil): al tocar una tarjeta del pool, se agrega a la primera casilla vacía del Top 10
- Animaciones fluidas al mover, agregar y quitar jugadores
- Cuando el Top 10 está completo (10 jugadores seleccionados), aparece un **botón grande dorado** en la parte inferior: "CONFIRMAR MI VOTO — $1 USD"

## Estilo visual
- Las tarjetas de los jugadores deben verse como cromos coleccionables o cartas de videojuego de fútbol
- El puesto #1 debe sentirse ESPECIAL — más grande, más brillante, con efectos
- Usa la paleta oscura/dorada
- Que sea DIVERTIDO de usar, como armar un equipo en un videojuego

## Libertad creativa
Tienes total libertad en cómo se ven las tarjetas, las animaciones, y los efectos visuales. Lo importante es que sea INTUITIVO (que cualquier persona entienda cómo funciona sin instrucciones) y DIVERTIDO (que dé gusto arrastrar y acomodar jugadores).

