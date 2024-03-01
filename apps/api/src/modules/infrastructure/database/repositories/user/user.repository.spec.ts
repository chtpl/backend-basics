import { DatabaseConnectionModule } from '@backend-basics/api-utilities';
import { User } from '@backend-basics/shared-schemas';
import { Test } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import { databaseSchema } from '../../schemas/database.schema';
import { UserRepository } from './user.repository';

const mongoTestUri =
  process.env.TEST_DB_URI ?? 'mongodb://root:password@db:27017';
const defaultUser: Omit<User, '_id' | 'authProvider'> = {
  email: 'test@mail.com',
  createdAt: new Date(),
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let client: MongoClient;

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        DatabaseConnectionModule.registerAsync({
          imports: [],
          inject: [],
          useFactory: () => ({
            db: UserRepository.name,
            schema: databaseSchema,
            uri: mongoTestUri,
          }),
        }),
      ],
      providers: [UserRepository, MongoDBIndexService],
    }).compile();
    userRepository = testModule.get(UserRepository);
    await userRepository.onApplicationBootstrap();
    client = new MongoClient(mongoTestUri);
    await client.connect();
  });

  afterEach(async () => {
    await client.db(UserRepository.name).dropDatabase();
  });

  describe('createUser', () => {
    test('successfully create a user', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const queriedUser = await userRepository.findUserById(user._id);

      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });
    });
  });

  describe('findUserById', () => {
    test('fail to find a user', async () => {
      const noUser = await userRepository.findUserById('NonExistingId');

      expect(noUser).toStrictEqual(null);
    });

    test('successfully find a user', async () => {
      const noUser = await userRepository.findUserById('NonExistingId');

      expect(noUser).toStrictEqual(null);

      const user = await userRepository.createUser(defaultUser);
      const queriedUser = await userRepository.findUserById(user._id);

      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });
    });
  });

  describe('findUserByIdOrThrow', () => {
    test('successfully find a user', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const queriedUser = await userRepository.findUserByIdOrThrow(user._id);

      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });
    });

    test('successfully find a user', async () => {
      const findNoUser = async () =>
        await userRepository.findUserByIdOrThrow('NonExistingId');
      await expect(findNoUser).rejects.toThrow('Not Found');
    });
  });

  describe('findUserByEmail', () => {
    test('successfully find a user by email', async () => {
      const user = await userRepository.createUser(defaultUser);
      const queriedUser = await userRepository.findUserByEmail(
        defaultUser.email,
      );

      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });
    });

    test('fail to find a user by email', async () => {
      const noUser = await userRepository.findUserByEmail(
        'nonexisting@email.com',
      );

      expect(noUser).toStrictEqual(null);
    });
  });

  describe('findUserByMicrosoftId', () => {
    test('successfully find a user by microsoft id', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const userWithAuth = await userRepository.setAuthProviderForUserOrThrow(
        user._id,
        authProvider,
      );

      expect(userWithAuth).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });

      const queriedUser = await userRepository.findUserByMicrosoftId(
        authProvider.externalUserId,
      );
      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });
    });

    test('fail to find a user by microsoft id', async () => {
      const noUser = await userRepository.findUserByMicrosoftId(
        'nonExistingMicrosoftId',
      );

      expect(noUser).toStrictEqual(null);
    });
  });

  describe('findUserByMicrosoftIdOrThrow', () => {
    test('successfully find user by microsoft id', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const userWithAuth = await userRepository.setAuthProviderForUserOrThrow(
        user._id,
        authProvider,
      );

      expect(userWithAuth).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });

      const queriedUser = await userRepository.findUserByMicrosoftIdOrThrow(
        authProvider.externalUserId,
      );
      expect(queriedUser).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });
    });

    test('fail to find a user by microsoft id and throw', async () => {
      const findNoUser = async () =>
        await userRepository.findUserByMicrosoftIdOrThrow(
          'nonExistingMicrosoftId',
        );

      await expect(findNoUser).rejects.toThrow('Not Found');
    });
  });

  describe('setAuthProviderForUser', () => {
    test('successfully set auth provider for user', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const userWithAuth = await userRepository.setAuthProviderForUser(
        user._id,
        authProvider,
      );

      expect(userWithAuth).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });
    });

    test('fail to set auth provider for user', async () => {
      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const nonExistingUser = await userRepository.setAuthProviderForUser(
        'NonExistingId',
        authProvider,
      );
      expect(nonExistingUser).toStrictEqual(null);
    });
  });

  describe('setAuthProviderForUserOrThrow', () => {
    test('successfully set auth provider for user', async () => {
      const user = await userRepository.createUser(defaultUser);

      expect(user).toStrictEqual({
        _id: user._id,
        ...defaultUser,
      });

      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const userWithAuth = await userRepository.setAuthProviderForUserOrThrow(
        user._id,
        authProvider,
      );

      expect(userWithAuth).toStrictEqual({
        _id: user._id,
        ...defaultUser,
        authProvider: authProvider,
      });
    });

    test('successfully set auth provider for user', async () => {
      const authProvider: Required<Pick<User, 'authProvider'>>['authProvider'] =
        {
          type: 'microsoft',
          externalUserId: 'testMicrosoftId',
        };
      const setAuthForNonExistingUser = async () =>
        await userRepository.setAuthProviderForUserOrThrow(
          'NonExistingId',
          authProvider,
        );
      await expect(setAuthForNonExistingUser).rejects.toThrow('Not Found');
    });
  });

  describe('findOrCreateUser', () => {
    test('successfully find or create user', async () => {
      const [user, isNew] = await userRepository.findOrCreateUser(
        defaultUser.email,
      );

      expect(isNew).toStrictEqual(true);
      expect(user).toStrictEqual({
        _id: user._id,
        email: defaultUser.email,
        createdAt: user.createdAt,
      });
    });
  });
});
