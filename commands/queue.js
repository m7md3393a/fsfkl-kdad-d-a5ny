const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "queue",
    cooldown: 3,
  aliases: ["q",'kuyruk','liste'],
  description: "Show the music queue and now playing.",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 

    const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

    let queueEmbed = new MessageEmbed()
      .setTitle("R3LEASE Müzik Listesi")
      .setDescription(description)
      .setColor("BLUE");

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};
//Oyun Craft Abone Ol R3lease Kalp