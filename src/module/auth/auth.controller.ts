import { Controller, Post, Body, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  CreateAuthDto,
  CreateLoginDto,
  VerifyDto,
} from "./dto/create-auth.dto";
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiInternalServerErrorResponse({ description: "Interval server error" })
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiUnauthorizedResponse({ description: "User already exists" })
  @ApiOkResponse({ description: "Registered" })
  @ApiOperation({description: "Ro'yxatdan o'tish uchun"})
  @HttpCode(201)
  @Post("register")
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Invalid password" })
  @ApiOkResponse({ description: "Please check your email " })
  @HttpCode(200)
  @Post("login")
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "Code not found" })
  @ApiUnauthorizedResponse({ description: "Otp expired" })
  @ApiUnauthorizedResponse({ description: "Wrong otp" })
  @HttpCode(200)
  @Post("verify")
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.Verify(verifyDto);
  }
}
