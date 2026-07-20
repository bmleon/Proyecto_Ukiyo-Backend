# 🌸 UKIYO Restaurant Backend - API REST

¡Bienvenido al repositorio del backend de **UKIYO**, un sistema integral de gestión para un restaurante de alta cocina fusión japonesa! Este proyecto constituye el backend del proyecto final para el Ciclo Formativo de Grado Superior en **Desarrollo de Aplicaciones Web (2DAW)**.

El sistema está diseñado bajo una arquitectura modular robusta que separa por completo las operaciones del día a día (reparto/delivery) de los servicios de eventos especiales (catering), garantizando la integridad de los datos y la escalabilidad del negocio.

---

## 🛠️ Stack Tecnológico

* **Framework Principal:** [NestJS](https://nestjs.com/) (Node.js) con TypeScript, garantizando una arquitectura orientada a objetos estructurada, mantenible y escalable.
* **ORM:** [Prisma](https://www.prisma.io/) para el modelado de datos y consultas tipadas de extremo a extremo.
* **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) alojado en la nube con [Supabase](https://supabase.com/), implementando un pooler de conexiones híbrido (Transaction/Session) para optimizar el rendimiento.
* **Seguridad:** Autenticación por Tokens [JWT (JSON Web Tokens)](https://jwt.io/), control de accesos basado en roles (RBAC) y cifrado de contraseñas.

---

## 📐 Arquitectura de la Base de Datos & Negocio

El motor de la base de datos está estructurado en 6 bloques lógicos que cubren la totalidad de los flujos de un restaurante real:

1. **Configuración del Sistema y Pasarela:** Almacenamiento seguro y cifrado de las credenciales de pasarela Redsys.
2. **Usuarios y Control de Accesos:** Gestión de clientes, empleados y auditoría interna de accesos con registro de IPs para mitigar ataques de fuerza bruta.
3. **Carta del Restaurante:** Categorías, alérgenos y platos de la carta altamente dinámicos.
4. **Módulo de Ofertas:** Sistema de promociones temporales asociadas a platos con cálculo dinámico de precio rebajado.
5. **Pedidos Estándar (Delivery / Take Away):** Recepción y procesamiento de comandas diarias.
6. **Servicios de Catering (Eventos):** Solicitudes, presupuestos y coordinación de eventos independientes del flujo de reparto estándar.
7. **Gestión de Inventario y Recetas:** Control de materias primas en almacén con **descuento automatizado de stock** por cada plato vendido.

---

## 🚀 Instalación y Configuración en Local

Sigue estos pasos para levantar el entorno de desarrollo en tu ordenador:

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/bmleon/Proyecto_Ukiyo-Backend.git
cd Proyecto_Ukiyo-Backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales (puedes tomar como referencia el pooler de tu panel de Supabase):

```env
PORT=3001
JWT_SECRET=tu_clave_secreta_super_segura

# Conexión Transaction-mode para el día a día de NestJS (Puerto 6543)
DATABASE_URL="postgresql://<usuario>:<password>@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexión Session-mode directa para migraciones y pushes de Prisma (Puerto 5432)
DIRECT_URL="postgresql://<usuario>:<password>@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"
```

### 3. Sincronizar la base de datos y generar el cliente Prisma

```bash
# Sincroniza tus tablas con Supabase
npx prisma db push

# Genera los tipos de TypeScript para el cliente
npx prisma generate
```

### 4. Arrancar el servidor de desarrollo

```bash
npm run start:dev
```

El servidor backend se levantará por defecto en `http://localhost:3001`.

---

## 🔒 Estructura y Seguridad de Rutas (Endpoints)

La API cuenta con endpoints públicos para los clientes y endpoints altamente protegidos para la administración liderada por el admin:

**Públicos (Clientes):**

* `GET /carta/platos` - Consulta de la carta gastronómica filtrada con alérgenos.
* `GET /ofertas/activas` - Consulta de promociones vigentes según fecha de servidor.
* `POST /pedidos` - Generación automática de comandas de reparto.

**Privados (Solo ADMIN):**

* `POST/PUT/DELETE /carta` - Mantenimiento de categorías y platos.
* `GET /pedidos` - Visualización del listado completo de compras.
* `GET/POST /inventario` - Monitoreo de stock de insumos y definición de recetas/composición de platos.
* `POST /ofertas` - Creación y activación de campañas promocionales.

---

## 📁 Estructura del Proyecto

El código fuente sigue las convenciones recomendadas por la arquitectura modular de NestJS:

```
src/
├── auth/           # Módulo de autenticación (Estrategia JWT, Guards y decoradores de roles)
├── usuarios/       # Entidad de clientes, administración y registro de auditoría de IPs
├── empleados/      # Gestión del personal (repartidores, cocineros, etc.)
├── carta/          # Categorías, platos e iconos de alérgenos
├── ofertas/        # Campañas promocionales asociadas a los ítems del menú
├── pedidos/        # Gestión independiente de Delivery y reservas de Catering
├── inventario/     # Gestión del almacén de insumos y recetas de platos
├── prisma/         # Instancia global del cliente de base de datos
└── app.module.ts   # Módulo raíz que unifica la aplicación
```
