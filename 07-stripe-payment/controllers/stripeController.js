// Dans la doc Stripe,
// paiement -> accepter les paiements en ligne -> tunnel de paiement personnalisé
const stripe = require('stripe')(process.env.STRIPE_KEY);

const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const calculateOrderAmount = () => {
    // Normalement on doit récupérer l'id de chaque item dans "purchase" pour chercher leur valeur dans la BDD car le prix pourrait être modifié sur le front (on ne plaisante pas avec l'argent)
    return total_amount + shipping_fee;
  };
  // Crée une intention de paiment avec le montant de la commande et la devise
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true
    }
  });

  // console.log(paymentIntent.client_secret);

  res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;
