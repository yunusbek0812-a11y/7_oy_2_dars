import { Module } from '@nestjs/common';
import { ArticleImagesService } from './article-images.service';
import { ArticleImagesController } from './article-images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleImage } from './entities/article-image.entity';
import { AuthModule } from '../auth/auth.module';
import { Article } from '../articles/entities/article.entity';

@Module({
  imports:[
  TypeOrmModule.forFeature([ArticleImage,Article]),
  AuthModule
],
  controllers: [ArticleImagesController],
  providers: [ArticleImagesService],
})
export class ArticleImagesModule {}
