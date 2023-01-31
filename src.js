// Require the necessary discord.js classes
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
        execSync('npm i '+name+' --force');
        try {
            return old_require(name);
        } catch (e) {
            throw new Error('Failed to load module '+name);
        }
    }
}
process.stdout.write('\u001bc');
const consola = require('consola');
consola.wrapConsole();
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
try {
	var commandFiles = fs.readdirSync(path.join(process.cwd(), 'commands')).filter(file => file.endsWith('.js'));
} catch (e) {
	process.stderr.write('Cannot find "commands" folder, create one to continue');
	process.exit(1);
}
if (commandFiles.length > 0) consola.info('Loading '+commandFiles.length+' commands');
else consola.warn('No command to load');
for (const file of commandFiles) {
	const filePath = path.join(path.join(process.cwd(), 'commands'), file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
        consola.info('Loaded /'+command.data.name);
	} else {
		consola.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
consola.success('Loaded '+commandFiles.length+' commands');

try {
	const addonFiles = fs.readdirSync(path.join(process.cwd(), 'modules')).filter(file => file.endsWith('.js'));
	if (addonFiles.length > 0) consola.info('Loading ' + addonFiles.length + ' modules(addon)');
	let addonList=addonFiles.map(e=>{return {name: e, status: 'Not loaded'}})
	for (const file of addonFiles) {
		let setStatus = (status) => addonList[addonList.findIndex(e=>e.name === file)].status = status;
		const filePath = path.join(process.cwd(), 'modules', file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			//client.commands.set(command.data.name, command);
			try {
				setStatus('Loading');
				eval('('+command.execute.toString()+')('+JSON.stringify(command.data)+')');
				setStatus('Loaded');
			} catch (e) {
				e.message = 'Cannot load addon ' + command.data.name+' : '+e.message;
				setStatus('Error');
				consola.error(e);
			}
			consola.info('Loaded ' + filePath);
		} else {
			consola.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	consola.success('Loaded ' + addonFiles.length + ' addons :');
	console.table(addonList);
} catch(e) {}
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	consola.success(`Ready! Logged in as ${c.user.tag}`);
	consola.info('Information :');
	console.table({ ...c.user,...c.application });
});

// Log in to Discord with your client's token
consola.info('Logging into Discord API...');
client.login(token);
