const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
    cooldown: 3,
    aliases: ["duraklat"],
  description: "يوقف تشغيل الموسيقى",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send({embed: {"description": `**${message.author} ⏸ أوقفت الأغنية التي كنت تستمع إليها.**`, "color": "BLUE"}}); 
    }
  }
};
//Oyun Craft Abone Ol R3lease Kalp