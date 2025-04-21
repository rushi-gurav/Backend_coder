require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const reactCode = `
function ContactForm() {
  return (
    <form>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <textarea name="message" placeholder="Message"></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}
`;

const prompt = `
You are a backend engineer. Generate the following:
1. MongoDB schema
2. Express.js API route to handle POST /submit
3. Mongoose model

Input React code:
${reactCode}

Format the output like:

---schema.js---
<code>

---route.js---
<code>

---model.js---
<code>
`;

async function callOpenRouter() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-72b-instruct:free",
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
    console.log("\n✅ AI Response Received\n");

    // Extract files from AI response
    const matches = aiResponse.matchAll(/---(.*?)---\n([\s\S]*?)(?=---|$)/g);
    for (const match of matches) {
      const fileName = match[1].trim();
      let fileContent = match[2].trim();

      // Remove ```javascript or ``` from AI output
      fileContent = fileContent.replace(/```(javascript)?/g, "").trim();

      fs.writeFileSync(fileName, fileContent);
      console.log(`💾 Saved: ${fileName}`);
    }

    console.log("\n🎉 All files saved!\n");

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

callOpenRouter();
