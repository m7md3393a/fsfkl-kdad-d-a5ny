  const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
    cooldown: 3,
    aliases: ["الان العب","لاعب"],

  description: "يظهر أنكي يلعب الأغنية",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send({embed: {"description": `**${message.author} لم أتمكن من العثور على أغنية لتشغيلها.**`, "color": "BLUE"}}); 
    const song = queue.songs[0];

    let nowPlaying = new MessageEmbed()

      .setTitle("هذا اللاعب Anki")

      .setDescription(`${song.title}\n${song.url}`)
      .setColor("BLUE")
      .setAuthor("R3LEASE")
      .setTimestamp();

    if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
//Oyun Craft Abone Ol R3lease Kalp

