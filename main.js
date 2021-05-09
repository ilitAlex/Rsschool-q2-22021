const fs = require("fs");
const mod = require("./functions/functions");

const minimist = require('minimist');
const args = minimist(process.argv.slice(2), {
    alias: {
        s: 'shift',
        i: 'input',
        o: 'output',
        a: 'action',
    }
});


function caesarCoding() {
    if (!args.shift) {
        throw new Error("you didn't enter shift")
    }
    if (!Number.isInteger(args.shift)) {
        throw new Error('you entered not an integer')
    }
    if (!args.action) {
        throw new Error("you didn't enter action")
    }
    if (args.action !== 'encode' && args.action !== 'decode') {
        throw new Error('you entered incorrect action')
    }
    if (args.input && args.input === args.output) {
        throw new Error('check input and output files')
    }
    if (args.shift > 25) {
        args.shift = args.shift % 25
    };

    if (args.output && !fs.existsSync(args.output)) {
        try {
            fs.openSync(args.output, 'a+')
        } catch(e) {
            process.stderr.write('error ' + e.message)
        }
    };

    if (args.input) {
        mod.fromInputFile(args)
    } else {
        mod.fromStdin(args)
    }
};

try {
    caesarCoding()
} catch(e) {
    process.stderr.write('error: ' + e.message )
};




