import { config } from "../config.ts";

function html(args: TemplateStringsArray, ...args2: string[]) {
  const text: string[] = [];

  args.forEach((str, i) => {
    text.push(str, args2[i] || "");
  });

  const result = text.join("")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();

  return new Response(result, { headers: { "Content-Type": "text/html" } });
}

export const miniapp = () => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Miniapp</title>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            const img = document.getElementById("img");
            const search = new URLSearchParams(location.search);
            const pixcode = search.get("tgWebAppStartParam");
            img.src = "https://${config.WEBHOOK_URL}/qrcode?pixCode=" + pixcode;
          })
        </script>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #000;
          }
        </style>
      </head>
      <body>
        <img id="img" style="width: 100vw;" />
      </body>
    </html>
  `;
};
