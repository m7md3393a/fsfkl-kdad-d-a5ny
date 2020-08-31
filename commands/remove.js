const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
    cooldown: 3,
    aliases: ["kaldır","sıra-kaldır",'sırakaldır','sıra-sil','sırasil'],
  description: "Remove song from the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embed: {"description": `**تعذر العثور على الأغنية في قائمة الانتظار.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.channel.send({embed: {"description": `**شكل الاستخدام: ${message.client.prefix}remove <Sıra رقم>.**`, "color": "BLUE"}}); 
    if (isNaN(args[0])) return message.channel.send({embed: {"description": `**شكل الاستخدام: ${message.client.prefix}remove <Sıra رقم>.**`, "color": "BLUE"}});

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send({embed: {"description": `**${message.author} ❌ إزالة **${song[0].title}** من الذيل.**`, "color": "BLUE"}}); 
  }
};
//Oyun Craft Abone Ol R3lease Kalp