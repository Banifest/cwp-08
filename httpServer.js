const net = require('net');
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const hostname = '127.0.0.1';
const port = 3450;
const tcpPort = 3453;

const client = new net.Socket();
client.setEncoding('utf8');




app.post('/workers', (req, res)=>
{
    client.connect(tcpPort, ()=>
    {
        client.write('1');
    });

    client.on('data', (data)=>
    {
        console.log(data);
        if(data === 'ACS')
        {
            client.write('getWorkers');
        }
        else
        {
            console.log(data);
            client.destroy();
        }
    });
});

app.post('/workers/add', (req, res) =>
{
    client.connect(tcpPort, () =>
    {
        client.write(`add ${req.body.X}`);
    });
    client.on('data', (data) =>
    {
        res.end(JSON.stringify(data));
        client.destroy();
    });
});

app.post('/workers/remove', (req, res) =>
{
    client.connect(tcpPort, () =>
    {
        client.write(`remove ${req.body.id}`);
    });
    client.on('data', (data) =>
    {
        res.end(JSON.stringify(data));
        client.destroy();
    });
});

app.listen(port, ()=>{});
