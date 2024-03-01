import { DatabaseConnectionModule } from '@backend-basics/api-utilities';
import { Global, Module } from '@nestjs/common';

import { repositories } from './repositories';
import { databaseSchema } from './schemas/database.schema';

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
  imports: [
    DatabaseConnectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        schema: databaseSchema,
        uri: configService.get('MONGODB_URI'),
      }),
    }),
  ],
})
export class DatabaseModule {}
