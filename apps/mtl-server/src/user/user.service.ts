import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  user(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: postWhereUniqueInput,
    });
  }
}
