"use strict";

const fs = require("fs"),
    path = require("path"),
    config = require("../config.js");

function loadModule(path) {
    const module = require(path),
        commands = {};

    for(const [cmd, fn] of Object.entries(module)) {
        console.log(`Adding command: ${cmd}`);
        commands[cmd] = fn;
    }

    return commands;
}

function loadModules() {
    const blacklist = config.MODULE_BLACKLIST || "",
        moduleBlacklist = blacklist.split(",").map(module => module.trim()),
        modulePath = path.join(__dirname, "commands");

    if(!fs.existsSync(modulePath)) return null;

    let commands;
    fs.readdirSync(modulePath).forEach((module) => {
        const moduleName = path.parse(module).name;

        if(moduleBlacklist.includes(moduleName.toUpperCase())) return;

        console.log(`Loading module: ${module}`);
        commands = Object.assign({}, commands, loadModule(`./commands/${module}`));
    });

    return commands;
}

module.exports = exports = loadModules();
