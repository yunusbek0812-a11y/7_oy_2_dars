import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/user.role";
import { RolesGuard } from "src/common/guards/roles.guard";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Interval server error" })
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: CreateArticleDto })
  @HttpCode(201)
  @Post("create_article")
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @ApiOkResponse({ type: [CreateArticleDto] })
  @HttpCode(200)
  @Get("get_all_articles")
  findAll() {
    return this.articlesService.findAll();
  }

  @ApiNotFoundResponse({ description: "Article not found" })
  @HttpCode(200)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.articlesService.findOne(+id);
  }

  @ApiNotFoundResponse({ description: "Article not found" })
  @ApiOkResponse({description:"Updated article"})
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiNotFoundResponse({ description: "Article not found" })
  @ApiOkResponse({description:"Delete article"})
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(200)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.articlesService.remove(+id);
  }
}
