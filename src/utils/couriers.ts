type GetCarriersProps = {
  originCity: string;
  destinationCity: string;
  weightInKg: number; // Weight in kg
};

type BinderbyteApiResponse<T> = {
  status: number;
  mesage: string;
  data: T;
};

export const getCouriers = async ({
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps) => {
  try {
    const COST_CHECK_URL = `https://api.binderbyte.com/v1/cost?api_key=${process.env.SHIPMENT_API_KEY}&courier=jne%2Csicepat%2Canteraja%2Clion%2Csap%2Cpos%2Cide&origin=${originCity}&destination=${destinationCity}&weight=${weightInKg}`;

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

    return courierCosts;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getCostByCourierCode = async ({
  carrierCode,
  service,
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps & { carrierCode: string; service: string }) => {
  const carriers = await getCouriers({
    originCity,
    destinationCity,
    weightInKg,
  });

  if (!carriers) {
    return;
  }

  const chosenCarrier = carriers.data.costs.find(
    (c) => c.code === carrierCode && c.service === service,
  );

  const cost = chosenCarrier ? Number(chosenCarrier.price) : undefined;

  return cost;
};

export const getShipmentStatus = async (courierCode: string, awb: string) => {
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

    return shipmentStatus;
  } catch (error) {
    console.log(error);
    return;
  }
};
