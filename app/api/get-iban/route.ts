import { NextResponse } from "next/server";

//ts-ignore
export async function GET() {
  const iban = process.env.IBAN;

  return NextResponse.json({ iban });
}