import { BinderbyteApiResponse } from "@/types/courier";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const originCity = searchParams.get("originCity");
  const destinationCity = searchParams.get("destinationCity");
  const weightInKg = searchParams.get("weightInKg");

  const getCostsSchema = z.object({
    originCity: z.string().min(1),
    destinationCity: z.string().min(1),
    weightInKg: z.number(),
  });

  if (
    !getCostsSchema.safeParse({
      originCity,
      destinationCity,
      weightInKg: Number(weightInKg),
    }).success
  ) {
    return NextResponse.json(
      { status: 400, message: "Bad request" },
      { status: 400 },
    );
  }

  try {
    const COST_CHECK_URL = `https://api.binderbyte.com/v1/cost?api_key=${process.env.SHIPMENT_API_KEY}&courier=jne,anteraja,sap,pos&origin=${originCity}&destination=${destinationCity}&weight=${weightInKg}`;

    const res = await fetch(COST_CHECK_URL);
    const courierCosts: BinderbyteApiResponse<{
      summary: {
        courier: string[];
        origin: string;
        destination: string;
        weight: string;
      };
      costs: {
        code: string;
        name: string;
        service: string;
        type: string;
        price: string;
        estimated: string;
      }[];
    }> = await res.json();

    return NextResponse.json(courierCosts, { status: courierCosts.status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const revalidate = 7200;
