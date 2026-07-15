# 🌸 UKIYO Restaurant Backend - API REST

¡Bienvenido al repositorio del backend de **UKIYO**, un sistema integral de gestión para un restaurante de alta cocina fusión japonesa! Este proyecto constituye el backend del proyecto final para el Ciclo Formativo de Grado Superior en **Desarrollo de Aplicaciones Web (2DAW)**.

El sistema está diseñado bajo una arquitectura modular robusta que separa por completo las operaciones del día a día (reparto/delivery) de los servicios de eventos especiales (catering), garantizando la integridad de los datos y la escalabilidad del negocio.

---

## 🛠️ Stack Tecnológico

*   **Framework Principal:** [NestJS](https://nestjs.com/) (Node.js) con TypeScript, garantizando una arquitectura orientada a objetos estructurada, mantenible y escalable.
*   **ORM:** [Prisma](https://www.prisma.io/) para el modelado de datos y consultas tipadas de extremo a extremo.
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) alojado en la nube con [Supabase](https://supabase.com/), implementando un pooler de conexiones híbrido (Transaction/Session) para optimizar el rendimiento.
*   **Seguridad:** Autenticación por Tokens [JWT (JSON Web Tokens)](https://jwt.io/), control de accesos basado en roles (RBAC) y cifrado de contraseñas.

---

## 📐 Arquitectura de la Base de Datos & Negocio

El motor de la base de datos está estructurado en 6 bloques lógicos que cubren la totalidad de los flujos de un restaurante real:

1.  **Configuración del Sistema y Pasarela:** Almacenamiento seguro y cifrado de las credenciales de pasarela Redsys.
2.  **Usuarios y Control de Accesos:** Gestión de clientes, empleados y auditoría interna de accesos con registro de IPs para mitigar ataques de fuerza bruta.
3.  **Carta del Restaurante:** Categorías, alérgenos y platos de la carta altamente dinámicos.
4.  **Módulo de Ofertas:** Sistema de promociones temporales asociadas a platos con cálculo dinámico de precio rebajado.
5.  **Pedidos Estándar (Delivery / Take Away):** Recepción y procesamiento de comandas diarias.
6.  **Servicios de Catering (Eventos):** Solicitudes, presupuestos y coordinación de eventos independientes del flujo de reparto estándar.
7.  **Gestión de Inventario y Recetas:** Control de materias primas en almacén con **descuento automatizado de stock** por cada plato vendido.

---

## 🚀 Instalación y Configuración en Local

Sigue estos pasos para levantar el entorno de desarrollo en tu ordenador:

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone [https://github.com/bmleon/Proyecto_Ukiyo-Backend.git](https://github.com/bmleon/Proyecto_Ukiyo-Backend.git)
cd Proyecto_Ukiyo-Backend
npm install