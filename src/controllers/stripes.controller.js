const stripe = require("stripe")(process.env.STRIPE_SK);
const User = require('../models/user.model')


const initiateStripeSession = async (req) => {

  const priceDataArray = {
      price_data: {
        currency: "eur",
        product_data: {
          name: req.body.title,
        },
        unit_amount: req.body.price * 100,
      },
      quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [priceDataArray],
    payment_intent_data: {
      metadata: { userId: req.body.userId, cart: JSON.stringify(req.body.cart) },
    },
    mode: "payment",
    success_url: `http://localhost:3000/payement/confirmation?amount=${req.body.price}&auction=${req.body.auction}`,
    cancel_url: `http://localhost:3000/cancel`,
  });
  return session;
};


exports.createSession = async function (req, res) {
  try {

    const session = await initiateStripeSession(req);
    res.status(200).json({
      id: session.id,
      price: session.amout_total,
      currency: session.currency,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.createIntent = async function (req, res) {
  try {
    User
    .findById(req.params.id)
    .then(async user => {
      const setupIntent = await stripe.setupIntents.create({
        customer: user.id_customer,
        payment_method_types: ['card'],
      });
      res.send({client_secret : setupIntent.client_secret})
    }).catch(err => {
        res.status(500).send({
            success: false,
            message:"L'utilisateur est introuvable",
            errMessage: err.message
        })
    })
    
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getCard = async function (req, res) {
  

}