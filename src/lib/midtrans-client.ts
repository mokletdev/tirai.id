import { Snap } from "./midtrans";

if (!process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
  throw new Error("ENV NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is required");
}

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error("ENV MIDTRANS_SERVER_KEY is required");
}

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const isProduction = process.env.NODE_ENV === "production";

const snapClient = new Snap({
  isProduction,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

export default snapClient;
