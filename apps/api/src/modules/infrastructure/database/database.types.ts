import { Collection as RawCollection } from 'mongodb';
import {
  DatabaseSchemaKey,
  DatabaseSchemaType,
} from './schemas/database.types';

export type Collection<Key extends DatabaseSchemaKey> = RawCollection<
  DatabaseSchemaType[Key]
>;
