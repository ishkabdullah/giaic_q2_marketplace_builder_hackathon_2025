import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// POST method for handling customer data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, name, ...rest } = body;

    // Input validation
    if (!id || !email || !name) {
      return NextResponse.json(
        { error: "Missing required fields: id, email, or name" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("Checking for existing customer...");
    // Check if a customer with the given email or ID already exists
    const existingCustomer = await client.fetch(
      `*[_type == "customers" && (email == $email || Customer_id == $id)][0]`,
      { email, id }
    );

    if (existingCustomer) {
      console.log("Existing customer found:", existingCustomer);

      // Create a data object only with fields that are provided and different
      const updatedCustomerData: any = {};
      if (name && name !== existingCustomer.user_name) {
        updatedCustomerData.user_name = name;
      }
      if (rest.Contact && rest.Contact !== existingCustomer.Contact) {
        updatedCustomerData.Contact = rest.Contact;
      }
      if (rest.address && rest.address !== existingCustomer.address) {
        updatedCustomerData.address = rest.address;
      }

      // If there are no changes, return without performing an update
      if (Object.keys(updatedCustomerData).length === 0) {
        return NextResponse.json(
          { status: "no_change", message: "No changes detected in customer data" },
          { status: 200 }
        );
      }

      // Update the existing customer with the modified fields only
      const updatedCustomer = await client
        .patch(existingCustomer._id)
        .set(updatedCustomerData)
        .commit();

      console.log("Customer updated successfully:", updatedCustomer);
      return NextResponse.json(
        { status: "updated", message: "Customer updated successfully", customer: updatedCustomer },
        { status: 200 }
      );
    }

    console.log("Creating a new customer...");
    // Create a new customer if not found
    const newCustomer = await client.create({
      _type: "customers",
      Customer_id: id,
      user_name: name,
      email,
      Contact: rest.Contact || "",
      address: rest.address || "",
    });

    console.log("New customer created:", newCustomer);
    return NextResponse.json(
      { status: "created", message: "Customer created successfully", customer: newCustomer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling customer data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// GET method for verifying customer existence
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required query parameters: id" },
        { status: 400 }
      );
    }

    // Query for customer based on ID
    const customer = await client.fetch(
      `*[_type == "customers" && (Customer_id == $id)][0]`,
      { id }
    );

    if (customer) {
      console.log("Customer found:", customer);
      return NextResponse.json(
        { status: "found", message: "Customer exists", customer },
        { status: 200 }
      );
    } else {
      console.log("Customer not found");
      return NextResponse.json(
        { status: "not_found", message: "Customer does not exist" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error verifying customer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
