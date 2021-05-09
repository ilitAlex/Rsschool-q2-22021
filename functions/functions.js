const fs = require("fs");

exports.fromInputFile = function (args) {
    try {
        let readableStream = fs.createReadStream(args.input, "utf8")
        readableStream.on("data", function (chunk) {
            if (args.output) {
                fs.appendFileSync(args.output, encoding(chunk, args.shift, args.action))
            } else {
                process.stdout.write('encoded/decoded text: ');
                process.stdout.write(encoding(chunk, args.shift, args.action) + '\n');
            }
        })
    } catch(e) {
        process.stderr.write('error ' + e.message)
    }



};


exports.fromStdin = function (args) {
    try {
        let Writable = require('stream').Writable;
        let ws = Writable();
        ws._write = function (chunk, enc, next) {
            chunk = chunk.toString()
            if (args.output) {
                fs.appendFileSync(args.output, encoding(chunk, args.shift, args.action))
            } else {
                process.stdout.write('encoded/decoded text: ');
                process.stdout.write(encoding(chunk, args.shift, args.action) + '\n');
            }
            next();
        };
        process.stdin.pipe(ws);
    } catch(e) {
        process.stderr.write('error ' + e.message)
    }




};


function encoding (content, shift, action) {
    let textOutput = []
    if (action === 'decode') {shift = -(shift)}
    content.split('').map((el) => {
        let elWithShift = el.charCodeAt() + shift;
        if (el.search(/[A-Z]/g) !== -1) {
            if (elWithShift > 90) {
                elWithShift = elWithShift % 90 + 64
            }
            textOutput.push(String.fromCharCode(elWithShift))
        }
        if (el.search(/[a-z]/g) !== -1) {
            if (elWithShift > 122) {
                elWithShift = elWithShift % 122 + 96
            }
            textOutput.push(String.fromCharCode(elWithShift))
        }
        if (el.search(/[A-Za-z]/g) === -1) {
            textOutput.push(String.fromCharCode(el.charCodeAt()))  // if it is another symbol
        }
    });
    textOutput.push('\n');
    return textOutput.join('');
};
