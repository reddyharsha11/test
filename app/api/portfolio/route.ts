import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";

// For this prototype, we'll mock the authenticated user since there's no real session yet.
const MOCK_USER_ID = "mock-user-123";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    // In a real app, userId comes from session/token
    const userId = MOCK_USER_ID; 

    // Upsert the portfolio for this user
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error: any) {
    console.error("Portfolio POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const userId = MOCK_USER_ID; 
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, portfolio }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
