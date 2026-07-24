import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { Auth } from './module/auth/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { Article } from './module/articles/entities/article.entity';
import { ArticlesModule } from './module/articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env",isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      username:"postgres",
      database: process.env.DB_NAME,
      password:process.env.DB_PASSWORD,
      entities: [Auth,Article],
      synchronize: true
    }),
    AuthModule,
    ArticlesModule
  ],
  controllers: [],
  providers: [],

  
})
export class AppModule {}
