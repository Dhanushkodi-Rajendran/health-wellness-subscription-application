import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { OnboardingSessionDocument } from '../onboarding/schemas/onboarding-session.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createFromSession(session: OnboardingSessionDocument) {
    return this.userModel.findOneAndUpdate(
      { sessionId: session._id.toString() },
      {
        fullName: session.basicInfo?.fullName,
        email: session.basicInfo?.email,
        age: session.basicInfo?.age,
        country: session.basicInfo?.country,
        plan: session.planSelection,
        sessionId: session._id.toString(),
      },
      { upsert: true, new: true },
    );
  }

  async findAll() {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }
}
