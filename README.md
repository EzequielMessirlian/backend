# Backend (arreglado)

## Cómo correr
```bash
git clone https://github.com/EzequielMessirlian/backend.git
cd backend
npm install
cp .env.example .env  # si aplica
npm start
```

- Entry point: `server.js`
- App principal: `src/app.js` (exporta `app`, no abre el puerto)
- Rutas centralizadas: `src/routes/index.js` montadas en `/api`
- Healthcheck: `GET /health`

## Estructura
```
src/
  config/
  controllers/
  data/
  dtos/
  middlewares/
  models/
  repositories/
  routes/
    index.js
    carts.js
    products.js
    user.router.js
  services/
  utils/
server.js
package.json
```


---

## Nota al revisor

Hola, gracias por la devolución. Implementé los cambios que mencionaste:

- Unifiqué toda la estructura del proyecto dentro de `src/` (no quedan carpetas duplicadas fuera de `src`).
- Definí `server.js` como entry point y ajusté `npm start` para que lo utilice (la app principal quedó en `src/app.js`).
- Agregué un healthcheck `GET /health` para validar el arranque post-clone.
- Probé con un clon limpio: `npm install` → `npm start` y funciona correctamente.

Si ves algo más para mejorar, quedo a disposición. ¡Gracias!

---

## Descripción PR sugerida

**Título:** fix: estructura unificada en `src` y entrypoint `server.js` para `npm start`

**Descripción:**
- Muevo controllers/models/routes/etc. a `src/` para eliminar duplicados en raíz.  
- `server.js` como entry point; `src/app.js` exporta `app` (sin `listen`).  
- `package.json`: `"start": "node server.js"` y `"dev": "nodemon server.js"`.  
- Healthcheck `GET /health`.  
- README con pasos reales (clone → install → start).

**Cómo probar:**
1) `git clone … && cd …`  
2) `npm install`  
3) `npm start`  
4) `GET http://localhost:8080/health` ⇒ `{ ok: true }`


---

## Cobertura de la Consigna (Entrega Final)

- **Patrón Repository + DAO**: `src/dao/user.dao.js` (persistencia en JSON) + `src/repositories/*.js` y `src/services/*.js` para lógica de negocio.
- **DTO y `/current`**: `src/dtos/user.dto.js` + `GET /api/users/current` (protegida) que devuelve DTO sin datos sensibles.
- **Recuperación de contraseña**:
  - `POST /api/auth/forgot-password` → envía email con link (expira en 1h) usando `src/services/passwordReset.service.js`.
  - `POST /api/auth/reset-password` → valida token, impide reutilizar contraseña anterior.
- **Middleware de autorización por rol**:
  - `authorizeRoles('admin')` en `POST/PUT/DELETE /api/products`.
  - `authorizeRoles('user')` en `POST` de `carts` (agregar productos al carrito).
- **Arquitectura profesional**: separación por capas (`routes/`, `middlewares/`, `services/`, `repositories/`, `dao/`, `dtos/`, `config/`), variables `.env`, mailing con Nodemailer.
- **Lógica de compra + Ticket**: `src/services/purchase.service.js` + `src/models/ticket.model.js` (si se integra DB/DAO de tickets).

### Variables de entorno necesarias (`.env`)
```ini
JWT_SECRET=changeme_supersecret
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
BASE_URL=http://localhost:5173
```

### Rutas principales
- **Auth**
  - `POST /api/auth/login` → devuelve `{ token, user }` (user en DTO).
  - `POST /api/auth/forgot-password` → `{ status: 'sent' }` o `{ status: 'sent-dev', resetUrl }` en modo desarrollo.
  - `POST /api/auth/reset-password` → `{ status: 'ok' }`.
- **Usuarios**
  - `GET /api/users/current` → (token Bearer) devuelve DTO del usuario actual.
- **Productos** (`admin`)
  - `POST /api/products`, `PUT /api/products/:pid`, `DELETE /api/products/:pid` → protegidas por rol admin.
- **Carritos** (`user`)
  - `POST /api/carts/...` (agregar producto) → protegida por rol user.

### Flujo de prueba rápido
1. `cp .env.example .env` y completar `JWT_SECRET`, y (opcional) SMTP.  
2. `npm install` → `npm start`  
3. `POST /api/auth/login` con demo:  
   - admin: `admin@example.com` / `admin123`  
   - user: `user@example.com` / `user123`  
4. Usar el `token` como **Bearer** para:  
   - `GET /api/users/current`  
   - crear/editar/borrar productos (admin)  
   - agregar productos al carrito (user)  

> **Nota**: La persistencia de usuarios es en `src/data/users.json` para facilitar la corrección sin DB. Si querés MongoDB, basta con implementar `UserDAO` para Mongo y mantener el Repository.
