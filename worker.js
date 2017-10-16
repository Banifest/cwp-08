fs =

let jsonFile = process.argv[2];
let X = process.argv[3];

writer =  fs.createWriteStream(jsonFile, {start: -1});




while (true)
{
    setTimeout(()=>
               {

                   fs.appendFile(jsonFile, Number(Math.random()*100))
               }, X)
}