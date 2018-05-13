var c = require('../config.js');
var log = require('./log.js');
var moment = require('moment');

module.exports.guildMemberAdd = function(guildMember){
	if(guildMember.guild.id != c.guildId) return;
    guildMember.addRole(c.baseRole);
	c.bot.guilds.get(c.guildId).channels.get(c.joinleave).send("Welcome " + guildMember + " to The Nexus!");
}
module.exports.guildMemberRemove = function(guildMember){
	if(guildMember.guild.id == c.guildId) c.bot.guilds.get(c.guildId).channels.get(c.joinleave).send(guildMember + " has left.");
}

module.exports.repeat = function(message, input){
    log.info(message.content);
    log.info('sent by: ' + message.author.id);
}

module.exports.crash = function(message, input){
	if(c.bot.guilds.get(c.guildId).members.get(message.author.id).roles.array().includes(c.bot.guilds.get(c.guildId).roles.get(c.moderator))){
		log.warn('crashing!');
		throw "Controlled Crash";
	}else{
		message.channel.send("lol nope");
	}
}

////////
//
//  LOCKDOWN
//
////////

module.exports.lockdown = function(message, input){
    //if user is a mod
  if(c.bot.guilds.get(c.guildId).members.get(message.author.id).roles.array().includes(c.bot.guilds.get(c.guildId).roles.get(c.moderator))){
        //calculate total time
        var time = 0;
        var content = message.content;
        var num = 0;
        for(var i = 10; i < content.length; i++){
            var char = content.charAt(i);
            if(char == ' ') continue;
            if(char == 'S' || char == 's'){ time += (1000 * num); num = 0; }
            if(char == 'M' || char == 'm'){ time += (60000 * num); num = 0; }
            if(char == 'H' || char == 'h'){ time += (3600000 * num); num = 0; }
            if(/^\d$/.exec(char) != null){ num *= 10; num += parseInt(char, 10); }
        }
        
        message.channel.overwritePermissions(c.baseRole, {
            'SEND_MESSAGES': false,
        }, 'lockdown');
        const embed = new c.Discord.RichEmbed()
            .setAuthor('Moderation', 'https://i.imgur.com/teomqtz.png')
            .setColor(0xE84C3D)
            .setDescription('Locked Down! ' + 'Time= ' + moment.duration(time).hours() + ':' + moment.duration(time).minutes() + ':' + moment.duration(time).seconds())
            .setFooter('BaristaBot', c.bot.user.avatarURL)
            .setTimestamp();
        message.channel.send({ embed });
        setTimeout(function(){  
            message.channel.overwritePermissions(c.baseRole, {
                'SEND_MESSAGES': null
            }, 'lockdown');
            const embed = new c.Discord.RichEmbed()
            .setAuthor('Moderation', 'https://i.imgur.com/teomqtz.png')
            .setColor(0xE84C3D)
            .setDescription('Lockdown Done!')
            .setFooter('BaristaBot', c.bot.user.avatarURL)
            .setTimestamp();
        message.channel.send({ embed });
        }, time);
    }else{
        message.channel.send("You are not a mod!");
    }
};
