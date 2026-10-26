# Prompt 7 para Kombai — Ranking en Vivo + Barras Animadas

## Qué necesito

Una sección que muestre el **ranking global en tiempo real** de cómo van las votaciones. Esta sección es clave para generar el sentido de urgencia y que la gente vuelva a la web.

## Qué debe mostrar

### 1. Top 10 Global (Barras de Progreso Animadas)
- Los 10 jugadores con más puntos globales, ordenados de mayor a menor
- Cada jugador se muestra como una **barra horizontal** que muestra:
  - Posición (#1, #2, etc.)
  - Foto/avatar del jugador
  - Nombre y bandera del país
  - Barra de progreso llena proporcionalmente a sus puntos
  - Número de puntos totales
  - Porcentaje del total de votos
- Las barras deben tener **animación**: cuando la página carga, las barras crecen desde 0 hasta su valor actual
- La barra del #1 debe ser dorada brillante. Las demás en tonos plateados/grises degradados.
- Efecto visual: las barras se actualizan suavemente (como si los votos llegaran en vivo)

### 2. Duelos Destacados
- Una mini sección que muestre los duelos más calientes:
  - **Messi vs Cristiano Ronaldo** — con fotos enfrentadas y una barra dividida al 50% mostrando quién va ganando
  - **Pelé vs Maradona** — mismo formato
  - **Di Stéfano vs Cruyff** — mismo formato
- Cada duelo con un título tipo: "El Clásico Eterno" / "La Batalla Sudamericana" / "Los Reyes de Europa"

### 3. Estadísticas Rápidas
- **Total de votos**: número grande con animación de contador
- **Países participantes**: número con ícono de globo
- **Último voto**: "Hace 3 segundos desde 🇲🇽 México"
- **Jugador más votado como GOAT (#1)**: foto y nombre del líder

## Datos (por ahora simulados)
Los datos son placeholder/simulados. Usa estos como ejemplo:
1. Messi — 45,230 pts (22.1%)
2. Cristiano Ronaldo — 38,150 pts (18.6%)
3. Pelé — 28,900 pts (14.1%)
4. Maradona — 22,400 pts (10.9%)
5. Zidane — 12,800 pts (6.2%)
6. Ronaldo Nazário — 11,200 pts (5.5%)
7. Cruyff — 9,800 pts (4.8%)
8. Ronaldinho — 8,500 pts (4.1%)
9. Beckenbauer — 6,200 pts (3.0%)
10. Di Stéfano — 5,100 pts (2.5%)

## Estilo visual
- Fondo oscuro consistente con el resto de la web
- Las barras con gradiente dorado para el #1, plateado para #2-3, y tonos más sutiles para el resto
- Que se sienta como un tablero de resultados de elecciones en vivo (esa emoción de ver los números moverse)
- Animaciones fluidas, no bruscas

## Libertad creativa
Puedes agregar cualquier elemento visual que haga que esta sección se sienta VIVA y en movimiento. Puede ser un efecto de pulso, partículas, números que parpadean al "actualizarse", etc.

