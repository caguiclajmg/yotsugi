"use strict";

function loadModule(path) {
    const module = require(path),
          commands = {};

    for(const [cmd, fn] of Object.entries(module)) {
        console.log(`Adding command ${cmd}`);
        commands[cmd] = fn;
    }

    return commands;
}

function loadCoreModules() {
    let commands;

    ["nsfw", "utility"].forEach((module) => {
        console.log(`Loading module: ${module}`);
        commands = Object.assign({}, commands, loadModule(`./commands/${module}`));
    });

    return commands;
}

function loadUserModules() {
    const fs = require("fs"),
          path = require("path").join(__dirname, "commands/user");
    let commands;

    if(!fs.existsSync(path)) return null;

    fs.readdirSync(path).forEach((module) => {
        console.log(`Loading module: ${module}`);
        commands = Object.assign({}, commands, loadModule(`./commands/user/${module}`));
    });

    return commands;
}

function loadModules() {
    return Object.assign({}, loadCoreModules(), loadUserModules());
}

module.exports = loadModules();