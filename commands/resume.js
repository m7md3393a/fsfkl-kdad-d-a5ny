const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resume",
    cooldown: 3,
  aliases: ["r",'devam-et','devam','devamet'],
  description: "Resume currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send({embed: {"description": `**${message.author} ▶ فتحت الأغنية التي أوقفتها.**`, "color": "BLUE"}}); 
    }

    return message.channel.send({embed: {"description": `**${message.author} لم يتم العثور على الأغنية المعلقة.**`, "color": "BLUE"}}); 
  }
};
//Oyun Craft Abone Ol R3lease Kalp