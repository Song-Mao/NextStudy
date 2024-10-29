import { DataSource } from 'typeorm';
import { User } from './entities/user';

// 创建数据源实例
export const AppDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'chatSystem',
  entities: [User],
  synchronize: true,
});

// 初始化数据源
export async function initializeDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}