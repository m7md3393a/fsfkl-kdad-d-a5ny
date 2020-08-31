module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("تحتاج إلى الانضمام إلى قناة الصوت أولاً!").catch(console.error);
      return false;
    }

    return true;
  }
};
