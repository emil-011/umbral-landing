# Sifos — landing

Landing pública de **Sifos**, la nueva identidad de tritrain: entrenamiento de resistencia para
clubes, entrenadores y atletas, con el motor ECO, zonas, calendario y estadísticas.

Esta fase es solo UI. No hay backend, formularios conectados ni JavaScript de aplicación: la
página es estática y los CTA apuntan a anclas de la propia landing.

## Desarrollo

```sh
bun install
bun run dev
```

El servidor de desarrollo arranca en `http://localhost:4321`.

## Build

```sh
bun run build
bun run preview
```

## Estructura

```text
public/fonts/        Chillax, Quicksand y JetBrains Mono autoalojadas
src/components/      secciones y mockups de producto
src/layouts/         shell HTML y metadatos
src/pages/           la landing
src/styles/          tokens, cristal, tipografía y primitivas
```

Las fuentes de Chillax se distribuyen con su licencia en `public/fonts/Chillax-FFL.txt`.
