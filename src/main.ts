import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'; // 🆕 1. Importamos Helmet para blindar cabeceras HTTP

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🆕 2. Activamos Helmet en la primera línea para interceptar y proteger todas las peticiones
  app.use(helmet());

  // 1. Habilitamos CORS para que tu frontend local y los despliegues en Vercel puedan conectarse
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://admin-ukiyo.vercel.app',
      'https://web-ukiyo.vercel.app'
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Escuchamos en el puerto configurado en tu .env o en el 3001 por defecto para no chocar con Nuxt
  const puerto = process.env.PORT ?? 3001;
  await app.listen(puerto);
  
  console.log('===========================================================');
  console.log(` 🚀 Backend de UKIYO corriendo en: http://localhost:${puerto}`);
  console.log('===========================================================');
}
bootstrap();