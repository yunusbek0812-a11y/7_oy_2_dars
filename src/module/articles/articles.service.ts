import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';



@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
    request: any,
  ): Promise<Article> {
    const article = this.articleRepo.create({
      title: createArticleDto.title,
      text: createArticleDto.text,
    });

    const foundedTags = await this.tagRepo.findBy({
      id: In(createArticleDto.tags),
    });

    article.backgroundImage = `http://localhost:4001/uploads/${file.filename}`;
    article.author = { id: request.user.id } as any;
    article.tags = foundedTags;

    return await this.articleRepo.save(article);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleRepo.find({
      withDeleted:true,
      relations:{
        author:true,
        tags:true
      }
    });
  }

  async findOne(id: number): Promise<Article> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException('Article not found');

    return foundedArticle;
  }

async update(id: number, updateArticleDto: UpdateArticleDto): Promise<string> {
  const foundedArticle = await this.articleRepo.findOne({ where: { id } });

  if (!foundedArticle) throw new NotFoundException('Article not found');

  Object.assign(foundedArticle, updateArticleDto);

  await this.articleRepo.save(foundedArticle);

  return 'Updated article';
}


async remove(id: number): Promise<string> {
  const foundedArticle = await this.articleRepo.findOne({ where: { id } });

  if (!foundedArticle) throw new NotFoundException('Article not found');

  await this.articleRepo.softDelete(id);
  return 'Deleted article';
}
}