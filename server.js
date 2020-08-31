const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json");

const client = new Client({ disableMentions: "everyone" });
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('R3LEASE Bot | Aktif!')) // sitenize girdiğinde görebilirsiniz.
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT))
client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();

client.on("ready", () => {
 console.log(`${client.user.username} Bot Aktif!`);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 3000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 3000;
        return message.reply(
          `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.channel.send({embed: {"description": `**يوجد خطأ في الأوامر الآن حاول مرة أخرى بعد دقيقة واحدة.**`, "color": "BLUE"}});
    }
  }
});
//Oyun Craft Abone Ol R3lease Kalp

//CLIENT EVENTS
client.on("ready", () => {
  console.log('Ready to play song | Bot created by CTK WARRIOR')
  client.user.setActivity("1.play")
})