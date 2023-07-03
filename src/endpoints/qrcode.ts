import { decode, json, qrcode } from "../deps.ts";

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
