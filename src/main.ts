import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { exceptionFactory } from './core/exceptions/utils';
export let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ credentials: true, origin: true });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}

bootstrap();
