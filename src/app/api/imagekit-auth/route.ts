import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ik() {
  // Make sure these three envs are defined on the SERVER (not NEXT_PUBLIC)
  return new ImageKit({
    publicKey: process.env.IMAGEK_PUBLIC_KEY!,
    privateKey: process.env.IMAGEK_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEK_URL_ENDPOINT!,
  });
}

// Optional GET for quick manual tests in the browser
export async function GET() {
  try {
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 5 * 60;
    const { signature } = ik().getAuthenticationParameters(token, expire);
    return NextResponse.json(
      { token, expire, signature },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[imagekit-auth][GET]", err);
    return NextResponse.json(
      { error: "auth-failed", message: String(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}) as any);
    const token = body?.token ?? crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 5 * 60;

    const { signature } = ik().getAuthenticationParameters(token, expire);
    return NextResponse.json(
      { token, expire, signature },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("[imagekit-auth][POST]", err);
    return NextResponse.json(
      { error: "auth-failed", message: String(err) },
      { status: 500 },
    );
  }
}
