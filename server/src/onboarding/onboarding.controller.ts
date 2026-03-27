import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingSession } from './schemas/onboarding-session.schema';

@Controller('api/v1/onboarding/sessions')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  async initSession() {
    const session = await this.onboardingService.createSession();
    return { sessionId: session._id, currentStep: session.currentStep, status: session.status };
  }

  @Get(':sessionId')
  getSession(@Param('sessionId') sessionId: string) {
    return this.onboardingService.getSession(sessionId);
  }

  @Patch(':sessionId')
  updateSession(
    @Param('sessionId') sessionId: string,
    @Body() body: { step: number; data: Partial<OnboardingSession> },
  ) {
    return this.onboardingService.updateSession(sessionId, body.step, body.data);
  }

  @Post(':sessionId/submit')
  submitSession(@Param('sessionId') sessionId: string) {
    return this.onboardingService.submitSession(sessionId);
  }
}
