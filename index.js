const {
    Client,
    MessageActionRow,
    MessageButton
} = require('discord.js');

require('dotenv').config()
const Parser = require('rss-parser');
let parser = new Parser();
const fs = require("fs")
const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES']
});
const notification = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomID('notification')
        .setLabel('test')
        .setEmoji("🔔")
        .setLabel("Enable Notifications")
        .setStyle('DANGER'),
    )
    .addComponents(
        new MessageButton()
        .setLabel('Channel')
        .setEmoji("852998521329680475")
        .setURL("https://www.youtube.com/channel/UCi6Mqacf1b6aieHCoY6aqYg")
        .setStyle('LINK'),
    );

setInterval(async () => {
    const Channel = client.channels.cache.get("852021668103585792");
    let json = fs.readFileSync('links.json');
    let video = JSON.parse(json)
    let channel = (await parser.parseURL('https://www.youtube.com/feeds/videos.xml?channel_id=UCi6Mqacf1b6aieHCoY6aqYg'));
    if (video.last_video === channel.items[0].id) return;
    const data = {
        "last_video": channel.items[0].id
    };
    fs.writeFile('links.json', JSON.stringify(data), function (err) {
        if (err) console.log(err)
    });
    await Channel.send({
        content: `New Video! <@&852664186294370324> ${channel.items[0].link}`,
        components: [notification]
    })
    .then(msg =>{
        msg.crosspost()
    });
}, 3000);

client.on('interaction', async interaction => {
    if (!interaction.isMessageComponent()) return;
    if (interaction.customID === 'notification' && !interaction.member.roles.cache.has("852664186294370324")) {
        interaction.member.send("You will now get a notification every time a new video is uploaded!").catch(err => console.log(err.message));
        interaction.member.roles.add("852664186294370324");
        return await interaction.deferUpdate();
    };
    return await interaction.deferUpdate();
});
client.login(process.env.DISCORD_TOKEN)