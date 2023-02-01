# Disteroid
Too lightweight discord bot framework

This one is inspired by Sapphire, decided to make my own single-file version of it

## How to use

1. Download and unzip it somewhere
2. Create `config.json` and put this into your config :
```json
{
    "token": "TOKEN HERE",
    "clientId": "BOT CLIENT ID HERE"
}
```
3. Create folder named `commands` and put commands into it, Syntax is the same as discord.js
4. Run `npm start`, everything should start installing and work!

> There is 3 scripts
> 1. `npm start` Normal start
> 2. `npm run build` Build from src.js to index.js
> 3. `npm run watch` Automatically build and restart when something changes

## Modules/Addons

Modules is a small implementation i made, basically run that module on startup, it just open more possibilities.
Different between modules and commands is commands loads using discord.js command loader, but modules are loaded globally.
Syntax are the same, but how you code it is different

To start making a new module,

In folder named `modules`, create a new file `example.js`, put this snippet in,
```js
module.exports = {
    data: {
        name: 'Example addon',
    }, //This "data" will provide addon name for the script, and will appear on the execute argument
    execute: data => { //Better require() that dynamically install package!
        require('consola').success('Loaded Example addon');
        /* Add your code here!
        foo.addListener('bar',() => console.log)
        */
    }
}
```
> Do not use any declaration prefix, like `let`, `const` or `var`, this have a chance to break the system

> Only put code inside `execute` function, or all variables outside will not be accessible by the function

> All variables on the module will be shared directly to the main script, in bidirectional

## Notes

> There is no need to do `npm install`, The script will dynamically install that package whenever it need

> Never trust anyone by putting random addons from people, this can leak your token
