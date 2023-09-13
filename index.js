const express     = require('express');
const mailer      = require('./src/mailer.js');
const bodyParser  = require('body-parser');
const myPuppet    = require('./src/puppet.js');
const app         = express();
const port        = 3000;

app.post('/scout', async(req, res) => {
  
  await myPuppet.setPuppeteer();
  res.status(200).json({
    status: "Success",
    message: "Puppet launched."
  })
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});