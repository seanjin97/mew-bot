import { sendCat, sendReply, getCatGifUrls } from "../common/utils";
import * as _ from "lodash";
import { SECRET_CHAT_ID } from "../common/config";
import { SECRET_MESSAGE } from "./config";

const catGifUrls = await getCatGifUrls();

export const handler = async function (event: { body: string }) {
  console.log("request", JSON.stringify(event, undefined, 2));

  const messageBody = JSON.parse(event.body);

  if (!messageBody.message) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: `No message body to process.`,
    };
  }
  const chatId = messageBody.message.chat.id;
  const command = messageBody.message.text;

  const randomlyChosenGifUrl: string = _.sample(catGifUrls)!;

  switch (command) {
    case "/mew":
      await sendCat(chatId, randomlyChosenGifUrl);
      break;
    case "/mew@corrupted_mew_bot":
      await sendCat(chatId, randomlyChosenGifUrl);
      break;
    case "/seansecret":
      await sendReply(SECRET_CHAT_ID, SECRET_MESSAGE);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `You've hit mewbot`,
  };
};
