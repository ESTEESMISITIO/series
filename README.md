# Mi bitácora de series

Tracker personal de series, inspirado en TV Time: buscá series reales (TMDB), marcá episodios vistos, mirá el calendario de próximos estrenos, descubrí tendencias y revisá tus estadísticas. Todo corre en el navegador, sin backend — los datos y tu API key quedan guardados solo en tu dispositivo (`localStorage`).

## Publicar en GitHub Pages

1. Subí **todos estos archivos manteniendo la carpeta**: `index.html`, `manifest.json`, `sw.js`, y la carpeta `icons/` completa (con `icon-192.png` e `icon-512.png` adentro) a la raíz de tu repositorio.
2. En el repo: **Settings → Pages → Source → Deploy from a branch**, elegí la rama `main` y la carpeta `/root`.
3. GitHub te da una URL tipo `https://tu-usuario.github.io/tu-repo/`. Abrila.

## Instalarla como app (PWA)

Una vez publicada en GitHub Pages (tiene que ser https, no funciona abriendo el archivo local):
- **Android/Chrome**: abrí la URL, tocá el menú (⋮) → "Instalar app" o "Agregar a pantalla de inicio".
- **iPhone/Safari**: abrí la URL, tocá el botón de compartir → "Agregar a pantalla de inicio".
- Una vez instalada abre en pantalla completa, sin barra del navegador, con su propio ícono. La lista de tus series queda disponible sin conexión; buscar, el calendario y "Descubrir" necesitan internet porque consultan a TMDB.

## Configurar la API key de TMDB

1. Andá a [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api), creá una cuenta gratis y pedí una **API Key (v3 auth)** — es un texto corto, no el "Read Access Token" largo tipo `eyJ...`.
2. En la app, tocá el botón ⚙ (arriba a la derecha) y pegá la key. Se guarda solo en tu navegador, nunca se sube a ningún lado.

## Sincronizar entre dispositivos (Supabase)

Por defecto los datos viven solo en el navegador donde los cargaste. Para tenerlos en todos tus dispositivos:

1. Creá una cuenta gratis en [supabase.com](https://supabase.com) y un proyecto nuevo.
2. En **Project Settings → API**, copiá la **Project URL** y la **anon public key**.
3. En el **SQL Editor** del proyecto, pegá y ejecutá una vez:
   ```sql
   create table public.bitacora (
     user_id uuid references auth.users on delete cascade primary key,
     data jsonb not null default '{}'::jsonb,
     updated_at timestamptz not null default now()
   );
   alter table public.bitacora enable row level security;
   create policy "select own" on public.bitacora for select using (auth.uid() = user_id);
   create policy "insert own" on public.bitacora for insert with check (auth.uid() = user_id);
   create policy "update own" on public.bitacora for update using (auth.uid() = user_id);
   ```
4. En **Authentication → Providers → Email**, desactivá "Confirm email" (para no depender de correos de verificación en un uso personal).
5. En la app, tocá el botón ☁ (al lado del ⚙), pegá la Project URL y la anon key, y guardá.
6. Creá una cuenta (email + contraseña) desde ahí. Repetí el paso 5-6 en cada dispositivo usando **el mismo email y contraseña** — la app va a subir y bajar tus series automáticamente cada vez que marqués algo.
7. Si en algún momento la app encuentra datos distintos en la nube y en el dispositivo, te va a preguntar cuál de los dos usar antes de sobrescribir nada.

## Importante sobre los datos

- Sin configurar Supabase, todo se guarda solo en `localStorage` de ese navegador — no se sincroniza solo entre dispositivos.
- Con Supabase configurado y con la misma cuenta iniciada en todos lados, sí se sincroniza automáticamente.

## Roadmap / pendiente

- Importar historial exportado desde TV Time (falta ver el formato del archivo para armar el parser).
