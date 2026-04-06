import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ⬅️ PENTING

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No url" }, { status: 400 });
  }

  const imageRes = await fetch(url);
  const buffer = await imageRes.arrayBuffer();

  // console.log("IMAGE PROXY HIT");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
