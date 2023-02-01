module.exports = {
	data: {
		name: 'Command loader',
	},
	execute: () => {
		const { REST, Routes } = require('discord.js');
        const { clientId } = require('./config.json');
        if(!clientId) consola.error('clientId is required in config.json');
		const fs = require('node:fs');

		const commands = [];
		// Grab all the command files from the commands directory you created earlier
		const commandFiles = fs
			.readdirSync('./commands')
			.filter(file => file.endsWith('.js'));

		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			commands.push(command.data.toJSON());
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST({ version: '10' }).setToken(token);

		// and deploy your commands!
		(async () => {
			try {
				consola.info(
					`Registering commands to the API`
				);

				// The put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands }
				);
				consola.success(
					`Registered commands to the API`
				);
				fs.table = {};
				data.forEach(data=>{fs.table[data.id]={ Type: data.type, Name: data.name, Description: data.description }})
				console.table(fs.table);
				consola.info('Commands : '+commands.length)
			} catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();

		client.on(Events.InteractionCreate, async interaction => {
			if (!interaction.isChatInputCommand()) return;
		
			const command = interaction.client.commands.get(interaction.commandName);
		
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
		
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		});
	},
};
