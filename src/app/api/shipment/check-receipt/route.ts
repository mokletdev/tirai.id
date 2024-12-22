import { BinderbyteApiResponse } from "@/types/courier";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const courierCode = searchParams.get("courierCode");
  const awb = searchParams.get("awb");

  const checkReceiptSchema = z.object({
    courierCode: z.string().min(1),
    awb: z.string().min(1),
  });

  if (
    !checkReceiptSchema.safeParse({
      courierCode,
      awb,
    }).success
  ) {
    return NextResponse.json(
      { status: 400, message: "Bad request" },
      { status: 400 },
    );
  }

  try {
    const SHIPMENT_STATUS_URL = `https://api.binderbyte.com/v1/track?api_key=${process.env.SHIPMENT_API_KEY}&courier=${courierCode}&awb=${awb}`;

    const res = await fetch(SHIPMENT_STATUS_URL);
    const shipmentStatus: BinderbyteApiResponse<{
      summary: {
        awb: string;
        courier: string;
        service: string;
        status: string;
        date: string;
        desc: string;
        amount: string;
        weight: string;
      };
      detail: {
        origin: string;
        destination: string;
        shipper: string;
        receiver: string;
      };
      history: {
        date: string;
        desc: string;
        location: string;
      }[];
    }> = await res.json();

    return NextResponse.json(shipmentStatus, { status: shipmentStatus.status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const revalidate = 7200;
