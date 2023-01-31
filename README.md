# Disteroid
Too lightweight discord bot framework

Welcome to my another single-file client stuff

This one is inspired by Sapphire, decided to make my own single-file version of it

## How to use

1. Download and unzip it somewhere
2. Create `config.json` and put this into your config :
```json
{
    "token": "TOKEN_HERE"
}
```
3. Create folder named `commands` and put commands into it, Syntax is the same as discord.js
4. Run `npm start`, everything should start installing and work!

## Modules/Addons

Modules is a small implementation i made, basically run that module on startup, it just open more possibilities.
Different between modules and commands is commands loads using discord.js command loader, but modules are loaded globally.
Syntax are the same, but how you code it is different

To start making a new module :

1. Create folder named `modules` and create a new file `example.js`, put this snippet in,
```js
module.exports = {
    data: {
        name: 'Example addon',
    },
    execute: () => { //Better require() that dynamically install package!
        require('consola').success('Loaded Example addon');
        /* Add your code here!
        foo.addListener('bar',() => console.log)
        */
    }
}
```

## Notes

> There is no need to do `npm install`, The script will dynamically install that package whenever it need

> Never trust anyone by putting random addons from people, this can leak your token
