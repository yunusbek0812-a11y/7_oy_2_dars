import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { MulterError } from "multer";

interface ErrorEnvelope {
  success: false;
  error: {
    statusCode: number;
    message: string | string[];
    error: string;
    path: string;
    timestamp: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let error = "Internal Server Error";

    /**
     * HttpException
     */
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else {
        const body = exceptionResponse as Record<string, any>;

        message = body.message ?? exception.message;

        // Faqat "Too many files" xatosini o'zgartirish
        if (
          message === "Too many files" ||
          (Array.isArray(message) && message.includes("Too many files"))
        ) {
          message =
            "Image upload limit has been exceeded. Maximum 10 images are allowed.";
        }

        error =
          body.error ??
          HttpStatus[statusCode]
            .replace(/([A-Z])/g, " $1")
            .trim();
      }
    }

    /**
     * Multer Errors
     */
    else if (exception instanceof MulterError) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = "Bad Request";

      switch (exception.code) {
        case "LIMIT_FILE_COUNT":
          message =
            "Image upload limit has been exceeded. Maximum 10 images are allowed.";
          break;

        case "LIMIT_FILE_SIZE":
          message = "Each image size must not exceed 5 MB.";
          break;

        case "LIMIT_UNEXPECTED_FILE":
          message = "Unexpected file field.";
          break;

        default:
          message = exception.message;
      }
    }

    /**
     * PostgreSQL Errors
     */
    else if (exception instanceof QueryFailedError) {
      const driverError = exception as QueryFailedError & { code?: string };

      switch (driverError.code) {
        case "23505":
          statusCode = HttpStatus.CONFLICT;
          error = "Conflict";
          message = "A record with the same unique value already exists.";
          break;

        case "23503":
          statusCode = HttpStatus.BAD_REQUEST;
          error = "Bad Request";
          message = "Referenced record does not exist.";
          break;

        default:
          this.logger.error(exception.message, exception.stack);
      }
    }

    /**
     * Unknown Error
     */
    else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = exception.message;
    } else {
      this.logger.error(String(exception));
    }

    const result: ErrorEnvelope = {
      success: false,
      error: {
        statusCode,
        message,
        error,
        path: request.originalUrl || request.url,
        timestamp: new Date().toISOString(),
      },
    };

    response.status(statusCode).json(result);
  }
}