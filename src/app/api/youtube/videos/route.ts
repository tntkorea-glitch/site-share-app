import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getChannelVideos } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const channelId = req.nextUrl.searchParams.get("channelId");
  if (!channelId) {
    return NextResponse.json(
      { error: "channelId required" },
      { status: 400 }
    );
  }

  try {
    const videos = await getChannelVideos(accessToken, channelId);
    return NextResponse.json({ videos });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
