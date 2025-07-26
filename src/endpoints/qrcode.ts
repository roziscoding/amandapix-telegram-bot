import { qrcode as qrCode } from "jsr:@libs/qrcode";
import { decodeBase64 } from "jsr:@std/encoding";
import { json } from "sift";

export function getQRCode(req: Request) {
  const url = new URL(req.url);
  const pixCode = new TextDecoder().decode(decodeBase64(decodeURIComponent(url.searchParams.get("pixCode") ?? "")));

  if (!pixCode) {
    return json({ message: "missing pixCode param" }, { status: 422 });
  }
  if (Array.isArray(pixCode)) {
    return json({ message: "more than one pixCode provided" }, { status: 422 });
  }

  const code = qrCode(pixCode, { output: "svg" });

  return new Response(code, { headers: { "Content-Type": "image/svg+xml" } });
}
