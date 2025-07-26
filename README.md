# Proyecto Backend Ecommerce - Coderhouse

Este repositorio contiene el backend de un sistema de ecommerce, desarrollado como entrega final del curso, con mejoras de arquitectura, seguridad y lógica de negocio.

## Características implementadas

✅ Patrón Repository y DAO para acceso a datos desacoplado  
✅ DTO en `/api/sessions/current` para evitar exponer datos sensibles  
✅ Sistema de recuperación de contraseña vía email con token de 1 hora  
✅ Middleware de autorización por roles (`admin`, `user`)  
✅ Modelo de Ticket con lógica de compra robusta  
✅ Arquitectura profesional separada en capas (`src/`)  
✅ Uso de variables de entorno (`.env.example`)  
✅ Mailing configurado con Nodemailer

## Estructura de carpetas

```
src/
├── controllers/
├── services/
├── repositories/
├── daos/
├── dtos/
├── models/
├── middlewares/
├── routes/
├── utils/
└── app.js
```

## Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/back-proyectcoder.git
cd back-proyectcoder
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con los valores correctos
```

4. Iniciar el servidor

```bash
npm start
```

## Autor

Ezequiel Messirlian  
Proyecto Final Backend - Coderhouse
