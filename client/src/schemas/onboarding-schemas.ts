import { z } from 'zod';

export const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  age: z.coerce.number().min(18, "Must be at least 18 years old"),
  country: z.string().min(2, "Country is required"),
});

export const step2Schema = z.object({
  conditions: z.array(z.string()),
  diabetesControlled: z.boolean().optional(),
  recentCardiacEvent: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.conditions.includes('Diabetes') && data.diabetesControlled === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required for Diabetes check", path: ['diabetesControlled'] });
  }
  if (data.conditions.includes('Heart Disease') && data.recentCardiacEvent === undefined) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Required for Heart Disease check", path: ['recentCardiacEvent'] });
  }
});

export const step3Schema = z.object({
  planSelection: z.enum(['Monthly', 'Quarterly', 'Annual'], { message: "Please select a plan" }),
});
