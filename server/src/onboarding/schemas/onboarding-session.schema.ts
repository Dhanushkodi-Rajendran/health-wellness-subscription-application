import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OnboardingSessionDocument = OnboardingSession & Document;

@Schema({ timestamps: true })
export class OnboardingSession {
  @Prop({ required: true, enum: ['in_progress', 'completed', 'ineligible'], default: 'in_progress' })
  status: string;

  @Prop({ required: true, default: 1 })
  currentStep: number;

  @Prop({ type: Object, default: {} })
  basicInfo: {
    fullName?: string;
    email?: string;
    age?: number;
    country?: string;
  };

  @Prop({ type: Object, default: {} })
  healthScreening: {
    conditions?: string[];
    diabetesControlled?: boolean;
    recentCardiacEvent?: boolean;
  };

  @Prop({ enum: ['Monthly', 'Quarterly', 'Annual'] })
  planSelection?: string;

  @Prop()
  ineligibilityReason?: string;

  @Prop({ type: Date, expires: '30d', default: Date.now })
  expiresAt: Date;
}

export const OnboardingSessionSchema = SchemaFactory.createForClass(OnboardingSession);
