const cron = require('node-cron');
const Auction = require('../models/auction.model')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars');
const fs = require('fs');
const stripe = require('stripe')('sk_test_51KiQcfFqBxp3dUF0Bj0utMSoCVbahNuZv039AJ2SdbGDdJUiBkcVfKKt1GXMdK3y7002cqQLRh4WKjehfGpKoxUI00TZM7XzGV')

exports.Task = cron.schedule('* * * * *', () =>  {
    
    readHTMLFile(`${__dirname}/../templates/mail_auction.html`, (err, html) => {
            const date = new Date()
            Auction.find({endDate:{$lt: date}, status: { $ne: "ended" } })
            .populate({
                path:"lastBid",
                populate:{
                    path:"user",
                    model:"User"
                }
            })
            .then(data => {   
                data.forEach(async element => {
                    if(element.lastBid.mount){
                        const resPayementIntent = await  paymentIntentCron(element.lastBid.user.id_customer)
                        if(resPayementIntent){
                            const transporter = nodemailer.createTransport({
                                service: 'outlook',
                                auth: {
                                    user: "nicolas.marinm@outlook.fr",
                                    pass: "Solyluna1967"
                                }
                            });
                            const template = handlebars.compile(html)
                            const replacements = {
                                username: element.lastBid.user.lastname,
                                product:{
                                    title:element.product.title,
                                    description:element.product.description,
                                    initialPrice:element.product.initialPrice.toFixed(2),
                                    image:element.product.image,
                                    lastBid: element.lastBid.mount.toFixed(2)
                                }
                            };
                            const htmlToSend = template(replacements);
                            const mailOptions = {
                                from: 'nicolas.marinm@outlook.fr',
                                to: element.lastBid.user.email,
                                subject: 'End of auction - ' + element.product.title,
                                html: htmlToSend
                            };
                            transporter.sendMail(mailOptions, (err, info) => {
                                    if(!err){
                                        console.log(info)
                                    }
                                })
                        }else{
                            const replacements = {
                                username: element.lastBid.user.lastname,
                                product:{
                                    title:element.product.title,
                                    description:element.product.description,
                                    initialPrice:element.product.initialPrice.toFixed(2),
                                    image:element.product.image,
                                    lastBid: element.lastBid.mount.toFixed(2)
                                }
                            };
                            const htmlToSend = template(replacements);
                            const mailOptions = {
                                from: 'nicolas.marinm@outlook.fr',
                                to: element.lastBid.user.email,
                                subject: 'Problème payement - ' + element.product.title,
                                html: htmlToSend
                            };
                            transporter.sendMail(mailOptions, (err, info) => {
                                    if(!err){
                                        console.log(info)
                                    }
                                })
                        }
                       
                    }else{
                        body = {
                            status: "ended"
                        }
                        Auction.findByIdAndUpdate(element._id, body )
                        .then(data => {
                            console.log("Auction " + data._id + " ended")
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                });

            })
    })
}, {
  scheduled: false
});

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

const paymentIntentCron = async (id_customer) => {
    try{
        const paymentMethods = await stripe.paymentMethods.list({
          customer: id_customer,
          type: 'card',
        });
        // return;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 1099,
          currency: 'eur',
          customer: id_customer,
          payment_method: paymentMethods.data[0].id,
          off_session: true,
          confirm: true,
        });
        if(paymentIntent.status == 'succeeded'){
            return true
            
        }else{
            return false
        }
      }catch(err){
        console.log('Error code is: ', err.code);
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
        console.log('PI retrieved: ', paymentIntentRetrieved.id);
      }
}

