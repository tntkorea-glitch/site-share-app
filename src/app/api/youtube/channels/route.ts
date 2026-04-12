import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMyChannels } from "@/lib/youtube";

export async function GET() {
  const session = await auth();
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const channels = await getMyChannels(accessToken);
    return NextResponse.json({ channels });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
