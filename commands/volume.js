const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
    cooldown: 3,
  aliases: ["v",'ses'],
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member))
      return message.channel.send({embed: {"description": `**بادئ ذي بدء ، تحتاج إلى الانضمام إلى قناة صوتية.**`, "color": "BLUE"}}); 

    if (!args[0]) return message.channel.send({embed: {"description": `**🔊 تعديل حجم الصوت: **${queue.volume}%**.**`, "color": "BLUE"}}); 
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (parseInt(args[0]) > 150 || parseInt(args[0]) < 0)
      return message.channel.send({embed: {"description": `**يرجى كتابة الرقم بين 150-1.**`, "color": "BLUE"}}); 

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 150);

    return queue.textChannel.send({embed: {"description": `**الضوضاء **${args[0]}%**.**`, "color": "BLUE"}}); 
  }
};
//Oyun Craft Abone Ol R3lease Kalp




module.exports = {
  name: "صوت",
    cooldown: 3,
  aliases: ["v",'ses'],
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    if (!canModifyQueue(message.member))
      return message.channel.send({embed: {"description": `**بادئ ذي بدء ، تحتاج إلى الانضمام إلى قناة صوتية.**`, "color": "BLUE"}}); 

    if (!args[0]) return message.channel.send({embed: {"description": `**🔊 تعديل حجم الصوت: **${queue.volume}%**.**`, "color": "BLUE"}}); 
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (parseInt(args[0]) > 150 || parseInt(args[0]) < 0)
      return message.channel.send({embed: {"description": `**يرجى كتابة الرقم بين 150-1.**`, "color": "BLUE"}}); 

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 150);

    return queue.textChannel.send({embed: {"description": `**الضوضاء **${args[0]}%**.**`, "color": "BLUE"}}); 
  }
};
//Oyun Craft Abone Ol R3lease Kalp