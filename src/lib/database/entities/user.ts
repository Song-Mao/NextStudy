import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId = undefined!;

  @Column()
  username: string = '';

  @Column()
  password: string = ''; // 注意：实际应用中请使用哈希密码
}