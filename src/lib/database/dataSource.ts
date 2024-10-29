import { DataSource } from 'typeorm';
import { User } from './entities/user';

// 创建数据源实例，连接到本地MongoDB数据库
export const AppDataSource = new DataSource({
  type: 'mongodb', // 数据库类型
  host: 'localhost', // 数据库主机
  port: 27017, // 数据库端口
  database: 'chatSystem', // 数据库名称
  entities: [User], // 定义实体
  synchronize: true, // 自动同步实体到数据库
});

// 初始化数据源
export async function initializeDataSource() {
  // 检查数据源是否已初始化
  if (!AppDataSource.isInitialized) {
    // 如果未初始化，进行初始化
    await AppDataSource.initialize();
  }
}