const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `*⚡ HAVENOVA-X is Online!*\n\n` +
                         `*Version:* ${settings.version || '1.0.0'}\n` +
                         `*Status:* Active ✅\n` +
                         `*Mode:* Public 🌐\n\n` +
                         `*🌟 Features:*\n` +
                         `• Group Management 🛡️\n` +
                         `• Antilink Protection 🚫\n` +
                         `• Fun Commands 🎮\n` +
                         `• Custom Commands 💡\n\n` +
                         `Type *.menu* to see all commands!`;

        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'HAVENOVA-X',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: '⚡ HAVENOVA-X is running smoothly!' }, { quoted: message });
    }
}

module.exports = aliveCommand;
