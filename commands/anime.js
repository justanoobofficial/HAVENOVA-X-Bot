const axios = require('axios');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';

function normalizeType(input) {
    const lower = (input || '').toLowerCase();
    if (lower === 'facepalm' || lower === 'face_palm') return 'face-palm';
    if (lower === 'quote' || lower === 'animu-quote' || lower === 'animuquote') return 'quote';
    return lower;
}

async function sendAnimu(sock, chatId, message, type) {
    try {
        const res = await axios.get(`${ANIMU_BASE}/${type}`);
        const data = res.data || {};

        // Check for valid image/gif
        if (data.link && data.link.startsWith('http')) {
            await sock.sendMessage(
                chatId,
                { image: { url: data.link }, caption: `⚡ HAVENOVA-X Anime: ${type}` },
                { quoted: message }
            );
            return;
        }

        // Fallback to quote
        if (data.quote) {
            await sock.sendMessage(
                chatId,
                { text: `💬 ${data.quote}` },
                { quoted: message }
            );
            return;
        }

        // Default fallback
        await sock.sendMessage(
            chatId,
            { text: '❌ Could not fetch animu. Try again later.' },
            { quoted: message }
        );

    } catch (err) {
        console.error('Error sending animu:', err);
        await sock.sendMessage(chatId, { text: '❌ Error fetching animu. Please try again later.' }, { quoted: message });
    }
}

async function animeCommand(sock, chatId, message, args) {
    // Optional: show typing status
    await sock.sendPresenceUpdate('composing', chatId);

    const subArg = args && args[0] ? args[0] : '';
    const sub = normalizeType(subArg);

    // Dynamic supported types from API
    let supported = [];
    try {
        const res = await axios.get(ANIMU_BASE);
        supported = res.data?.types?.map(t => t.replace('/animu/', '')) || [];
    } catch {
        supported = ['nom','poke','cry','kiss','pat','hug','wink','face-palm','quote'];
    }

    try {
        if (!sub) {
            await sock.sendMessage(chatId, { text: `Usage: .animu <type>\nSupported Types: ${supported.join(', ')}` }, { quoted: message });
            return;
        }

        if (!supported.includes(sub)) {
            await sock.sendMessage(chatId, { text: `❌ Unsupported type: ${sub}\nTry one of: ${supported.join(', ')}` }, { quoted: message });
            return;
        }

        await sendAnimu(sock, chatId, message, sub);

    } catch (err) {
        console.error('Error in animeCommand:', err);
        await sock.sendMessage(chatId, { text: '❌ An unexpected error occurred while fetching animu.' }, { quoted: message });
    }

    // Optional: mark as online again
    await sock.sendPresenceUpdate('available', chatId);
}

module.exports = { animeCommand };
