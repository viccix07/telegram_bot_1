const CONFIRMATION = {
  EN: 'Thank you! Your information has been logged. Our specialist will call you shortly to confirm your booking.',
  RU: 'Спасибо! Ваши данные записаны. Наш специалист свяжется с вами в ближайшее время для подтверждения записи.',
  UZ: "Rahmat! Ma'lumotlaringiz saqlandi. Mutaxassisimiz tez orada bandlikni tasdiqlash uchun aloqaga chiqadi.",
};

const WELCOME =
  "Assalomu alaykum! Qaysi xizmat kerak? / Здравствуйте! Какая услуга вас интересует? / Hello! Which service are you interested in?";

const UNSUPPORTED =
  "Iltimos, matn yuboring. / Пожалуйста, отправьте текстовое сообщение. / Please send a text message.";

const TECH_ERROR =
  "Uzr, texnik nosozlik. Birozdan so'ng qayta urinib ko'ring. / Извините, технический сбой. Попробуйте чуть позже. / Sorry, a technical issue occurred. Please try again shortly.";

function normalizeLang(l) {
  const v = String(l || '').trim().toUpperCase();
  return ['UZ', 'RU', 'EN'].includes(v) ? v : 'EN';
}

function confirmationFor(lang) {
  return CONFIRMATION[normalizeLang(lang)];
}

function managerAlert(lead) {
  return [
    '🚨 NEW QUALIFIED LEAD RECEIVED!',
    '',
    `👤 Name: ${lead.client_name}`,
    `📞 Phone: ${lead.phone_number}`,
    `🌐 Language: ${lead.language}`,
    `🛠 Service: ${lead.service_requested}`,
    `📅 Preferred Time: ${lead.preferred_time}`,
    '',
    '⚡ Action: Call client within 5 minutes to confirm booking.',
  ].join('\n');
}

module.exports = { WELCOME, UNSUPPORTED, TECH_ERROR, normalizeLang, confirmationFor, managerAlert };
