import { ApiProperty } from "@nestjs/swagger";

export class CreateArticlFileeDto {
  @ApiProperty({ default: "JavaScript" })
  title!: string;

  @ApiProperty({ default: "The best programming language in the world" })
  text!: string;

  @ApiProperty({ type: "string", format: "binary" })
  backgroundImage!: any;
}