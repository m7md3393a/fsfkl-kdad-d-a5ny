const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
    cooldown: 3,
  aliases: ["s",'geç'],
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}});
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send({embed: {"description": `**${message.author} ⏩ مررت الأغنية التي استمعت إليها**`, "color": "BLUE"}});
  }
};
//Oyun Craft Abone Ol R3lease Kalp