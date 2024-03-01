import { userSchema } from '@backend-basics/shared-schemas';
import { z } from 'zod';

export const databaseSchema = z.strictObject({
  user: userSchema,
});
