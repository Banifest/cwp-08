const net = require('net');
const fs = require("fs");
const child_process = require("child_process");

const port = 3453;
let seed = 0;
const startedWorkers = {};
console.log(startedWorkers);

const server = net.createServer((client) =>
{
    console.log('Client connected');
    client.setEncoding('utf-8');

    client.on('data', (data) =>
    {
        console.log(data);
        if (data === 'getWorkers')
        {
            if (!startedWorkers.length)
            {
                client.write('[]');
            }
            else
            {
                const answer = [];
                //console.log(startedWorkers);
                for (let iter in startedWorkers)
                {
                    if (iter && Number.isInteger(Number(iter)))
                    {
                        let member = startedWorkers[iter];
                        //console.log(member);
                        fs.readFile(member.fileName, (err, info) =>
                        {
                            answer.push({id: iter, startedOn: member.date, numbers: info});
                            console.log(err);
                            // console.log(startedWorkers.length);
                            if (answer.length === startedWorkers.length)
                            {
                                console.log(answer);
                                client.write(JSON.stringify(answer));
                            }
                        });
                    }
                }
            }
        }
        else if (data.search(/add ?/) !== -1)
        {
            console.log(data);
            client.id = Date.now() + seed++;
            data = data.substring(4);

            //console.log(startedWorkers);
            startedWorkers[client.id] =
            {
                process: child_process.spawn('node', ['worker.js', `${client.id}.json`, Number(data)]),
                date: new Date(),
                fileName: `work/${client.id}.json`
            };

            !startedWorkers.length ? startedWorkers.length = 1 : startedWorkers.length++;
            client.write(`{ id: ${client.id}, startedOn: "${startedWorkers[client.id].date}"}`);
        }
        else if (data.search(/remove ?/) !== -1)
        {
            data = data.substring(7);
            console.log(data);
            startedWorkers[data].process.kill();
            fs.readFile(startedWorkers[data].fileName, (err, info) =>
            {
                client.write(`{id: ${data}, startedOn: ${startedWorkers[data].date}, numbers: ${info}}`, () =>
                {
                    startedWorkers.length--;
                    startedWorkers[data] = undefined;
                });
            });
        }
        else
        {
            console.log('aaa');
            startedWorkers[data].process.kill();
            startedWorkers[data] = undefined;
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