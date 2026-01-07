import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Importar
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // <-- Adicione esta linha
  
  // Enable CORS with specific configuration
  app.enableCors({
    origin: true, // Allow all origins in development/testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Gestão do Bem API')
    .setDescription('Documentação da API para o sistema de gestão de ONGs')
    .setVersion('1.0')
    .addTag('Organizations', 'Operações relacionadas a organizações') 
    .addTag('Users', 'Operações relacionadas a usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  await app.listen(3000);
}
bootstrap();
