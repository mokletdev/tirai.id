import { Database } from "@/types/chat.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function supabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (e) {
            console.error(e);
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", options);
          } catch (e) {
            console.error(e);
          }
        },
      },
    },
  );
}
