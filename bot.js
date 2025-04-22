require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const tempDir = path.join(__dirname, "temp");
const outputDir = path.join(__dirname, "outputs");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

let userBackendChoice = {};
let userHistory = {};
let userFileBuffer = {};

let userGenerations = {};
let userReferralUsed = {};

// 🔥 Owner usernames (case-insensitive)
const botOwners = ["@rushi143gurav", "@Rishigurav143"];

const backendMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'MongoDB', callback_data: 'mongodb' },
        { text: 'PostgreSQL', callback_data: 'postgresql' }
      ],
      [
        { text: 'SQL', callback_data: 'sql' },
        { text: 'Java (Spring)', callback_data: 'java' }
      ],
      [
        { text: 'Show Menu Again', callback_data: 'show_menu' }
      ]
    ]
  }
};

bot.on("new_chat_members", (msg) => {
  bot.sendMessage(msg.chat.id, `👋 Hello and welcome to Rcoder! Share your frontend code (React, HTML, etc.) as a message or upload files (.jsx, .html, etc.) to generate a backend.`);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userFileBuffer[chatId] = [];
  userGenerations[chatId] = userGenerations[chatId] ?? 0;
  bot.sendMessage(chatId, "👋 Welcome to Rcoder! Choose your backend type:", backendMenu);
});

bot.onText(/\/menu/, (msg) => {
  bot.sendMessage(msg.chat.id, "📜 Choose your backend type again:", backendMenu);
});

bot.onText(/\/refer (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : "";
  const code = match[1].trim().toUpperCase();

  // 🔥 OWNER CHECK for /refer
  if (botOwners.includes(username)) {
    return bot.sendMessage(chatId, "👑Mr.Rushikesh You are the owner of this bot. You have unlimited tokens!");
  }

  if (userReferralUsed[chatId]) {
    return bot.sendMessage(chatId, "⚠️ You’ve already used a referral code.");
  }

  if (code === "DMCE") {
    userGenerations[chatId] = (userGenerations[chatId] || 0) - 10;
    userReferralUsed[chatId] = true;
    return bot.sendMessage(chatId, "🎉 Referral code applied! You got 10 extra generations.");
  } else {
    return bot.sendMessage(chatId, "❌ Invalid referral code.");
  }
});

bot.onText(/\/generate/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : "";

  if (!userBackendChoice[chatId] || !userFileBuffer[chatId]?.length) {
    return bot.sendMessage(chatId, "⚠️ Please upload at least one frontend file and select a backend type first.");
  }

  // 🔥 OWNER CHECK for unlimited generations
  const isOwner = botOwners.includes(username);

  userGenerations[chatId] = userGenerations[chatId] ?? 0;
  if (!isOwner) {
    if (userGenerations[chatId] >= 5 && !userReferralUsed[chatId]) {
      return bot.sendMessage(chatId, "🛑 You’ve used your 5 free generations. Enter /refer DMCE to get 10 more, or subscribe for unlimited access.");
    }

    if (userReferralUsed[chatId] && userGenerations[chatId] >= 15) {
      return bot.sendMessage(chatId, "🛑 You’ve used all your free + referral generations. Please subscribe for unlimited backend generation.");
    }
  }

  const combinedCode = userFileBuffer[chatId].join("\n\n// New File\n\n");
  userFileBuffer[chatId] = [];

  if (!isOwner) userGenerations[chatId] += 1;

  await handleCode(chatId, combinedCode);
});

bot.onText(/\/history/, (msg) => {
  const chatId = msg.chat.id;
  if (userHistory[chatId]?.length) {
    const entries = userHistory[chatId].map((entry, i) => `${i + 1}. ${entry}`).join("\n");
    bot.sendMessage(chatId, "📂 Your past backend generations:\n" + entries);
  } else {
    bot.sendMessage(chatId, "⚠️ You haven't generated any backend yet.");
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const backend = query.data;

  if (backend === "show_menu") {
    return bot.sendMessage(chatId, "📜 Choose your backend type again:", backendMenu);
  }

  userBackendChoice[chatId] = backend;
  userFileBuffer[chatId] = [];
  bot.sendMessage(chatId, `✅ You selected *${backend.toUpperCase()}*. Now send your frontend code (as a message or upload .html/.jsx files).`, { parse_mode: "Markdown" });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text && !msg.text.startsWith("/")) {
    if (!userBackendChoice[chatId]) {
      return bot.sendMessage(chatId, "❗ Please choose your backend first using /start or /menu.");
    }

    if (msg.text.includes("<") && msg.text.includes(">")) {
      userFileBuffer[chatId] = userFileBuffer[chatId] || [];
      userFileBuffer[chatId].push(msg.text);
      return bot.sendMessage(chatId, "📩 File received. Would you like to upload more files? If not, type /generate to proceed.");
    } else {
      bot.sendMessage(chatId, "⚠️ Please send valid frontend code or upload a file.");
    }
  }
});

