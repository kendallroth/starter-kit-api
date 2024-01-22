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
import { PaginatedFilterQuery, PaginatedResult } from "#common/types";
import { HttpStatus } from "#common/utilities";
import { AuthenticatedRequest } from "#server/authentication";
import { QuoteService } from "./quote.service";
import { QuoteCreateBody, QuoteResponse, QuoteUpdateBody } from "./quote.types";

@Tags("Quote")
@Security("jwt")
@Route("quote")
export class QuoteController extends Controller {
  /**
   * @summary Get all visible quotes (supports sorting, search)
   */
  @NoSecurity()
  @Get()
  public async getQuotes(
    // Technically this endpoint may or may not be authenticated!
    @Request() request: AuthenticatedRequest,
    @Queries() query: PaginatedFilterQuery,
  ): Promise<PaginatedResult<QuoteResponse>> {
    return QuoteService.getQuotes(request.user, query);
  }

  /**
   * @summary Get the quote of the day
   */
  // NOTE: Must be registered BEFORE ":id" route!
  @NoSecurity()
  @Get("qod")
  public async getQuoteOfTheDay(): Promise<QuoteResponse> {
    return QuoteService.getQuoteOfTheDay();
  }

  /**
   * @summary Get a random quote
   */
  // NOTE: Must be registered BEFORE ":id" route!
  @NoSecurity()
  @Get("random")
  public async getRandomQuote(): Promise<QuoteResponse> {
    return QuoteService.getRandomQuote();
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
  ): Promise<QuoteResponse> {
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
  ): Promise<QuoteResponse> {
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
  ): Promise<QuoteResponse> {
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
  ): Promise<QuoteResponse> {
    return QuoteService.deleteQuote(request.user, quoteId);
  }
}
