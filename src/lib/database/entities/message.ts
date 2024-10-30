import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Chat } from './chat';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender!: User;

    @Column()
    senderId!: string;

    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: 'chatId' })
    chat!: Chat;

    @Column()
    chatId!: string;
}
