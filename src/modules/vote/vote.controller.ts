import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { VotesService } from './vote.service';
import { Routes } from 'src/common/router/routes';
import { UuidValidationPipe } from 'src/common/pipes/uuid.validation.pipe';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.auth.guard';
import { userErrorHandler } from 'src/common/handler/user.error.handler';
import { UserHasNotVotesError } from 'src/common/errors/user.custome.errors';

@Controller(Routes.votes)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('likes/:toUserID')
  async createVote(
    @Request() req,
    @Param('toUserID', UuidValidationPipe) toUserID: string,
    @Query('vote') vote: number,
  ) {
    try {
      const result = await this.votesService.canUserVotePermission(
        req.user.userID,
        toUserID,
        vote,
      );
      return result;
    } catch (error) {
      throw new userErrorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:voteID')
  async update(
    @Request() req,
    @Param('voteID', UuidValidationPipe) voteID: string,
    @Query('vote') vote: number,
  ) {
    try {
      const updatedResult = await this.votesService.updateVotes(
        req.user.userID,
        voteID,
        vote,
      );
      return updatedResult;
    } catch (error) {
      throw new userErrorHandler(error);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('total')
  async totalUsersVotes(
    // @Param('toUserID', UuidValidationPipe) toUserID: string,
    @Request() req,
  ) {
    try {
      const totalVotes = await this.votesService.totalUsersVotes(
        req.user.userID,
      );
      return totalVotes;
    } catch (error) {
      userErrorHandler(error);
    }
  }
}
