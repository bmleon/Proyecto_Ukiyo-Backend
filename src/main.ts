import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitamos CORS para que tu frontend de Nuxt (puerto 3000) pueda conectarse al backend
  app.enableCors({
    origin: ['http://localhost:3000'], 
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