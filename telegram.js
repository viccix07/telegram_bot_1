const cfg = require('./config');
const BASE = `https://api.telegram.org/bot${cfg.telegramToken}`;

async function call(method, payload) {
  const res = await fetch(`${BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram ${method} failed: ${res.status} ${JSON.stringify(data)}`);
  }
  return data.result;
}

// Plain text on purpose (no parse_mode) so user-supplied names can't break formatting.
const sendMessage = (chatId, text) => call('sendMessage', { chat_id: chatId, text });
const sendTyping = (chatId) => call('sendChatAction', { chat_id: chatId, action: 'typing' }).catch(() => {});

async function registerWebhook() {
  if (!cfg.publicUrl) {
    console.warn('PUBLIC_URL not set; skipping automatic setWebhook.');
    return;
  }
  const payload = {
    url: `${cfg.publicUrl}/webhook`,
    allowed_updates: ['message'],
    drop_pending_updates: true,
  };
  if (cfg.webhookSecret) payload.secret_token = cfg.webhookSecret;
  await call('setWebhook', payload);
  console.log(`Webhook set -> ${payload.url}`);
}

module.exports = { sendMessage, sendTyping, registerWebhook };
