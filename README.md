# FORTENOW · Web

Web de inscripciones a **FORTENOW**, un clasificatorio de CrossFit (ficticio). Los atletas
solicitan plaza en un turno y el organizador acepta o rechaza cada solicitud desde un panel.

- **Backend:** [fortenow-api](https://github.com/MarioRivVal/fortenow-api)
- **Web desplegada:** _pendiente_

## Para quién es

| Usuario | Qué necesita | Dónde lo hace |
|---|---|---|
| **Atleta** | Ver si quedan plazas, pedir un turno y saber si le han aceptado | `/` y `/mis-solicitudes` |
| **Organizador** | Decidir quién entra en cada turno sin pasarse del aforo, y tener la lista el día del evento | `/admin` |

No hay registro de cuentas: los usuarios los crea el organizador (en esta demo, el seed de la API).

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Organizador | `organizacion@example.com` | `organiza2027` |
| Atleta | `marta.gil@example.com` | `atleta2027` |

## Arrancar en local

Hace falta **Node.js 22** y la **API arrancada** en `http://localhost:3200` (ver su README).

```bash
npm install
cp .env.example .env.local
npm run dev               # http://localhost:3201
```

## Tecnologías

**Next.js 16** (App Router) con **React 19** y TypeScript. **CSS propio**, sin librerías de
estilos: variables en `style.css` y un CSS Module por componente. Fuentes locales (Archivo Black e
Inter) con `next/font`.

## Flujo

**Atleta**
1. En la portada ve la edición actual y los turnos con sus plazas libres.
2. Pulsa "Solicitar" en un turno (sin sesión, le lleva a entrar y luego vuelve).
3. En "Mis solicitudes" ve el estado: pendiente, aceptada, rechazada (con el motivo) o retirada.
   Puede retirar una pendiente. Solo puede tener una solicitud activa por edición.

**Organizador**
1. Al entrar va al panel `/admin`, con la edición actual seleccionada.
2. Pestañas **Pendientes / Aceptadas / Rechazadas y retiradas**, buscador por nombre y, en cada
   turno, la ocupación ("4 / 6 plazas") y el recuento por sexo.
3. Abre la ficha de un atleta y lo **acepta** o lo **rechaza** con un motivo opcional. Si el turno
   está lleno no puede aceptar.
4. Puede **imprimir** la lista de aceptados para pasar lista y **descargar un CSV**.
5. Las ediciones anteriores se consultan, pero no se modifican.

## Estructura

```
app/                         páginas (una carpeta por ruta)
├── page.tsx                 portada: evento, cómo funciona y turnos
├── login/                   entrar
├── mis-solicitudes/         solicitudes del atleta
├── admin/                   panel del organizador
│   ├── imprimir/            lista para el papel
│   └── export/route.ts      descarga del CSV
├── layout.tsx               cabecera común
└── style.css                variables y clases compartidas
components/                  un componente por carpeta: Nombre.tsx + Nombre.module.css
├── Header/                  cabecera según la sesión
├── EventHero/               banner del evento
├── SlotList/                turnos con plazas y botón "Solicitar"
├── RegistrationList/        solicitudes del atleta
├── AdminBoard/              pestañas, buscador y turnos del panel
├── ConfirmDialog/           ventana de confirmación (solicitar, retirar, aceptar, rechazar)
├── StatusBadge/             etiqueta de estado
├── LoginForm/
└── PrintButton/
hooks/                       hooks propios
lib/                         llamadas a la API, tipos y formato de fechas
proxy.ts                     sin sesión, /admin y /mis-solicitudes llevan a /login
```

**Server y Client Components.** Las páginas son Server Components: piden los datos a la API en el
servidor, reenviando la cookie de sesión ([`lib/api-server.ts`](lib/api-server.ts)). Solo es
Client Component lo que tiene interacción (formularios y botones), y escribe en la API con
[`lib/api.ts`](lib/api.ts).

**Roles.** Cada página comprueba el usuario en el servidor: un atleta que abre `/admin` vuelve a la
portada. La API, además, protege cada ruta por su cuenta.

## Hooks

| Hook | Para qué | Dónde se usa |
|---|---|---|
| [`useApiAction`](hooks/useApiAction.ts) | Envía una acción a la API con `useTransition` (estado "enviando"), traduce el código de error a un mensaje en español y, al terminar, `router.refresh()` vuelve a pedir los datos al servidor | Login, Solicitar, Retirar, Aceptar, Rechazar |
| [`useRegistrationFilters`](hooks/useRegistrationFilters.ts) | Pestaña y buscador del panel. `useMemo` filtra solo cuando cambian los datos, la pestaña o el texto; `useDeferredValue` mantiene el input fluido mientras se filtra | `AdminBoard` |

## CSS

- **[`app/style.css`](app/style.css)**: variables en `:root` (colores, espaciados, tipografías,
  tamaños, radio, sombra), estilos base y las clases que usan varios componentes: `.container`,
  `.button`, `.button-secondary`, `.card`, `.field`, `.message-error`, `.message-success`, y los
  estilos de impresión.
- **Un CSS Module por componente** con solo lo suyo, siempre con las variables (ningún color ni
  espaciado escrito a mano).
- Primero el móvil, con una `@media` para pantallas grandes.
- HTML semántico: `header`, `nav`, `main`, `section`, `form`, `table`, `dialog`, `details`.

## Despliegue

`next build` y `next start -p 3201`. La única variable es `API_INTERNAL_URL`, la dirección de la
API desde el servidor de Next (ver [`.env.example`](.env.example)). En producción web y API
comparten dominio: el navegador llama a `/api/v1/...` y el proxy lo envía a la API.
