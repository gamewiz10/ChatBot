import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { OpenAI } from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;

  try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You are a helpful assistant who responds succinctly"},
            {role: "user", content: message.content}
        ],
      });
    console.log("API Response:", response);
    const content = response.choices[0]?.message?.content;

     if (!content) {
      console.error("No content found in the API response:", response.choices[0]);
      return message.reply("I couldn't process your request. Please try again.");
    }
    return message.reply(content);

  } catch (err) {
    console.error("Error occured: ", err);
    return message.reply(
      "As an AI robot, I errored out."
    );
  }
});
client.login(process.env.BOT_TOKEN);