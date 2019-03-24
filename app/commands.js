"use strict";

const fs = require("fs"),
    path = require("path");

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
    const blacklist = process.env.MODULE_BLACKLIST || "",
        moduleBlacklist = blacklist.split(",").map(module => module.trim().toUpperCase()),
        modulePath = path.join(__dirname, "commands");

    if(!fs.existsSync(modulePath)) return null;

    let commands;
    fs.readdirSync(modulePath).forEach((module) => {
        if(path.extname(module) !== ".js") return;

        const moduleName = path.parse(module).name;

        if(moduleBlacklist.includes(moduleName.toUpperCase())) return;

        console.log(`Loading module: ${module}`);
        commands = Object.assign({}, commands, loadModule(path.join(modulePath, module)));
    });

    return commands;
}

module.exports = exports = loadModules();
