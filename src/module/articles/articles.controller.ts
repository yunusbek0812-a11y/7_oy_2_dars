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
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
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
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CreateArticlFileeDto } from "./dto/create-article-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import * as path from 'path'
import { QueryDto } from "./dto/query.dto";

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({ description: "Interval server error" })
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN, UserRole.USER)
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOkResponse({ type: CreateArticleDto })
  @ApiConsumes("multipart/form-data")
  @ApiBody({type:CreateArticlFileeDto})
  @HttpCode(201)
 @Post()
@UseInterceptors(
  FileInterceptor('backgroundImage', {   // <-- 'file' emas, 'backgroundImage'
    storage: diskStorage({
      destination: path.join(process.cwd(), 'uploads'),
      filename: (req, file, cb) => {
        const uniqueSuffix = `${file.fieldname}-${Date.now()}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
create(
  @Body() createArticleDto: CreateArticleDto,
  @UploadedFile() file: Express.Multer.File,
  @Req() request: any
) {
  return this.articlesService.create(createArticleDto, file,request);
}

@Get("get_all_articles")
findAll(@Query() queryDto: QueryDto) {
  return this.articlesService.findAll(queryDto);
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
