# Series Tracker

Tracker personal de series, inspirado en TV Time: busca series reales (TMDB), marca episodios vistos, revisa el calendario de próximos estrenos, descubre tendencias y consulta tus estadísticas. Se sincroniza automáticamente en la nube (Supabase) para que puedas usarlo desde cualquier dispositivo con la misma cuenta.

## Publicar en GitHub Pages

1. Sube **todos estos archivos manteniendo la carpeta**: `index.html`, `manifest.json`, `sw.js`, `tmdb-logo.svg`, y la carpeta `icons/` completa (con `icon-192.png` e `icon-512.png` adentro) a la raíz de tu repositorio.
2. En el repo: **Settings → Pages → Source → Deploy from a branch**, elige la rama `main` y la carpeta `/root`.
3. GitHub te da una URL tipo `https://tu-usuario.github.io/tu-repo/`. Ábrela.

## Instalarla como app (PWA)

Una vez publicada en GitHub Pages (tiene que ser https, no funciona abriendo el archivo local):
- **Android/Chrome**: abre la URL, toca el menú (⋮) → "Instalar app" o "Agregar a pantalla de inicio".
- **iPhone/Safari**: abre la URL, toca el botón de compartir → "Agregar a pantalla de inicio".
- Una vez instalada, abre en pantalla completa, sin barra del navegador, con su propio ícono.

## Cómo funciona el acceso

La app **siempre pide iniciar sesión** — no hay modo "solo este dispositivo". Todo lo que ves (series, progreso, episodios marcados) vive en tu cuenta de Supabase y se sincroniza solo entre todos los dispositivos donde inicies sesión con el mismo correo y contraseña. No hay ambigüedad sobre dónde está la información: siempre está en la nube.

La API key de TMDB (para buscar series) ya viene incluida en el código — nadie tiene que configurarla a mano.

## Si quieres tu propia base de datos (en vez de usar la ya configurada)

1. Crea una cuenta gratis en [supabase.com](https://supabase.com) y un proyecto nuevo.
2. En **Project Settings → API**, copia la **Project URL** y la **anon public key**.
3. En el **SQL Editor** del proyecto, pega y ejecuta una vez:
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
4. En **Authentication → Sign In / Providers → Email**, activa el proveedor y desactiva "Confirm email" (para no depender de correos de verificación en un uso personal). Si vas a compartir el link con más personas, considera desactivar también "Allow new users to sign up" después de crear las cuentas que necesites.
5. En el código (`index.html`), reemplaza `BUILTIN_SUPA_URL` y `BUILTIN_SUPA_ANON` por tus propios valores.

## Respaldo de tus datos

Desde el perfil (ícono de usuario, arriba a la derecha) puedes descargar una copia de todas tus series en JSON o CSV en cualquier momento. Es tu respaldo personal, independiente de la nube.

## Créditos y atribución de TMDB

Este proyecto usa la API de [TMDB](https://www.themoviedb.org/) para buscar series, traer posters, episodios y datos de disponibilidad de streaming (estos últimos cortesía de JustWatch). Por los términos de uso de TMDB, la app necesita mostrar su logo oficial y el aviso *"This product uses the TMDB API but is not endorsed or certified by TMDB."* — ambos ya están incluidos en la sección "Créditos" del perfil.

**Paso pendiente de tu lado:** todavía falta el archivo del logo real. Descárgalo así:
1. Ve a [themoviedb.org/about/logos-attribution](https://www.themoviedb.org/about/logos-attribution).
2. Elige cualquiera de los logos SVG aprobados (por ejemplo "Primary Full").
3. Guárdalo en la raíz de tu repositorio con el nombre exacto `tmdb-logo.svg`.

Sin ese archivo, la app sigue funcionando normal — solo no se ve el logo en la sección de créditos (el texto de atribución sí aparece siempre).
