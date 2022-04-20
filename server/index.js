const path = require('path');
const express = require("express");
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const bodyParser = require('body-parser');
const { count } = require('console');


// ping('www.kindacode.com', 5); 

const PORT = process.env.PORT || 3003;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

let hostsCount = [];

///here add post handler to dothe ping and send the message back to the react.

app.post("/ping", async (req, res) => {
  try{
  let {stdout, stderr} = await exec(`ping -c ${ req.body.packeges} ${req.body.url}`);
  console.log("stdout: ",  stdout)
  console.log("stderr: ",  stderr)
  let host = hostsCount.find(c => c.url === req.body.url);
  if(!host){
      host = {id: hostsCount.length +1,
      url: req.body.url,
      count: 1
      }
      hostsCount.push(host);
  }
  else{
  host.count += 1;
}
 
  res.json({ pingRes: stdout.toString(), pingErr: stderr.toString()});
  }
  catch(err){
    res.json({ pingRes: "", pingErr: err.message});
  }
});

// Handle GET requests to /api route
app.get("/api", (req, res) => {
  // let mes = "Hello from server!";
  // res.json({ message: mes});
  var top5 = hostsCount.sort(function(a, b) { return a.count < b.count ? 1 : -1; })
                .slice(0, 5);

console.log(top5);
  res.send(top5);
});



// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

