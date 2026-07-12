# Mi bitácora de series

Tracker personal de series, inspirado en TV Time: buscá series reales (TMDB), marcá episodios vistos, mirá el calendario de próximos estrenos, descubrí tendencias y revisá tus estadísticas. Todo corre en el navegador, sin backend — los datos y tu API key quedan guardados solo en tu dispositivo (`localStorage`).

## Publicar en GitHub Pages

1. Subí `index.html` a la raíz de tu repositorio (podés dejar este `README.md` al lado, no molesta).
2. En el repo: **Settings → Pages → Source → Deploy from a branch**, elegí la rama `main` y la carpeta `/root`.
3. GitHub te da una URL tipo `https://tu-usuario.github.io/tu-repo/`. Abrila.

## Configurar la API key de TMDB

1. Andá a [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api), creá una cuenta gratis y pedí una **API Key (v3 auth)** — es un texto corto, no el "Read Access Token" largo tipo `eyJ...`.
2. En la app, tocá el botón ⚙ (arriba a la derecha) y pegá la key. Se guarda solo en tu navegador, nunca se sube a ningún lado.

## Importante sobre los datos

- Todo se guarda en `localStorage` de tu navegador. Si limpiás los datos del sitio o cambiás de navegador/dispositivo, no se sincroniza solo — es un solo lugar de guardado, no en la nube.
- Si querés respaldar tu bitácora, podés exportar `localStorage` desde las herramientas de desarrollador del navegador (Application → Local Storage) y guardarlo aparte.

## Roadmap / pendiente

- Importar historial exportado desde TV Time (falta ver el formato del archivo para armar el parser).
