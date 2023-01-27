const stripe = Stripe(
  'pk_test_51KbjmSG3OwqqqzPdKJoCLH9MsttVfu1qpKiuqpinyKb40nhKb6lEjIetd2TPr9VY7eW0X2rqCWsMBosOrtbqITST00mHJU45K1'
);

// Les articles que le client veut acheter
const purchase = [
  { id: '1', name: 't-shirt', price: 1999 },
  { id: '2', name: 'chaussures', price: 4999 }
];
const total_amount = 10998;
const shipping_fee = 1099;

let elements;

initialize();
checkStatus();

document
  .querySelector('#payment-form')
  .addEventListener('submit', handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch('/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchase, total_amount, shipping_fee })
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: 'stripe'
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElementOptions = {
    layout: 'tabs'
  };

  const paymentElement = elements.create('payment', paymentElementOptions);
  paymentElement.mount('#payment-element');
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: 'https://dashboard.stripe.com/test/payments/'
    }
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === 'card_error' || error.type === 'validation_error') {
    showMessage(error.message);
  } else {
    showMessage("Une erreur s'est produite.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    'payment_intent_client_secret'
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case 'succeeded':
      showMessage('Paiement réussi !');
      break;
    case 'processing':
      showMessage('Votre paiement est en cours.');
      break;
    case 'requires_payment_method':
      showMessage(
        'Votre paiement na pas réussi, veuillez réessayer plus tard.'
      );
      break;
    default:
      showMessage("Une erreur s'est produite.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector('#payment-message');

  messageContainer.classList.remove('hidden');
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add('hidden');
    messageText.textContent = '';
  }, 4000);
}

// Affiche un spinner lors de la soumission du paiement
function setLoading(isLoading) {
  if (isLoading) {
    // Désactive le bouton et affiche un spinner
    document.querySelector('#submit').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('#submit').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
}
