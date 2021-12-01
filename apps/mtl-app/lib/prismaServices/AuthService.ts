import bcrypt from "bcrypt";
import { PrismaClient } from ".prisma/client";
import mailgun from "mailgun-js";

export class AuthService {
  prisma: PrismaClient | null;
  transporter: mailgun.Mailgun | null;

  constructor({
    prisma,
    transporter,
  }: {
    prisma: PrismaClient;
    transporter: mailgun.Mailgun;
  }) {
    this.prisma = prisma;
    this.transporter = transporter;
  }

  async resetPassword(email: string) {
    const newPassword = generatePassword();
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma?.user.update({
      where: {
        email,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    await this.transporter?.messages().send({
      from: "no-reply@mytinylibrary.com",
      to: email,
      subject: "Password reset requested",
      html: `<p>Your new password is: ${newPassword}</p>`,
    });
  }
}

function generatePassword() {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
