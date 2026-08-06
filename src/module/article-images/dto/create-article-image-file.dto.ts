import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber } from "class-validator";
import { CreateArticleImageDto } from "./create-article-image.dto";

export class CreateArticleImageFileDto extends CreateArticleImageDto {
  @IsArray()
  @ApiProperty({
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
  })
  images: any[];
}
