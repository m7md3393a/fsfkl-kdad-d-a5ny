const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send({embed: {"description": `**🚫 الأغنية التي استمعت إليها قد انتهت.**`, "color": "BLUE"}});
    }

    let stream = null;

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com") && SOUNDCLOUD_CLIENT_ID) {
        const info = await scdl.getInfo(song.url, SOUNDCLOUD_CLIENT_ID);
        const opus = scdl.filterMedia(info.media.transcodings, { format: scdl.FORMATS.OPUS });
        stream = await scdl.downloadFromURL(opus[0].url, SOUNDCLOUD_CLIENT_ID);
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const type = song.url.includes("youtube.com") ? "opus" : "ogg/opus";
    const dispatcher = queue.connection
      .play(stream, { type: type })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
        dispatcher.setVolumeLogarithmic(queue.volume / 75);
    const serverQueue = message.client.queue.get(message.guild.id);

    try {
      var playingMessage = await queue.textChannel.send({embed: {"description": `**R3LEASE | بدأت 🎧 الموسيقى 🎧 \ n العنوان \ n[${song.title}](${song.url}) \n فتاحة \n ${message.author}\n مستوى الصوت \n${serverQueue.volume}%**`, "color": "BLUE"}});
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send({embed: {"description": `**${user} ⏩ مررت الأغنية التي استمعت إليها**`, "color": "BLUE"}});
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send({embed: {"description": `**${user} ⏸ أوقفت الأغنية التي كنت تستمع إليها.**`, "color": "BLUE"}}); 
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send({embed: {"description": `**${user} ▶ فتحت الأغنية التي أوقفتها.**`, "color": "BLUE"}}); 
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send({embed: {"description": `**نظام الحلقة ${queue.loop ? "**Açık**" : "**Kapalı**"}**`, "color": "BLUE"}}); 
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send({embed: {"description": `**${user} ⏹ أغلقت الأغنية التي استمعت إليها.**`, "color": "BLUE"}}); 
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
//Oyun Craft Abone Ol R3lease Kalp