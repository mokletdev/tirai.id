"use server";

import { ActionResponse, ActionResponses } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { encrypt } from "@/utils/encryption";

export const resetPassword = async (
  resetToken: string,
  newPassword: string,
): Promise<ActionResponse> => {
  try {
    const token = await prisma.token.findUnique({
      where: { token: resetToken },
    });
    if (!token || token.purpose !== "RESET_PASSWORD")
      return ActionResponses.badRequest("Token anda tidak valid");

    const user = await prisma.user.findUnique({ where: { id: token.user_id } });
    if (!user) return ActionResponses.notFound("User tidak ditemukan");

    const hashedPassword = encrypt(newPassword);

    // Update the user's password to the new one
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete unused reset token
    await prisma.token.delete({ where: { id: token.id } });

    return ActionResponses.success(undefined);
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Terjadi kesalahan");
  }
};
