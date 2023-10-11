const nodemailer = require('nodemailer');
const utils      = require('./utils.js');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ti.censier@gmail.com',
        pass: 'mbnr vmat rcbw ratk '
    }
});

function send_email(receiver)
{
    const date = utils.get_date();
    var mailOptions = {
        from: 'ti.censier@gmail.com',
        to: receiver,
        subject: 'Ticket Saved !',
        text: 'Eyo, I found and saved a ticket in your cart at ' + date + '. You now have 10 minutes to get it bitch <3'
    }
    console.log("[/] Sending email..");
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
            console.log(error);
        else
            console.log('[+] Email sent: ' + info.response);
    });
}

function send_info(receiver, n_run, bot_id)
{
    const date = utils.get_date();
    var mailOptions = {
        from: 'ti.censier@gmail.com',
        to: receiver,
        subject: 'Bot: ' + bot_id + ' at run: ' + n_run,
        text: 'The Bot is still running. No ticket found so far.'
    }
    console.log("[/] Sending info email..");
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
            console.log(error);
        else
            console.log('[+] Email sent: ' + info.response);
    });
}

module.exports = {send_email, send_info};