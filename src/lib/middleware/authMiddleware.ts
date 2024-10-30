import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) {
    console.log('req.headers.cookie', req.headers.cookie);
    // 使用正则表达式从cookie中提取token
    const token = req.headers.cookie?.match(/token=([^;]*)/)?.[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token is required' });
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        jwt.verify(token, secret);
        next(); // 继续执行后续的处理函数
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && (error as { name?: string }).name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        console.error('JWT verification error:', error);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
} 