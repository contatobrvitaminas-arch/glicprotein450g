export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pixelId = process.env.META_PIXEL_ID || '3723947677911523';
  const accessToken = process.env.META_CAPI_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!accessToken) {
    return res.status(500).json({ error: 'META_CAPI_TOKEN is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const eventName = body.eventName || 'Lead';
    const eventId = body.eventId || `${eventName}_${Date.now()}`;
    const eventSourceUrl = body.eventSourceUrl || req.headers.referer || 'https://glicproteinvd2.vercel.app/';
    const customData = body.customData || {};

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : String(forwardedFor || '').split(',')[0].trim();

    const event = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: {
        client_user_agent: req.headers['user-agent'] || undefined,
        client_ip_address: clientIp || undefined,
        fbp: body.fbp || undefined,
        fbc: body.fbc || undefined
      },
      custom_data: customData
    };

    const payload = {
      data: [event]
    };

    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Meta CAPI error', details: result });
    }

    return res.status(200).json({ ok: true, result });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected error', message: error.message });
  }
}
