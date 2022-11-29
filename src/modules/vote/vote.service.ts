import { User } from 'src/database/interfaces/user.interface';
import { Vote } from 'src/database/interfaces/vote.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { generateUUIDV4 } from 'src/common/helpers/generate.uuid';
import { TIME_STEMP } from 'src/common/constants/time';
import { VALID_NUMS } from 'src/common/constants/nums';

import { randomBytes, scrypt as _scrypt } from 'crypto';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import {
  CanUserVoteThisTimeError,
  UserNotFoundError,
  YouAlreadyVoteError,
  UserHasNotVotesError,
  NumberIsIncorectError,
  DontVoteYourselfError,
  UserIsDeletedError,
  UserIsAlreadyPausedError,
} from 'src/common/errors/user.custome.errors';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
    @InjectModel('Vote') private readonly voteModel: SoftDeleteModel<Vote>,
  ) {}

  private async addVote(fromUserID: string, toUserID: string, votes: number) {
    const fromUserData = await this.userModel.findOne({ userID: fromUserID });

    const toUserData = await this.userModel.findOne({
      userID: toUserID,
    });

    if (!toUserData.get('isActive')) {
      throw new UserIsAlreadyPausedError();
    }
    if (toUserData.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    const lastVote = await this.voteModel.findOne({ from: fromUserID }).sort({
      date: -1,
    });

    if (lastVote && Date.now() - lastVote.date <= TIME_STEMP.ONE_HOUR) {
      throw new CanUserVoteThisTimeError();
    }

    const vote = new this.voteModel({
      voteID: generateUUIDV4(),
      from: fromUserData.userID,
      to: toUserData.userID,
      votes,
    });
    return await vote.save();
  }

  async updateVotes(reqUserID: string, voteID: string, votes: number) {
    const voteData = await this.voteModel.findOne({ voteID: voteID });

    if (reqUserID === voteData.to) {
      throw new DontVoteYourselfError();
    }
    if (reqUserID !== voteData.to) {
      if (votes < VALID_NUMS.MINUS_ONE || votes > VALID_NUMS.PLUS_ONE) {
        throw new NumberIsIncorectError();
      }
      voteData.votes = votes;
    }
    return await voteData.save();
  }

  private async voteExists(fromUserID: string, toUserID: string) {
    const exsistingVote = await this.voteModel.findOne({
      from: fromUserID,
      to: toUserID,
    });
    if (exsistingVote) {
      return true;
    }
    return false;
  }

  async totalUsersVotes(toUserID: string) {
    const userData = await this.voteModel.find({ to: toUserID });

    if (!userData) {
      throw new UserHasNotVotesError();
    }
    const rating = await userData.reduce((tot, el) => {
      return (tot += el.votes);
    }, 0);

    return `this user rating is ${rating} like `;
  }

  async canUserVotePermission(
    fromUserID: string,
    toUserID: string,
    vote: number,
  ) {
    if (fromUserID !== toUserID) {
      const voteData = await this.voteExists(fromUserID, toUserID);
      if (!voteData) {
        const addNewVote = await this.addVote(fromUserID, toUserID, vote);
        if (addNewVote) {
          return addNewVote;
        }
      } else {
        throw new YouAlreadyVoteError();
      }
    } else {
      // throw new NotFoundException('You have no right to like yourself');
      throw new DontVoteYourselfError();
    }
  }
}
