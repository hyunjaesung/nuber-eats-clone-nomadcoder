import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 모든게 App module 로 합쳐진다
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(JwtMiddleware);
  // 함수 미들웨어만 등록가능
  await app.listen(4000);
}
bootstrap();
