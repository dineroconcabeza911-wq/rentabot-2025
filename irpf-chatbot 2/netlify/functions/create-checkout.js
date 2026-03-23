const PACKS = {
  basic:    { questions: 25,  amount: 99,  label: 'Pack Básico — 25 preguntas' },
  complete: { questions: 100, amount: 299, label: 'Pack Completo — 100 preguntas' },
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { pack, successUrl, cancelUrl } = await req.json();
    const selected = PACKS[pack];

    if (!selected) {
      return new Response(JSON.stringify({ error: 'Pack no válido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Create Stripe Checkout session via API
    const params = new URLSearchParams({
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][product_data][name]': selected.label,
      'line_items[0][price_data][product_data][description]': `${selected.questions} preguntas para RentaBot 2025`,
      'line_items[0][price_data][unit_amount]': selected.amount,
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': `${successUrl}?pack=${pack}&questions=${selected.questions}&session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': cancelUrl,
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Stripe error:', err);
      return new Response(JSON.stringify({ error: err.error?.message || 'Error de Stripe' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await response.json();
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/create-checkout'
};
