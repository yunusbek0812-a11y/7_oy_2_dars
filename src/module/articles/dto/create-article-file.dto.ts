import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty({default:"JavaScript"})
  @IsString()
  back!: string;
}
