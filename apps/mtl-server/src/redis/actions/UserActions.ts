import { TUser } from '@mtl/types';
import crypto = require('crypto');
import { User } from '../entities';
import { graph } from '../redis.graph';

export class UserActions {
  private hashPassword(email: string, password: string) {
    const s = `${email}:${password}`;
    return crypto.createHash('sha256').update(s).digest('hex');
  }

  register({
    email,
    password,
    id,
  }: {
    id: string;
    email: string;
    password: string;
  }): Promise<TUser | any> {
    const params = { email } as any;

    if (!email || !password) {
      throw { email: 'Email or password is not provided', status: 400 };
    }

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((results) => {
        if (results.hasNext()) {
          throw { email: 'Email already in use', status: 400 };
        } else {
          const params = {
            id,
            email,
            emailVerified: false,
            nickname: email,
            name: email,
            image: '/user-image.png',
            password: this.hashPassword(email, password),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any;
          return graph
            .query(
              `
              CREATE (user:User {id: $id, email: $email, password: $password, nickname: $nickname, name: $name, image: $image, emailVerified: $emailVerified, createdAt: $createdAt, updatedAt: $updatedAt })
              RETURN user
              `,
              params
            )
            .then((res) => {
              while (res.hasNext()) {
                return User(res.next());
              }
            });
        }
      });
  }

  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<TUser | any> {
    if (!email || !password) {
      throw { email: 'Email or password is not provided', status: 400 };
    }

    const params = { email } as any;

    return graph
      .query('MATCH (user:User { email: $email }) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'Username does not exist', status: 400 };
        } else {
          while (foundedUser.hasNext()) {
            const record = foundedUser.next() as any;
            const dbUser = record.properties;
            if (dbUser.password !== this.hashPassword(email, password)) {
              throw { password: 'Wrong password', status: 400 };
            }
            return User(record);
          }
        }
      });
  }

  getUserByEmail({ email }: { email: string }): Promise<TUser | any> {
    const params = { email } as any;

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'User with this email not found', status: 404 };
        } else {
          while (foundedUser.hasNext()) {
            const record = foundedUser.next() as any;
            return User(record);
          }
        }
      });
  }

  getUserByNickname({ nickname }: { nickname: string }): Promise<TUser | any> {
    const params = { nickname } as any;

    return graph
      .query('MATCH (user:User {nickname: $nickname}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'User with this nickname not found', status: 404 };
        } else {
          while (foundedUser.hasNext()) {
            const record = foundedUser.next() as any;
            return User(record);
          }
        }
      });
  }

  verifyEmail({ email }: { email: string }): Promise<TUser | any> {
    const params = { email } as any;

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'User with this email not found', status: 404 };
        } else {
          while (foundedUser.hasNext()) {
            return graph
              .query(
                'MATCH (user:User {email: $email}) SET user.emailVerified = true RETURN user',
                params
              )
              .then((createdUser) => {
                while (createdUser.hasNext()) {
                  const record = createdUser.next();
                  return User(record);
                }
              });
          }
        }
      });
  }

  changePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<TUser | any> {
    const params = { email } as any;

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'User with this email not found', status: 404 };
        } else {
          while (foundedUser.hasNext()) {
            const params = {
              email,
              password: this.hashPassword(email, password),
            } as any;

            return graph
              .query(
                'MATCH (user:User {email: $email}) SET user.password = $password RETURN user',
                params
              )
              .then((createdUser) => {
                while (createdUser.hasNext()) {
                  const record = createdUser.next();
                  return User(record);
                }
              });
          }
        }
      });
  }
}
