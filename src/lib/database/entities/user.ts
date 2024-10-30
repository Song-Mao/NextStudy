import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId = undefined!;

  @Column({ type: 'varchar', length: 10, unique: true })
  username: string = '';

  @Column()
  password: string = ''; 

  @Column({ type: 'boolean', default: false })
  isOnline: boolean = false;
}