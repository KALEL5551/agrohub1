import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const orders = await db.bulkOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const order = await db.bulkOrder.create({
      data: {
        product: body.product,
        quantity: parseInt(body.quantity, 10),
        grade: body.grade,
        location: body.location,
        deadline: new Date(body.deadline),
        status: "PENDING",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bulk order" },
      { status: 500 }
    );
  }
}