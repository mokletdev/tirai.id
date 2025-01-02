import { H1 } from "@/components/ui/text";
import { findDiscounts } from "@/utils/database/discount.query";
import { Role } from "@prisma/client";
import { RoleCard } from "./components/RoleCard";

export default async function DiscountManagement() {
  const discounts = await findDiscounts();
  const roles = Object.keys(Role);

  return (
    <div className="flex flex-col">
      <H1 className="mb-8 text-black">Manajemen Diskon</H1>
      <div className="mb-2 grid grid-cols-2 gap-2 text-black">
        {roles.map((i) => (
          <RoleCard
            role={i}
            key={i}
            discount={discounts.find((j) => j.target_role === i)}
          />
        ))}
      </div>
    </div>
  );
}
