import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const conn = await dbConnect();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully connected to MongoDB",
        database: conn.connection.db.databaseName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
