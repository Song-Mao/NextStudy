// server/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource, initializeDataSource } from '@/lib/database/dataSource'; // 确保数据库连接管理正确导入
import bcrypt from 'bcrypt';
import { User } from '@/lib/database/entities/user';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('进入了');
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // 初始化数据库连接
        await initializeDataSource(); // 使用单例模式初始化数据库

        const userRepository = AppDataSource.getMongoRepository(User); // 直接使用User，假设已经在dataSource中导入

        // 查找用户
        let user = await userRepository.findOneBy({ username }); // 更新查找方法

        if (!user) {
            // 如果用户不存在，创建新用户
            const hashedPassword = await bcrypt.hash(password, 10);
            user = userRepository.create({
                username: username,
                password: hashedPassword
            });
    
            await userRepository.save(user);
            return res.status(201).json({ success: true, message: '用户创建成功', user }); // 添加 success 字段
        } else {
            // 如果用户存在，验证密码
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: '用户名或密码错误' }); // 添加 success 字段
            }
            return res.status(200).json({ success: true, message: '登录成功', user }); // 添加 success 字段
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}