import { sendAnimationFromCache, sendReply } from "../common/utils";
import { SECRET_CHAT_ID } from "../common/config";
import { REMINDER_MESSAGES } from "../common/personality";
import * as _ from "lodash";
import { getCatGifUrls } from "../common/s3";

exports.handler = async function (event: any) {
  console.log("request", JSON.stringify(event, undefined, 2));

  const CAT_GIF_URLS = await getCatGifUrls();

  await Promise.all([
    sendReply(SECRET_CHAT_ID, _.sample(REMINDER_MESSAGES)!),
    sendAnimationFromCache(SECRET_CHAT_ID, _.sample(CAT_GIF_URLS)!),
  ]);
};
