require("dotenv").config();

const fs = require("fs");
const path = require("path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    EmbedBuilder,
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
    console.log("Ready!");
});

client.on("interactionCreate", async(interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.on("guildMemberAdd", async(member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "general"
    );

    if (!channel) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const embed = new EmbedBuilder()
        .setColor("#000000")
        .setTitle("Welcome! :smile:")
        .setDescription(
            `Welcome to the server, ${member}! Bot created by [Dash](
                https://github.com/1nOnlyDash
            )! :star: \n Follow me on my socials it helps a lot!`
        );
    member.guild.channels.cache.get(channel.id).send({ embeds: [embed] });
});

client.login(process.env.TOKEN);
