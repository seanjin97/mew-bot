import { sendAnimation, sendReply } from "./utils";

exports.handler = async function (event: { body: string }) {
  console.log("request", JSON.stringify(event, undefined, 2));

  const messageBody = JSON.parse(event.body);

  const chatId = messageBody.message.chat.id;
  const command = messageBody.message.text;

  switch (command) {
    case "/gimme":
      await sendReply(chatId, "ok cutie, please wait xoxo");
      await sendAnimation(chatId);
      break;
    case "/gimme@corrupted_mew_bot":
      await sendReply(chatId, "ok cutie, please wait xoxo");
      await sendAnimation(chatId);
      break;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello there my boi, CDK! You've hit ${JSON.stringify(event)}\n`,
  };
};
