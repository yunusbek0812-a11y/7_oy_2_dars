import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { In, Repository } from "typeorm";
import { Tag } from "../tag/entities/tag.entity";
import { QueryDto } from "./dto/query.dto";

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

  async findAll(queryDto: QueryDto) {
    const { page = 1, limit = 10, search } = queryDto;

    const myQuery = this.articleRepo
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.tags", "tags")
      .where("article.deletedAt is null");

    if (search) {
      myQuery.andWhere(
        "(article.title ILIKE :search or article.text ILIKE :search or tags.title ILIKE :search)",
        {
          search: `%${search}%`,
        },
      );
    }

    const result = await myQuery
      .orderBy("article.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const total = await myQuery.getCount();

    return {
      totalArticle: total,
      prev: page > 1 ? { page: page - 1, limit } : undefined,
      next:  total > page * limit ? { page: page + 1, limit } : undefined,
      result,
    };
  }

  async findOne(id: number): Promise<Article> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article not found");

    return foundedArticle;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article not found");

    Object.assign(foundedArticle, updateArticleDto);

    await this.articleRepo.save(foundedArticle);

    return "Updated article";
  }

  async remove(id: number): Promise<string> {
    const foundedArticle = await this.articleRepo.findOne({ where: { id } });

    if (!foundedArticle) throw new NotFoundException("Article not found");

    await this.articleRepo.softDelete(id);
    return "Deleted article";
  }
}

function leftJoinAndSelect(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
