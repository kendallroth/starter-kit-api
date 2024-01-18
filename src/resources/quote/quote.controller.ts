import {
  Body,
  Controller,
  Delete,
  Get,
  NoSecurity,
  Patch,
  Path,
  Post,
  Queries,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";

import {
  NotFoundError,
  NotFoundErrorResponse,
  UnauthorizedError,
  UnauthorizedErrorResponse,
  ValidationError,
  ValidationErrorResponse,
} from "#common/errors";
import { PaginatedResult, PaginationQuery } from "#common/types";
import { HttpStatus } from "#common/utilities";
import { AuthenticatedRequest } from "#server/authentication";
import { QuoteEntity } from "./quote.entity";
import { QuoteService } from "./quote.service";
import { QuoteCreateBody, QuoteUpdateBody } from "./quote.types";

@Tags("Quote")
@Security("jwt")
@Route("quote")
export class QuoteController extends Controller {
  /**
   * @summary Get all visible quotes (supports sorting)
   */
  @NoSecurity()
  @Get()
  public async getQuotes(
    // Technically this endpoint may or may not be authenticated!
    @Request() request: AuthenticatedRequest,
    @Queries() query: PaginationQuery,
  ): Promise<PaginatedResult<QuoteEntity>> {
    return QuoteService.getQuotes(request.user, query);
  }

  /**
   * @summary Get the quote of the day
   */
  // NOTE: Must be registered BEFORE ":id" route!
  @NoSecurity()
  @Get("qod")
  public async getQuoteOfTheDay(): Promise<QuoteEntity> {
    return QuoteService.getQuoteOfTheDay();
  }

  /**
   * @summary Get a quote
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<NotFoundErrorResponse>(NotFoundError.status, NotFoundError.message)
  @Get("{id}")
  public async getQuote(
    @Request() request: AuthenticatedRequest,
    @Path("id") quoteId: string,
  ): Promise<QuoteEntity> {
    return QuoteService.getQuote(request.user, quoteId);
  }

  /**
   * @summary Update a quote
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<NotFoundErrorResponse>(NotFoundError.status, NotFoundError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Patch("{id}")
  public async updateQuote(
    @Request() request: AuthenticatedRequest,
    @Path("id") quoteId: string,
    @Body() body: QuoteUpdateBody,
  ): Promise<QuoteEntity> {
    return QuoteService.updateQuote(request.user, quoteId, body);
  }

  /**
   * @summary Add a quote
   */
  @SuccessResponse(HttpStatus.CREATED)
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Post()
  public async createQuote(
    @Request() request: AuthenticatedRequest,
    @Body() body: QuoteCreateBody,
  ): Promise<QuoteEntity> {
    this.setStatus(HttpStatus.CREATED);
    return QuoteService.createQuote(request.user, body);
  }

  /**
   * @summary Remove a quote
   */
  @Response<UnauthorizedErrorResponse>(UnauthorizedError.status, UnauthorizedError.message)
  @Response<ValidationErrorResponse>(ValidationError.status, ValidationError.message)
  @Delete("{id}")
  public async deleteQuote(
    @Request() request: AuthenticatedRequest,
    @Path("id") quoteId: string,
  ): Promise<QuoteEntity> {
    return QuoteService.deleteQuote(request.user, quoteId);
  }
}

