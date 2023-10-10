const express     = require('express');
const mailer      = require('./src/mailer.js');
const bodyParser  = require('body-parser');
const myPuppet    = require('./src/puppet.js');
const app         = express();
const port        = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/scout', async(req, res) => {
  
  const body = await req.body;
  var ticket = false;
  while (!ticket)
    ticket = await myPuppet.setPuppeteer(body);
  res.status(200).json({
    status: "Success",
    message: "Puppet launched."
  })
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});