import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 모든게 App module 로 합쳐진다
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
