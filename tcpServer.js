const net = require('net');
const fs = require("fs");
const child_process = require("child_process");

const port = 3453;
let seed = 0;

child_process.exec(`node worker.js ${client.id} ${Number(data)}`);

const startedWorkers = {};

const server = net.createServer((client) =>
{
    console.log('Client connected');
    client.setEncoding('utf-8');

    client.on('data', (data) =>
    {
        if(!client.id)
        {
            client.id = Date.now() + seed++;
            startedWorkers[client.id] = child_process.spawn('node', ['worker.js', `${client.id}.json`, Number(data)]);
        }
        else
        {
            startedWorkers[data].kill();
        }
    });

    client.on('end', () =>
    {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});