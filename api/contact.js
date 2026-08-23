const POSTMARK_URL = 'https://api.postmarkapp.com/email';
const TO_ADDRESS = 'support@creditkawach.com';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  // Honeypot: bots fill this hidden field, humans never see it. Pretend success.
  if (body._honey) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) {
    console.error('POSTMARK_SERVER_TOKEN is not set');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const postmarkRes = await fetch(POSTMARK_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify({
        From: TO_ADDRESS,
        To: TO_ADDRESS,
        ReplyTo: email,
        Subject: `New message from ${name} via the Credit Kawach marketing site`,
        TextBody: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        MessageStream: 'outbound',
      }),
    });

    const data = await postmarkRes.json();

    if (!postmarkRes.ok) {
      console.error('Postmark rejected the request', postmarkRes.status, data);
      return res.status(502).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Postmark request failed', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};
