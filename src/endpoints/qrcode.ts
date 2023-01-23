import { decode } from "https://deno.land/std@0.167.0/encoding/base64.ts";
import { qrcode } from "https://raw.githubusercontent.com/denorg/qrcode/87101e061a7b1f9f9d5ddb304ca8c9e99262e9e1/mod.ts";
import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";

function createQrCode(content: string) {
  return qrcode(content)
    .then((codeString) => codeString.split(",")[1])
    .then((codeString) => decode(codeString));
}

export async function getQRCode(req: Request) {
  const url = new URL(req.url);
  const pixCode = url.searchParams.get("pixCode");

  if (!pixCode) {
    return json({ message: "missing pixCode param" }, { status: 422 });
  }
  if (Array.isArray(pixCode)) {
    return json({ message: "more than one pixCode provided" }, { status: 422 });
  }

  const buffer = await createQrCode(pixCode);

  return new Response(buffer, { headers: { "Content-Type": "image/jpeg" } });
}
