const child_process = require("child_process");

a = child_process.spawn('node', ['worker.js', '2.json', '1']);

/*a =child_process.exec(`node worker.js 2.json 1`, (err, stdout,stderr)=>
{
    console.log(err);
});
console.log(a.kill());*/
setInterval(()=>
            {
                a.kill();
            }, 5000);