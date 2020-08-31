const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["çal","p"],
  description: "استخدم YouTube أو Soundcloud للاستماع إلى الأغنية",
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.channel.send({embed: {"description": `**بادئ ذي بدء ، تحتاج إلى الانضمام إلى قناة صوتية.**`, "color": "BLUE"}}); 
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`You must be in the same channel as ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message.channel.send({embed: {"description": `**Kullanım Şekli: ${message.client.prefix}play <Video Link  | Video İsmi | Soundcloud Linki>.**`, "color": "BLUE"}}); 
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send({embed: {"description": `**Odaya Katılmıyorum İzinim Yok Lütfen İzinleri Değiştirin.**`, "color": "BLUE"}}); 
    if (!permissions.has("SPEAK"))
      return message.channel.send({embed: {"description": `**Odaya Katıldım Fakat Konuşma İznim Yok Lütfen İzinleri Değiştirin.**`, "color": "BLUE"}}); 

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 75,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
   
      if (!SOUNDCLOUD_CLIENT_ID)
        return message.reply("Missing Soundcloud Client ID in config").catch(console.error);
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: url
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.reply("Could not find that Soundcloud track.").catch(console.error);
        return message.reply("There was an error playing that Soundcloud track.").catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.channel.send({embed: {"description": `**${message.author} حاولت ولكن لم ينجح الرجاء كتابة اسم الفيديو بالكامل...**`, "color": "BLUE"}}); 
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel({embed: {"description": `**✅ **${song.title}** فيديو بعنوان الذيل ${message.author} أضيفت من قبل..**`, "color": "BLUE"}});
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send({embed: {"description": `**${message.author} لم أستطع الانضمام إلى غرفة الصوت خطأ = ${error}.**`, "color": "BLUE"}}); 
    }
  }
};
//Oyun Craft Abone Ol R3lease Kalp
