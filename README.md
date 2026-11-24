# Sitio web de MAMCA S.A.S.

Sitio de una sola página con la información de la empresa y su portafolio de servicios.
Se publica con GitHub Pages desde el repositorio `mamcaconsultoria/empresa`.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página principal (todos los textos y servicios) |
| `politica-de-privacidad.html` | Política de tratamiento de datos (Ley 1581 de 2012) |
| `404.html` | Página que se muestra si alguien entra a un enlace que no existe |
| `script.js` | Menú, formulario a WhatsApp, animaciones. **Arriba está la CONFIGURACIÓN** |
| `style.css` | Estilos ya compilados (no editar a mano) |
| `src/input.css` | Estilos fuente (aquí se editan los estilos propios) |
| `tailwind.config.js` | Colores de marca y fuentes |
| `assets/icons.svg` | Todos los íconos del sitio |
| `assets/portafolio-mamca.pdf` | Portafolio descargable |
| `robots.txt`, `sitemap.xml` | Para Google |

## Cambios frecuentes

**Redes sociales.** En `script.js`, dentro de `CONFIG.redes`, pegue el enlace completo
(por ejemplo `facebook: 'https://www.facebook.com/mamcasas'`). El ícono aparece solo en el pie de página.

**Agregar o cambiar un servicio.** Copie una tarjeta (`<article class="reveal card">…</article>`) en
`index.html` y cambie el texto. El botón "Cotizar" lleva dos atributos:

```html
<button type="button" class="quote-btn" data-service="Nombre del servicio" data-group="Grupo">Cotizar</button>
```

La lista del formulario se arma sola con esos botones, así que no hay que tocar el formulario.

**Íconos.** Use `<svg class="i h-6 w-6" aria-hidden="true"><use href="assets/icons.svg#nombre"></use></svg>`.
Si necesita un ícono nuevo, búsquelo en https://lucide.dev, copie su contenido y agréguelo en
`assets/icons.svg` como un `<symbol>` igual a los demás.

**Medir visitas (opcional).** Cree una propiedad de Google Analytics 4 y pegue el ID (`G-XXXXXXX`)
en `CONFIG.ga4` de `script.js`. Se medirán los clics en WhatsApp, correo, "Cotizar" y la descarga del PDF.

## Recompilar los estilos

Solo es necesario si usa en el HTML una clase de Tailwind que no estaba antes, o si edita `src/input.css`.

1. Instale Node.js (una sola vez): https://nodejs.org
2. En la carpeta del proyecto, la primera vez: `npm install`
3. Cada vez que cambie estilos: `npm run build`  (o `npm run watch` mientras trabaja)

## Publicar cambios

```bash
git add .
git commit -m "Describa el cambio"
git push
```

GitHub Pages actualiza el sitio en uno o dos minutos.

## Dominio propio (paso a paso)

1. **Compre el dominio** en un registrador (.com.co cuesta alrededor de US$15 al año en algunos).
   Verifique disponibilidad de opciones como `mamca.com.co`, `mamcaconsultoria.com.co` o `mamcasas.com.co`.
2. **En GitHub**: repositorio → *Settings* → *Pages* → *Custom domain* → escriba el dominio
   (por ejemplo `www.mamca.com.co`) → *Save*. GitHub crea un archivo `CNAME` en el repositorio.
   Se recomienda verificar el dominio antes en la configuración de Pages de la cuenta u organización.
3. **En el registrador (DNS)** cree estos registros:
   - `A` con nombre `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` con nombre `@` (opcional) → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` con nombre `www` → `mamcaconsultoria.github.io`
   - No use registros comodín (`*`).
4. Espere a que propague (minutos a 24 horas) y active **Enforce HTTPS** en *Settings → Pages*.
5. **Actualice el sitio**: reemplace `https://mamcaconsultoria.github.io/empresa/` por la nueva dirección
   (por ejemplo `https://www.mamca.com.co/`) en `index.html`, `politica-de-privacidad.html`, `robots.txt`
   y `sitemap.xml`. En `404.html` reemplace `/empresa/` por `/`. El PDF también muestra la dirección web.
6. **Google**: registre el dominio en Google Search Console, envíe `sitemap.xml` y cree el
   Perfil de Empresa en Google (Bosconia, Cesar).
7. **Correo con el dominio** (opcional): por ejemplo `contacto@mamca.com.co` con Zoho Mail o Google Workspace.

## Créditos

Íconos: Lucide (licencia ISC). Ícono de WhatsApp: Font Awesome Free (CC BY 4.0). Fuente: Inter (SIL OFL).
