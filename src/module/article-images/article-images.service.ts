import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';

import { ArticleImage } from './entities/article-image.entity';
import { Article } from '../articles/entities/article.entity';

@Injectable()
export class ArticleImagesService {
  constructor(
    @InjectRepository(ArticleImage)
    private readonly articleImageRepo: Repository<ArticleImage>,

    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async create(
    createArticleImageDto: CreateArticleImageDto,
    files: Express.Multer.File[],
  ) {
    // 1. Article mavjudligini tekshirish
    const article = await this.articleRepo.findOne({
      where: {
        id: createArticleImageDto.articleId,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // 2. Rasm yuklanganligini tekshirish
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload at least one image.');
    }

    // 3. Maksimum 10 ta rasm
    if (files.length > 10) {
      throw new BadRequestException(
        'Image upload limit has been exceeded. Maximum 10 images are allowed.',
      );
    }

    // 4. Entity yaratish
    const articleImages = files.map((file, index) =>
      this.articleImageRepo.create({
        article,
        url: file.filename,
        sortOrder: index + 1,
      }),
    );

    // 5. Bazaga saqlash
    const savedImages = await this.articleImageRepo.save(articleImages);

    // 6. Natija qaytarish
    return {
      success: true,
      message: 'Images uploaded successfully.',
      data: savedImages,
    };
  }

  async findAll() {
    return this.articleImageRepo.find({
      relations: {
        article: true,
      },
    });
  }

  async findOne(id: number) {
    const image = await this.articleImageRepo.findOne({
      where: { id },
      relations: {
        article: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async update(
    id: number,
    updateArticleImageDto: UpdateArticleImageDto,
  ) {
    const image = await this.findOne(id);

    Object.assign(image, updateArticleImageDto);

    return this.articleImageRepo.save(image);
  }

  async remove(id: number) {
    const image = await this.findOne(id);

    await this.articleImageRepo.remove(image);

    return {
      success: true,
      message: 'Image deleted successfully.',
    };
  }
}