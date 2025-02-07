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
            const url = new URL('${config.WEBHOOK_URL.toString()}');
            url.pathname = "/qrcode";
            url.searchParams.set("pixCode", pixcode);
            img.src = url.toString();
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
