export const dynamic = "force-dynamic";

import { ResetPasswordForm } from "./ResetPasswordForm";

export default function Page({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = typeof searchParams?.code === "string" ? searchParams.code : "";

  return <ResetPasswordForm code={code} />;
}
