import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource, initializeDataSource } from '@/lib/database/dataSource';
import { User } from '@/lib/database/entities/user';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 仅允许POST请求
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // 从请求体中获取用户ID
        const { userId } = req.body;
        console.log('userId',userId);
        if (!userId) {
            return res.status(400).json({ success: false, message: '用户ID不能为空' });
        }

        // 确保userId是一个有效的ObjectId
        const objectId = ObjectId.createFromHexString(userId);;
        // 初始化数据库连接
        await initializeDataSource();
        const userRepository = AppDataSource.getMongoRepository(User);

        // 查找用户并更新状态
        const user = await userRepository.findOneBy({ _id: objectId });

        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }

        // 更新用户状态为离线
        user.isOnline = false;
        await userRepository.save(user);

        return res.status(200).json({ success: true, message: '退出登录成功' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
}
