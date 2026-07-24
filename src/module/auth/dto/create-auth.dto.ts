import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @ApiProperty({default:"Behruz"})
  @IsString({message:"string type bolishi kerak"})
  @Length(3,50)
  username!: string;

  @ApiProperty({default:"yunusbek0812@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @ApiProperty({default:"yunus1234567"})
  @IsString()
  @Length(8,100)
  password!: string;
}


export class CreateLoginDto {
  @ApiProperty({default:"yunusbek0812@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @ApiProperty({default:"yunus1234567"})
  @IsString()
  @Length(8,100)
  password!: string;
}

export class VerifyDto {
  @ApiProperty({default:"yunusbek0812@gmail.com"})
  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @ApiProperty({default:"823823"})
  @IsString()
  @Length(6,6)
  code!: string;
}