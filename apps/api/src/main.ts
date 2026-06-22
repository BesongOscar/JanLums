import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3025',
      'http://localhost:3035',
      'http://localhost:3085',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  /* ── Swagger ─────────────────────────────────────────────────────────── */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('JanLunMS API')
    .setDescription(
      'Laundry Management System - REST API.\n\n' +
      '**Authentication:** Send `Authorization: Bearer <token>` on protected routes.\n' +
      'Obtain a token via `POST /api/v1/auth/login`.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('health', 'Service health check')
    .addTag('auth', 'Authentication')
    .addTag('users', 'User management')
    .addTag('tenants', 'Tenant management')
    .addTag('branches', 'Branch management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3015;
  await app.listen(port);

  console.log(`🚀 JanLunMS API running on:  http://localhost:${port}/api/v1`);
  console.log(`📖 Swagger docs available:  http://localhost:${port}/api/docs`);
}
bootstrap();
