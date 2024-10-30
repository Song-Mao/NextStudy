// 导入所需的依赖
// NextApiRequest 和 NextApiResponse 是 Next.js 提供的类型,用于处理 API 请求和响应
import type { NextApiRequest, NextApiResponse } from 'next';
// AppDataSource 和 initializeDataSource 是数据库连接相关的工具
import { AppDataSource, initializeDataSource } from '@/lib/database/dataSource';
// bcrypt 是用于密码加密的库
import bcrypt from 'bcrypt';
// User 是用户实体类,定义了用户数据结构
import { User } from '@/lib/database/entities/user';
// jsonwebtoken 用于生成和验证 JWT token
import jwt from 'jsonwebtoken';

/**
 * 生成JWT令牌的函数
 * @param user 用户对象,包含用户ID和用户名
 * @returns 返回生成的JWT令牌
 * @throws 如果未定义JWT_SECRET环境变量则抛出错误
 */
const generateToken = (user: User) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined.');
    }
    // 使用用户ID和用户名生成令牌，设置过期时间为24小时
    return jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '24h' });
};

/**
 * 处理登录/注册请求的API处理函数
 * @param req NextAPI请求对象
 * @param res NextAPI响应对象
 * @returns 返回包含用户信息和token的响应
 */


// 这个handler函数是Next.js API路由的默认导出函数
// 它会被Next.js自动调用来处理发送到 /api/auth/login 路径的HTTP请求
// 主要用于处理前端登录页面发送的登录请求
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 仅允许POST请求
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // 从请求体中获取用户名和密码
    const { username, password } = req.body;
    try {
        // 初始化数据库连接
        await initializeDataSource();
        const userRepository = AppDataSource.getMongoRepository(User);

        // 在数据库中查找用户
        let user = await userRepository.findOneBy({ username });

        // 如果用户不存在，则创建新用户（注册流程）
        if (!user) {
            // 对密码进行加密
            const hashedPassword = await bcrypt.hash(password, 10);
            // 创建新用户
            user = userRepository.create({ 
                username, 
                password: hashedPassword,
                isOnline: true // 设置在线状态为true
            });
            await userRepository.save(user);
            // 生成token并返回用户信息
            const token = generateToken(user);
            const userWithToken = { ...user, token };
            return res.status(201).json({ success: true, message: '用户创建成功', user: userWithToken });
        }

        // 如果用户存在，验证密码（登录流程）
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }

        // 更新用户在线状态
        user.isOnline = true;
        await userRepository.save(user);

        // 密码验证成功，生成token并返回用户信息
        const token = generateToken(user);
        const userWithToken = { ...user, token };
        return res.status(200).json({ success: true, message: '登录成功', user: userWithToken });
    } catch (error) {
        // 捕获并处理可能出现的错误
        console.error('Error during authentication:', error);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
}