const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
    cooldown: 3,
  aliases: ["kapat","durdur"],

  description: "Stops the music",

  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send({embed: {"description": `**${message.author} ⏹ أغلقت الأغنية التي استمعت إليها.**`, "color": "BLUE"}}); 
  }
};
//Oyun Craft Abone Ol R3lease Kalp