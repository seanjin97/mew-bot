import {
  sendAnimationFromCache,
  sendReply,
  getCatGifUrls,
} from "../common/utils";
import { SECRET_CHAT_ID } from "../common/config";
import { REMINDER_MESSAGES } from "../common/personality";
import * as _ from "lodash";

const catGifUrls = await getCatGifUrls();

export const handler = async function (event: any) {
  console.log("request", JSON.stringify(event, undefined, 2));

  await Promise.all([
    sendReply(SECRET_CHAT_ID, _.sample(REMINDER_MESSAGES)!),
    sendAnimationFromCache(SECRET_CHAT_ID, _.sample(catGifUrls)! as string),
  ]);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `You've hit mew poke`,
  };
};
