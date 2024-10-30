import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource, initializeDataSource } from '@/lib/database/dataSource';
import { User } from '@/lib/database/entities/user';
import { authMiddleware } from '@/lib/middleware/authMiddleware'; // 导入中间件

// 处理API请求的主函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 首先执行身份验证中间件
    await authMiddleware(req, res, async () => {
        // 仅允许GET请求
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        try {
            // 初始化数据源
            await initializeDataSource();
            const userRepository = AppDataSource.getMongoRepository(User);

            // 查询所有用户
            const users = await userRepository.find();
            console.log('All Users:', users);

            // 返回用户列表
            return res.status(200).json({ success: true, users });
        } catch (error) {
            console.error('Error fetching user list:', error);
            return res.status(500).json({ success: false, message: '服务器错误' });
        }
    });
}
