const config = require('../configs/mail.config');
const nodemailer = require('nodemailer')
const handlebars = require('handlebars');
const fs = require('fs');


exports.sendMail = (req, res) => {
    readHTMLFile(`${__dirname}/../templates/mail_contact.html`, (err, html) => {
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: config.username,
                pass: config.password
            }
        });
        const template = handlebars.compile(html)
        const replacements = {
            name: req.body.name,
            mail: req.body.mail,
            phone: req.body.phone,
            message: req.body.message,
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
            from: 'nicolas.marinm@outlook.fr',
            to: "nicolas.marinm@outlook.fr",
            subject: 'Contact request',
            html: htmlToSend
        };
         transporter.sendMail(mailOptions, (err, info) => {
            if(!err){
                readHTMLFile(`${__dirname}/../templates/mail_confirm_contact.html`, (err, html) => {
                    const transporter = nodemailer.createTransport({
                        service: 'outlook',
                        auth: {
                            user: config.username,
                            pass: config.password
                        }
                    });
                    const template = handlebars.compile(html)
                    const replacements = {
                        name: req.body.name,
                        message: req.body.message,
                    };
                    const htmlToSend = template(replacements);
                    const mailOptions = {
                        from: 'nicolas.marinm@outlook.fr',
                        to: req.body.mail,
                        subject: 'Message send confirmation',
                        html: htmlToSend
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        if(!err){
                            res.send({
                                success:true,
                                message: "The message was transmitted successfully"
                            })
                        }else{
                            res.status(500).send({
                                success:false,
                                errMessage: err,
                                message: "The email you provided is incorrect"
                            })
                        }
                    })

                })
            }else{
                res.status(500).send({
                    success:false,
                    errMessage: err,
                    message: "There was a problem sending the message, please contact an administrator or try again later"
                })
            }
        })

    })
}
const readHTMLFile = (path, callback) => {
    fs.readFile(path, {encoding: 'utf-8'}, (err, html) =>  {
        if (err) {
           callback(err); 
           throw err;
        }
        else {
            callback(null, html);
        }
    });
};