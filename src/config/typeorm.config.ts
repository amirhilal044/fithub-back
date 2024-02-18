import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   // url: 'postgres://postgres:qvmhEYpJRubJgj5@fithubc1.postgres.database.azure.com:5432/postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || '123',
//   database: process.env.DB_NAME || 'fithub',
// entities: [__dirname + '/../**/*.entity{.ts,.js}'],
// synchronize: process.env.TYPEORM_SYNC === 'true' || true,
//   logging: true,
// };
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'fithubc1.postgres.database.azure.com',
  port: 5432,
  username: 'postgres',
  password: 'qvmhEYpJRubJgj5',
  database: 'fithub',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
