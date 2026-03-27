import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  age: number;

  @Prop()
  country: string;

  @Prop({ enum: ['Monthly', 'Quarterly', 'Annual'] })
  plan: string;

  @Prop({ required: true, unique: true })
  sessionId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
