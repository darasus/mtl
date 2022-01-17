import crypto = require('crypto');
import cuid = require('cuid');
import { User } from '../entities';
import { graph } from '../redis.graph';

export class UserActions {
  private hashPassword(email, password) {
    const s = `${email}:${password}`;
    return crypto.createHash('sha256').update(s).digest('hex');
  }

  register({ email, password }: { email: string; password: string }) {
    const params = { email } as any;

    if (!email || !password) {
      throw { email: 'Email or password is not provided', status: 400 };
    }

    console.log('hello');

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((results) => {
        if (results.hasNext()) {
          throw { email: 'Email already in use', status: 400 };
        } else {
          const params = {
            id: cuid(),
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
              'CREATE (user:User {id: $id, email: $email, password: $password, nickname: $nickname, name: $name, image: $image, emailVerified: $emailVerified, createdAt: $createdAt, updatedAt: $updatedAt }) RETURN user',
              params
            )
            .then((createdUser) => {
              while (createdUser.hasNext()) {
                const record = createdUser.next();
                return new User(record.get('user'));
              }
            });
        }
      });
  }

  login({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      throw { email: 'Email or password is not provided', status: 400 };
    }

    const params = { email } as any;

    console.log({ params });

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'Username does not exist', status: 400 };
        } else {
          while (foundedUser.hasNext()) {
            const record = foundedUser.next() as any;
            const dbUser = record.get('user').properties;
            console.log(email, password);
            if (dbUser.password !== this.hashPassword(email, password)) {
              throw { password: 'Wrong password', status: 400 };
            }
            return new User(record.get('user'));
          }
        }
      });
  }

  getUserByEmail({ email }) {
    console.log({ email });
    const params = { email } as any;

    return graph
      .query('MATCH (user:User {email: $email}) RETURN user', params)
      .then((foundedUser) => {
        if (!foundedUser.hasNext()) {
          throw { username: 'User with this email not found', status: 404 };
        } else {
          while (foundedUser.hasNext()) {
            const record = foundedUser.next() as any;
            return new User(record.get('user'));
          }
        }
      });
  }

  verifyEmail({ email }) {
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
                  return new User(record.get('user'));
                }
              });
          }
        }
      });
  }

  changePassword({ email, password }) {
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
                  return new User(record.get('user'));
                }
              });
          }
        }
      });
  }
}
