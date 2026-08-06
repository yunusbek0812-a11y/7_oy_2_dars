import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";

import { ArticleImagesService } from "./article-images.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/user.role";
import { CreateArticleImageDto } from "./dto/create-article-image.dto";

@ApiBearerAuth("JWT-auth")
@ApiTags("article_images")
@ApiInternalServerErrorResponse({
  description: "Internal server error",
})
@UseGuards(AuthGuard)
@Controller("article-images")
export class ArticleImagesController {
  constructor(private readonly articleImagesService: ArticleImagesService) {}

  @Post("create_article")
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ description: "Images uploaded successfully" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["articleId", "images"],
      properties: {
        articleId: {
          type: "number",
          example: 1,
        },
        images: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage: diskStorage({
        destination: path.join(process.cwd(), "uploads"),
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
      limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  create(
    @Body() dto: CreateArticleImageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.articleImagesService.create(dto, files);
  }

  // @Get()
  // findAll() {
  //   return this.articleImagesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.articleImagesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleImageDto: UpdateArticleImageDto) {
  //   return this.articleImagesService.update(+id, updateArticleImageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.articleImagesService.remove(+id);
  // }
}
