// @deno-types="https://esm.sh/common-tags@1.8.2"
import { stripIndents } from "../deps.ts";

export const REPO_URL = "https://github.com/roziscoding/amandapix-telegram-bot";
export const PRIVACY_POLICY_URL = `${REPO_URL}/blob/main/PRIVACY.md`;
export const PRIVACY_TEXT = stripIndents`
  O Pix Bot solicita e armazena penas as informações estritamente necessárias para gerar o código pix para pagamento.
  Tais informações <b>nunca</b> serão compartilhadas com terceiros.
  Leia a política de privacidade completa <a href="${PRIVACY_POLICY_URL}">aqui</a>.
`;
