"use server";
export async function getCourierList() {
  try {
    const response = await fetch(
      `https://api.binderbyte.com/v1/list_courier?api_key=${process.env.SHIPMENT_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch courier list");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching courier list:", error);
    return [];
  }
}
