"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import { EmailService } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { resetPasswordTemplate, verifyTemplate } from "@/utils/mail-template";
import { generateToken } from "@/utils/random-string";

const EMAIL_VERIFICATION_DELAY_SECONDS = 120;

export const requestVerificationMail = async ({
  userId,
  userEmail,
}: {
  userId?: string;
  userEmail?: string;
}): Promise<ActionResponse<any>> => {
  try {
    if (!userId && !userEmail)
      return ActionResponses.notFound(`User tidak ditemukan`);

    const user = await prisma.user.findUnique({
      where: userId ? { id: userId } : { email: userEmail },
      include: { tokens: true },
    });

    if (!user) return ActionResponses.notFound(`User tidak ditemukan`);

    const { name, email, is_verified, tokens } = user;

    if (is_verified)
      return ActionResponses.badRequest(`User telah diverifikasi`);

    const verificationToken = tokens.find(
      (token) => token.purpose === "EMAIL_VERIFICATION",
    );

    const now = new Date();

    const timeSinceLastSent = verificationToken?.last_sent
      ? (now.getTime() - new Date(verificationToken.last_sent).getTime()) / 1000
      : Infinity;

    if (timeSinceLastSent < EMAIL_VERIFICATION_DELAY_SECONDS) {
      return ActionResponses.badRequest(
        `Mohon menunggu ${EMAIL_VERIFICATION_DELAY_SECONDS - timeSinceLastSent} detik sebelum membuat permintaan lagi`,
      );
    }

    const newToken = generateToken();

    // Update/create token data in the database
    const token = await prisma.token.upsert({
      where: { id: verificationToken?.id || "" },
      update: { token: newToken, last_sent: now, sent_count: { increment: 1 } },
      create: {
        token: newToken,
        last_sent: now,
        sent_count: 1,
        purpose: "EMAIL_VERIFICATION",
        user: { connect: { id: userId } },
      },
    });

    const mailService = new EmailService();
    const sentMail = await mailService.sendEmail({
      subject: "Verifikasi email anda untuk Tirai.id",
      to: email,
      html: verifyTemplate(
        name,
        `${process.env.APP_URL}/auth/verify?token=${token.token}`,
      ),
    });

    return ActionResponses.success(sentMail);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError();
  }
};

export const requestResetPasswordMail = async (
  userEmail: string,
): Promise<ActionResponse<any>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { tokens: true },
    });

    if (!user) return ActionResponses.notFound(`User tidak ditemukan`);

    const { name, email, tokens } = user;

    const resetPasswordToken = tokens.find(
      (token) => token.purpose === "RESET_PASSWORD",
    );

    const now = new Date();

    const timeSinceLastSent = resetPasswordToken?.last_sent
      ? (now.getTime() - new Date(resetPasswordToken.last_sent).getTime()) /
        1000
      : Infinity;

    if (timeSinceLastSent < EMAIL_VERIFICATION_DELAY_SECONDS) {
      return ActionResponses.badRequest(
        `Mohon menunggu ${EMAIL_VERIFICATION_DELAY_SECONDS - timeSinceLastSent} detik sebelum membuat permintaan lagi`,
      );
    }

    const newToken = generateToken();

    // Update/create token data in the database
    const token = await prisma.token.upsert({
      where: { id: resetPasswordToken?.id || "" },
      update: { token: newToken, last_sent: now, sent_count: { increment: 1 } },
      create: {
        token: newToken,
        last_sent: now,
        sent_count: 1,
        purpose: "RESET_PASSWORD",
        user: { connect: { email: userEmail } },
      },
    });

    const mailService = new EmailService();
    const sentMail = await mailService.sendEmail({
      subject: `Reset kata sandi anda untuk akun ${email}`,
      to: email,
      html: resetPasswordTemplate(
        name,
        `${process.env.APP_URL}/auth/reset-password/reset?token=${token.token}`,
      ),
    });

    return ActionResponses.success(sentMail);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError();
  }
};
