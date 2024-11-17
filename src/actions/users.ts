"use server";
import { revalidatePath } from "next/cache";
import { createUser, findUser, updateUser } from "@/utils/database/user.query";
import { ActionResponse, ActionResponses } from "@/lib/actions";
import { encrypt } from "@/utils/encryption";

export const upsertUser = async ({
  data,
  id,
}: {
  data: FormData;
  id?: string;
}): Promise<ActionResponse<{ message: string }>> => {
  try {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const phone_number = data.get("phone_number") as string | null;

    const existingEmail = await findUser({ email });
    if (existingEmail && !id) {
      return ActionResponses.badRequest("This email is already in use");
    }
    if (phone_number && !id) {
      const existingPhoneNumber = await findUser({ phone_number });
      if (existingPhoneNumber)
        return ActionResponses.badRequest("This number is already in use");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userInput: any = {
      name,
      email,
      phone_number,
      password: encrypt(password),
      is_verified: false,
    };

    if (!id) {
      await createUser({
        ...userInput,
      });
    } else {
      await updateUser(
        { id },
        {
          ...userInput,
        },
      );
    }

    revalidatePath("/");
    return ActionResponses.success({ message: "User upserted successfully" });
  } catch (error) {
    console.error(error);
    return ActionResponses.serverError("Failed to upsert user");
  }
};
