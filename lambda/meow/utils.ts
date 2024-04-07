import * as config from "./config";
import * as _ from "lodash";
import { PROMPT_LIST } from "./config";

function formatApiRequestBody(data: any): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };
}
export async function sendReply(chatId: string, text: string): Promise<any> {
  const data = JSON.stringify({
    chat_id: chatId,
    text,
  });

  const res = await fetch(
    `${config.TELEGRAM_WEBHOOK_URL}/sendMessage`,
    formatApiRequestBody(data),
  );

  return await res.json();
}

function getRandomSearchPrompt(): string {
  return _.sample(PROMPT_LIST)!;
}

export async function getRandomCatGif(): Promise<string> {
  const searchPrompt = getRandomSearchPrompt();
  console.log("PROMPT", searchPrompt);
  const res = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${config.GIPHY_API_TOKEN}&q=${searchPrompt}`,
  );

  const data = await res.json();

  console.log("allCats", JSON.stringify(data));

  return _.sample(data.data).images.original.url;
}

export async function sendAnimation(chatId: string) {
  const data = JSON.stringify({
    chat_id: chatId,
    animation: await getRandomCatGif(),
  });

  console.log("randomCatGif", JSON.stringify(data));

  const res = await fetch(
    `${config.TELEGRAM_WEBHOOK_URL}/sendAnimation`,
    formatApiRequestBody(data),
  );

  return await res.json();
}