bot.on("document", async (msg) => {
  const chatId = msg.chat.id;

  if (!userBackendChoice[chatId]) {
    return bot.sendMessage(chatId, "❗ Please choose your backend first using /start or /menu.");
  }

  const fileId = msg.document.file_id;
  const fileName = msg.document.file_name;

  try {
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const filePath = path.join(tempDir, fileName);

    const response = await axios.get(fileUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      const content = fs.readFileSync(filePath, "utf-8");
      userFileBuffer[chatId] = userFileBuffer[chatId] || [];
      userFileBuffer[chatId].push(content);
      bot.sendMessage(chatId, `📁 ${fileName} received. Would you like to upload more files? If not, type /generate to continue.`);
    });

    writer.on("error", (err) => {
      console.error(err);
      bot.sendMessage(chatId, "❌ Failed to download the file.");
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error retrieving the uploaded file.");
  }
});

async function handleCode(chatId, code) {
  const backend = userBackendChoice[chatId];
  const prompt = getPromptForBackend(backend) + `\n\nFrontend code:\n\`\`\`\n${code}\n\`\`\``;

  bot.sendMessage(chatId, "🧠 Generating your backend project...");

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen-2.5-coder-32b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost",
          "X-Title": "AI Backend Generator",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    const matches = aiResponse.matchAll(/---\s*(.*?)\s*---\s*([\s\S]*?)(?=---|$)/g);
    const savedFiles = [];
    
    for (const match of matches) {
      const fileName = match[1].trim();
      let content = match[2];
    
      // Remove all markdown code fences like ```js or ```
      content = content.replace(/```[a-z]*\n?|```/gi, "");
    
      // Remove lines like "This file contains..." or similar
      content = content
        .split('\n')
        .filter(line => !/^(\s*this\s+file\s+contains|\s*this\s+is\s+code\s+for)/i.test(line.trim()))
        .join('\n');
    
      // Final trim
      content = content.trim();
    
      const filePath = path.join(outputDir, fileName);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      savedFiles.push(filePath);
    }
    
    if (savedFiles.length === 0) {
      return bot.sendMessage(chatId, "⚠️ No valid files were generated.");
    }
    
    for (const file of savedFiles) {
      await bot.sendDocument(chatId, file);
    }
    
    bot.sendMessage(chatId, "✅ Your backend project is ready!");
    

    userHistory[chatId] = userHistory[chatId] || [];
    userHistory[chatId].push(`${backend} - ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    bot.sendMessage(chatId, "❌ Failed to generate backend. Please try again later.");
  }
}

function getPromptForBackend(backend) {
  switch (backend) {
    case "mongodb":
      return `Generate the backend code with the following:
1. MongoDB schema
2. Express.js API for POST /submit
3. Mongoose model
4. server.js
5. db.js
Output format: 
--- filename.js ---
<code here>
--- filename2.js ---
<code here>`;
    case "postgresql":
    case "sql":
      return `Generate the backend code for PostgreSQL with:
1. SQL schema
2. Express.js API for POST /submit
3. Sequelize model
4. server.js
5. db.js
Output format: 
--- filename.js ---
<code here>
--- filename2.js ---
<code here>`;
    case "java":
      return `Generate Spring Boot backend:
1. Spring Boot project setup
2. MySQL schema
3. JPA model
4. Controller for POST /submit
Output format: 
--- filename.java ---
<code here>`;
    default:
      return "";
  }
}

// Dummy Express server to keep Render alive
if (require.main === module) {
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.send('✅ Your Telegram Bot is alive on Render!');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Dummy server running on port ${PORT} to keep bot alive`);
  });
}
