import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './module/auth/auth.module';
import { ArticlesModule } from './module/articles/articles.module';
import { TagModule } from './module/tag/tag.module';

import { Auth } from './module/auth/entities/auth.entity';
import { Article } from './module/articles/entities/article.entity';
import { Tag } from './module/tag/entities/tag.entity';
import { ArticleImagesModule } from './module/article-images/article-images.module';
import { ArticleImage } from './module/article-images/entities/article-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Auth, Article, Tag,ArticleImage],
      synchronize: true,
    }),

    AuthModule,
    ArticlesModule,
    TagModule,
    ArticleImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}