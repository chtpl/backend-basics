import { z } from 'zod';
import { databaseSchema } from './database.schema';

export type DatabaseSchemaType = z.infer<typeof databaseSchema>;
export type DatabaseSchemaKey = keyof DatabaseSchemaType;
