import { Telegraf } from "telegraf";
import { Message } from "typegram";
import { grossToNet, netToGross } from "./math";
import { arrToUsd, parseNumberFromMessage, toUsd } from "./util";

enum ActionsEnum {
  NET_TO_GROSS_BTN = "NET_TO_GROSS_BTN",
  GROSS_TO_NET_BTN = "GROSS_TO_NET_BTN",
}

const helpMessage = `Чтобы перевести что-то в NET или GROSS, пришлите боту сумму в формате dddd$, где dddd - число без пробелов, а $ - знак доллара`;

const bot = new Telegraf(process.env.BOT_TOKEN ?? "");

bot.start((ctx) => ctx.reply(helpMessage, { parse_mode: "Markdown" }));
bot.help((ctx) => ctx.reply(helpMessage, { parse_mode: "Markdown" }));
bot.hears(/\d+\$/, (ctx) => {
  const grossNum = parseFloat(ctx.message.text.replace("gross", ""));

  if (isNaN(grossNum)) {
    return ctx.reply(`Что-то пошло не так, попробуйте еще`);
  }

  ctx.reply(`Во что перевести ${grossNum}$?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Из Net в Gross",
            callback_data: ActionsEnum.NET_TO_GROSS_BTN,
          },
          {
            text: "Из Gross в Net",
            callback_data: ActionsEnum.GROSS_TO_NET_BTN,
          },
        ],
      ],
    },
  });
});
bot.launch();

bot.action(ActionsEnum.GROSS_TO_NET_BTN, (ctx) => {
  const chatId = ctx.chat?.id ?? "";
  const rawSum = parseNumberFromMessage(
    (ctx.update.callback_query.message as Message.TextMessage).text
  );

  if (rawSum !== false) {
    const rawUsd = toUsd(rawSum);
    const [monthlyNet, yearlyNet] = arrToUsd(...grossToNet(rawSum));

    bot.telegram.sendMessage(
      chatId,
      `Для *${rawUsd}* GROSS\n\nМесячная *NET: ${monthlyNet}* \nГодовая *NET: ${yearlyNet}*`,
      { parse_mode: "Markdown" }
    );
  } else {
    bot.telegram.sendMessage(chatId, `Something wrong`);
  }
});

bot.action(ActionsEnum.NET_TO_GROSS_BTN, (ctx) => {
  const chatId = ctx.chat?.id ?? "";
  const rawSum = parseNumberFromMessage(
    (ctx.update.callback_query.message as Message.TextMessage).text
  );

  if (rawSum !== false) {
    const rawUsd = toUsd(rawSum);
    const [monthlyGross, yearlyGross] = arrToUsd(...netToGross(rawSum));

    bot.telegram.sendMessage(
      chatId,
      `Для *${rawUsd}* NET\n\nМесячная *GROSS: ${monthlyGross}* \nГодовая *GROSS: ${yearlyGross}*`,
      { parse_mode: "Markdown" }
    );
  } else {
    bot.telegram.sendMessage(chatId, `Something wrong`);
  }
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
