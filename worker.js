const fs = require("fs");

let jsonFile = process.argv[2];
let X = process.argv[3];

fs.writeFile(jsonFile, "[]", ()=>
{
    setInterval(()=>
               {
                   console.log(1);
                   fs.stat(jsonFile, (err, status)=>
                   {
                       let writer =  fs.createWriteStream(jsonFile, {flags: 'r+', start: (status.size - 1)});
                       let separator = status.size !== 2? ',': '';
                       writer.write(`${separator} ${Math.trunc(Math.random() * 100)}]`, ()=> {});
                   });
               }, X * 1000);
});