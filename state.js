// In-memory conversation store with TTL + per-chat serialization.
// Swap Map for Redis/SQLite if you run >1 instance or need restart persistence.
const MAX_MESSAGES = 30;
const TTL_MS = 24 * 60 * 60 * 1000;

const sessions = new Map(); // chat_id -> { messages: [], updatedAt }
const queues = new Map();   // chat_id -> Promise (serial processing per user)

function get(chatId) {
  let s = sessions.get(chatId);
  if (!s) {
    s = { messages: [], updatedAt: Date.now() };
    sessions.set(chatId, s);
  }
  return s;
}

function push(chatId, role, content) {
  const s = get(chatId);
  s.messages.push({ role, content });
  if (s.messages.length > MAX_MESSAGES) s.messages.splice(0, s.messages.length - MAX_MESSAGES);
  s.updatedAt = Date.now();
}

function history(chatId) {
  return get(chatId).messages.slice();
}

function reset(chatId) {
  sessions.delete(chatId);
}

// Guarantees messages from the same user are handled one at a time, in order.
function enqueue(chatId, task) {
  const prev = queues.get(chatId) || Promise.resolve();
  const next = prev.catch(() => {}).then(task);
  queues.set(chatId, next);
  next.finally(() => {
    if (queues.get(chatId) === next) queues.delete(chatId);
  });
  return next;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) if (now - s.updatedAt > TTL_MS) sessions.delete(id);
}, 60 * 60 * 1000).unref();

module.exports = { push, history, reset, enqueue };
