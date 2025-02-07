import { shipEngine } from "@/helper/shipEngine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { address, packages } = await req.json();

    if (!address || !packages) {
      return NextResponse.json(
        { error: "Missing address or package information in the request body" },
        { status: 400 }
      );
    }

    // Use ShipEngine's `getRatesWithShipmentDetails` method for cleaner handling
    const shipmentDetails = await shipEngine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: {
          name: address.name,
          phone: address.phone,
          addressLine1: address.street,
          cityLocality: address.city,
          stateProvince: address.state,
          postalCode: address.postalCode,
          countryCode: address.country || "PK",
          addressResidentialIndicator: "no",
        },
        shipFrom: {
          name: "Luxewalk",
          phone: "03333306127",
          addressLine1: "A-422 Block A, North Nazimabad",
          cityLocality: "Karachi",
          stateProvince: "Sindh",
          postalCode: "74000",
          countryCode: "PK",
          addressResidentialIndicator: "no",
        },
        packages: packages, // Pass package details from the request
      },
      rateOptions: {
        carrierIds: [
          process.env.SHIPENGINE_FIRST_COURIER || "",
          process.env.SHIPENGINE_SECOND_COURIER || "",
          process.env.SHIPENGINE_THIRD_COURIER || "",
          process.env.SHIPENGINE_FOURTH_COURIER || "",
        ].filter(Boolean), // Include only valid carrier IDs
      },
    });

    // Return the shipment details as JSON
    return NextResponse.json(shipmentDetails, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching rates:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch shipping rates", details: error.message },
      { status: 500 }
    );
  }
}
