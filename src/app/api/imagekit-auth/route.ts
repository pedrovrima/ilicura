// app/api/imagekit-auth/route.ts (Next.js App Router)
import ImageKit from "imagekit";

export async function GET() {
  const ik = new ImageKit({
    publicKey: process.env.IMAGEK_PUBLIC_KEY!, // server env (NOT NEXT_PUBLIC)
    privateKey: process.env.IMAGEK_PRIVATE_KEY!, // server env only
    urlEndpoint: process.env.IMAGEK_URL_ENDPOINT!,
  });
  console.log(ik.getAuthenticationParameters());
  return Response.json(ik.getAuthenticationParameters()); // { token, expire, signature }
}
