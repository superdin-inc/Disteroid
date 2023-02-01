(async () => {
	// Require the necessary discord.js classes
	console.log('Checking core dependencies...');
	try {
		require('repl')
			._builtinLibs.filter(e => e != 'sys')
			.forEach(require);
		console.log('Node core detected.');
	} catch (e) {
		throw new Error('Node core not detected.');
	}
	const fs = require('node:fs');
	const path = require('node:path');
	let old_require = require;
	let { execSync } = require('child_process');
	try {
		var { token } = require('./config.json');
	} catch (e) {
		console.error('Please provide a token in the config.json');
		process.exit(1);
	}
	require = name => {
		try {
			return old_require(name);
		} catch (e) {
			//console.log('Running npm install '+name);
			execSync('npm i ' + name + ' --force');
			try {
				return old_require(name);
			} catch (e) {
				throw new Error('Failed to load module ' + name);
			}
		}
	};
	const {
		Client,
		Collection,
		Events,
		GatewayIntentBits,
	} = require('discord.js');
	console.log('Discord.js installed...');
	const consola = require('consola');
	console.log('Consola installed...');
	const art = require('figlet');
	console.log('Figlet font installed...');
	process.stdout.write('\u001bc');
	console.log(
		art.textSync('Disteroid', {
			font: 'speed',
			horizontalLayout: 'default',
			verticalLayout: 'default',
			width: 150,
			whitespaceBreak: true,
		})
	);
	console.log('Disteroid by 5UP3R_D1N inc. | https://github.com/superdin-inc/Disteroid')
	consola.success('Core dependencies check passed, Starting...');
	consola.wrapConsole();
	// Create a new client instance
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
	});
	// Load commands

	client.commands = new Collection();
	try {
		var commandFiles = fs
			.readdirSync(path.join(process.cwd(), 'commands'))
			.filter(file => file.endsWith('.js'));
	
		if (commandFiles.length > 0)
			consola.info('Loading ' + commandFiles.length + ' commands');
		else consola.warn('No command to load');
		for (const file of commandFiles) {
			const filePath = path.join(path.join(process.cwd(), 'commands'), file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				consola.info('Loaded /' + command.data.name);
			} else {
				consola.warn(
					`The command at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
		}
		consola.success('Loaded ' + commandFiles.length + ' commands');
	} catch(e) {consola.warn('No command to load');}
	try {
		const addonFiles = fs
			.readdirSync(path.join(process.cwd(), 'modules'))
			.filter(file => file.endsWith('.js'));
		if (addonFiles.length > 0)
			consola.info('Loading ' + addonFiles.length + ' modules');
			else consola.warn('No module to load');
		let addonList = addonFiles.map(e => {
			return { name: e, status: 'Not loaded' };
		});
		//let addonList = [];
		for (const file of addonFiles) {
			let setStatus = status =>
				(addonList[addonList.findIndex(e => e.name === file)].status = status);
			const filePath = path.join(process.cwd(), 'modules', file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				//client.commands.set(command.data.name, command);
				try {
					setStatus('Loading');
					eval(
						'(' +
							command.execute.toString() +
							')(' +
							JSON.stringify(command.data) +
							')'
					);
					setStatus('Loaded');
				} catch (e) {
					e.message =
						'Cannot load module ' + command.data.name + ' : ' + e.message;
					setStatus('Error');
					consola.error(e);
				}
				//consola.info('Loaded ' + filePath);
			} else {
				consola.warn(
					`The module at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
		}
		consola.success('Loaded ' + addonFiles.length + ' modules :');
		console.table(addonList);
	} catch (e) {consola.warn('No module to load');}
	// When the client is ready, run this code (only once)
	// We use 'c' for the event parameter to keep it separate from the already defined 'client'
	client.once(Events.ClientReady, c => {
		consola.success(`Ready! Logged in as ${c.user.tag}`);
		consola.info('Information :');
		console.table({ ...c.user, ...c.application });
	});

	// Log in to Discord with your client's token
	consola.info('Logging into Discord API...');
	client.login(token);
})();
