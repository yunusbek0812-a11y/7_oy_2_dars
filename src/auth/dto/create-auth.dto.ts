import { IsEmail, IsString, Length } from "class-validator";

export class CreateAuthDto {
  @IsString({message:"string type bolishi kerak"})
  @Length(3,50)
  username!: string;

  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @IsString()
  @Length(8,100)
  password!: string;
}


export class CreateLoginDto {
  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @IsString()
  @Length(8,100)
  password!: string;
}

export class VerifyDto {
  @IsString()
  @IsEmail()
  @Length(13,50)
  email!: string;

  @IsString()
  @Length(6,6)
  code!: string;
}