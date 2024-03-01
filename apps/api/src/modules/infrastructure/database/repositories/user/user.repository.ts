import {
  DatabaseConnection,
  ExceptionFactory,
} from '@backend-basics/api-utilities';
import { User, userSchema } from '@backend-basics/shared-schemas';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { registerAccountTokenLifetimeInMs } from '../../../jwt/jwt.constants';
import { Collection } from '../../database.types';
import { databaseSchema } from '../../schemas/database.schema';

@Injectable()
export class UserRepository implements OnApplicationBootstrap {
  private readonly collection: Collection<'user'>;

  constructor(
    connection: DatabaseConnection<typeof databaseSchema>,
    private readonly mongoDBIndexService: MongoDBIndexService,
  ) {
    this.collection = connection.collection('user');
  }

  async onApplicationBootstrap() {
    await this.mongoDBIndexService.ensureIndexes(this.collection, [
      {
        specification: { email: 1 },
        options: { unique: true },
      },
      {
        specification: {
          'authProvider.type': 1,
          'authProvider.externalUserId': 1,
        },
        options: { unique: true, sparse: true },
      },
      {
        specification: { createdAt: 1 },
        options: {
          expireAfterSeconds: Math.floor(
            registerAccountTokenLifetimeInMs / 1000,
          ),
          partialFilterExpression: {
            authProvider: { $in: [null] },
          },
        },
      },
    ]);
  }

  async createUser(data: Omit<User, '_id' | 'authProvider'>): Promise<User> {
    const userDocument = {
      ...userSchema.omit({ _id: true, authProvider: true }).parse(data),
      _id: nanoid(),
    };
    await this.collection.insertOne(userDocument);
    return userDocument;
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.collection.findOne({ _id: id });
  }

  async findUserByIdOrThrow(id: string): Promise<User> {
    const document = await this.findUserById(id);
    if (!document) {
      throw ExceptionFactory.NotFoundException('NOT_FOUND');
    }
    return document;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async findUserByMicrosoftId(id: string): Promise<User | null> {
    return this.collection.findOne({
      'authProvider.type': 'microsoft',
      'authProvider.externalUserId': id,
    });
  }

  async findUserByMicrosoftIdOrThrow(id: string): Promise<User> {
    const document = await this.findUserByMicrosoftId(id);
    if (!document) {
      throw ExceptionFactory.NotFoundException('NOT_FOUND');
    }
    return document;
  }

  async setAuthProviderForUser(
    id: string,
    authProvider: Required<Pick<User, 'authProvider'>>['authProvider'],
  ): Promise<User | null> {
    return await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: userSchema
          .pick({ authProvider: true })
          .required()
          .parse({ authProvider }),
      },
      { returnDocument: 'after' },
    );
  }

  async setAuthProviderForUserOrThrow(
    id: string,
    authProvider: Required<Pick<User, 'authProvider'>>['authProvider'],
  ): Promise<User> {
    const document = await this.setAuthProviderForUser(id, authProvider);
    if (!document) {
      throw ExceptionFactory.NotFoundException('NOT_FOUND');
    }
    return document;
  }

  async findOrCreateUser(email: string): Promise<[User, boolean]> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      return [existingUser, false];
    }
    const newUser = await this.createUser({
      email,
      createdAt: new Date(),
    });

    return [newUser, true];
  }
}
