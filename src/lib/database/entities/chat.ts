import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Message } from './message';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Message, message => message.chat)
    messages!: Message[];
}
