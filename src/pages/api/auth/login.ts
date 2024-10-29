// server/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource, initializeDataSource } from '@/lib/database/dataSource';
import bcrypt from 'bcrypt';
import { User } from '@/lib/database/entities/user';
import jwt from 'jsonwebtoken';

// 生成JWT令牌的函数
const generateToken = (user: User) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined.');
    }
    // 使用用户ID和用户名生成令牌，设置过期时间为24小时
    return jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '24h' });
};

// 处理API请求的主函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 仅允许POST请求
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { username, password } = req.body;
    try {
        // 初始化数据源
        await initializeDataSource();
        const userRepository = AppDataSource.getMongoRepository(User);

        // 查找用户
        let user = await userRepository.findOneBy({ username });

        // 如果用户不存在，创建新用户
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = userRepository.create({ username, password: hashedPassword });
            await userRepository.save(user);
            const token = generateToken(user);
            const userWithToken = { ...user, token };
            return res.status(201).json({ success: true, message: '用户创建成功', user: userWithToken });
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }

        // 生成令牌并添加到user对象中
        const token = generateToken(user);
        const userWithToken = { ...user, token };
        return res.status(200).json({ success: true, message: '登录成功', user: userWithToken });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
}