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

export const getCarriers = async ({
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps) => {
  try {
    const COST_CHECK_URL = `https://api.binderbyte.com/v1/cost?api_key=${process.env.SHIPMENT_API_KEY}&courier=jne%2Csicepat%2Canteraja%2Clion%2Csap%2Cpos%2Cide&origin=${originCity}&destination=${destinationCity}&weight=${weightInKg}`;

    const res = await fetch(COST_CHECK_URL);
    const carrierCosts: BinderbyteApiResponse<{
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

    return carrierCosts;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getCostByCarrierCode = async ({
  carrierCode,
  service,
  originCity,
  destinationCity,
  weightInKg,
}: GetCarriersProps & { carrierCode: string; service: string }) => {
  const carriers = await getCarriers({
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
