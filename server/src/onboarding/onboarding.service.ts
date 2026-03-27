import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnboardingSession, OnboardingSessionDocument } from './schemas/onboarding-session.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(OnboardingSession.name) private sessionModel: Model<OnboardingSessionDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createSession() {
    const session = new this.sessionModel();
    await session.save();
    return session;
  }

  async getSession(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found or expired');
    }
    return session;
  }

  async updateSession(sessionId: string, step: number, data: Partial<OnboardingSession>) {
    const session = await this.getSession(sessionId);
    if (session.status !== 'in_progress') {
      throw new UnprocessableEntityException('Cannot update an inactive session');
    }
    
    session.currentStep = step;
    
    if (data.basicInfo) {
      session.basicInfo = { ...session.basicInfo, ...data.basicInfo };
    }
    if (data.healthScreening) {
      session.healthScreening = { ...session.healthScreening, ...data.healthScreening };
    }
    if (data.planSelection) {
      session.planSelection = data.planSelection;
    }
    if (data.status) {
      session.status = data.status;
      session.ineligibilityReason = data.ineligibilityReason;
    }

    await session.save();
    return { success: true, currentStep: session.currentStep, status: session.status };
  }

  async submitSession(sessionId: string) {
    const session = await this.getSession(sessionId);
    if (session.status !== 'in_progress') {
      throw new UnprocessableEntityException('Cannot submit an inactive session');
    }
    if (session.currentStep !== 4) {
      throw new UnprocessableEntityException('Incomplete session cannot be submitted');
    }
    
    session.status = 'completed';
    await session.save();

    await this.usersService.createFromSession(session);
    
    return { success: true, redirectRoute: '/dashboard' };
  }
}

