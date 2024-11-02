const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

// Replace with your bot token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Send me a TikTok or Instagram video URL and I will download it for you!');
});

// Function to download videos
async function downloadVideo(url) {
    try {
        if (url.includes('tiktok.com')) {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const videoUrl = $('video').attr('src'); // Extract video URL
            return videoUrl;
        } else if (url.includes('instagram.com')) {
            // Instagram extraction logic (placeholder)
            // This may require using an external library or service
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const videoUrl = $('video').attr('src'); // This is a placeholder, adjust according to actual HTML
            return videoUrl;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error downloading video:', error);
        return null;
    }
}

// Handle incoming messages
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    const videoUrl = await downloadVideo(url);

    if (videoUrl) {
        bot.sendMessage(chatId, 'Downloading video...');
        bot.sendVideo(chatId, videoUrl);
    } else {
        bot.sendMessage(chatId, "Sorry, I couldn't find a video at that URL.");
    }
});

console.log('Bot is running...');
