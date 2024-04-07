import { sendCat } from "./utils";
import { getCatGifUrls } from "./s3";
import * as _ from "lodash";

let CAT_GIF_URLS: string[];

getCatGifUrls()
  .then((res) => {
    CAT_GIF_URLS = res;
    console.log("mewbot cache initialised", CAT_GIF_URLS.length);
  })
  .catch((err) => {
    console.log("UNABLE TO INITIALISE MEWBOT", err);
  });

exports.handler = async function (event: { body: string }) {
  console.log("request", JSON.stringify(event, undefined, 2));

  const messageBody = JSON.parse(event.body);

  const chatId = messageBody.message.chat.id;
  const command = messageBody.message.text;

  const randomlyChosenGifUrl: string = _.sample(CAT_GIF_URLS)!;

  switch (command) {
    case "/mew":
      await sendCat(chatId, randomlyChosenGifUrl);
      break;
    case "/mew@corrupted_mew_bot":
      await sendCat(chatId, randomlyChosenGifUrl);
      break;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `You've hit mewbot`,
  };
};
