module.exports = {
	data: { name: 'Event loader' },
	execute: async () => {
		const eventsPath = path.join(__dirname, 'events');
		try {
			fs.eventFiles = fs
				.readdirSync(eventsPath)
				.filter(file => file.endsWith('.js'));
		} catch (e) {consola.info('No event to load');return;}
		if (fs.eventFiles.length > 0) consola.info('Loading ' + fs.eventFiles.length + ' events');
		else consola.info('No event to load');
		for (const file of fs.eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
		if (fs.eventFiles.length > 0) consola.success('Loaded ' + fs.eventFiles.length + ' events');
	},
};
