import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.PASWWORD,
  database: process.env.DB_NAME,
  // entities: [Episode],
  //   autoLoadEntities: true,
  synchronize: false, // todo: not safe for production and we should use migrations instead
  // subscribers: [__dirname + '/domain/subscribers/*.subscriber{.ts,.js}'],
  migrations: ['src/migration/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();

export default dataSource;
