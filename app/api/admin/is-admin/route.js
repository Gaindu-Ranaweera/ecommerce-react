export const runtime = "nodejs"; // force Node runtime

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/middlewares/authAdmin";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("userId:", userId);

    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("is-admin route error:", error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
