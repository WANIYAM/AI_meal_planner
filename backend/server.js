import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

// 🔥 Route: Generate AI-based Meal Plan
app.post('/generate-meal-plan', async (req, res) => {
  const {
    age,
    weight,
    height,
    gender,
    activity,
    goal,
    restriction,
    duration
  } = req.body;

  const userProfile = `
User Profile:
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Gender: ${gender}
- Activity Level: ${activity}
- Dietary Goal: ${goal}
- Restrictions: ${restriction}
- Duration: ${duration} days
`;

  const prompt = `
You are a meal planning assistant. Return ONLY a valid JSON array (no explanation, no markdown). Generate a ${duration}-day Indian meal plan for a user with the following details:

- Age: ${age}
- Weight: ${weight}kg
- Height: ${height}cm
- Gender: ${gender}
- Activity Level: ${activity}
- Goal: ${goal}
- Dietary Restriction: ${restriction}

Each day should include 3 meals: **Breakfast**, **Lunch**, and **Dinner** with realistic calorie counts.

Format:
[
  {
    "day": "Day 1",
    "breakfast": {
      "meal": "Poha",
      "calories": 350,
      "ingredients": ["poha", "onion", "mustard seeds"]
    },
    "lunch": {
      "meal": "Dal Chawal",
      "calories": 600,
      "ingredients": ["rice", "dal", "turmeric", "cumin"]
    },
    "dinner": {
      "meal": "Palak Paneer with Roti",
      "calories": 500,
      "ingredients": ["palak", "paneer", "wheat flour"]
    }
  },
  ...
]

Do not include any explanation. Only return a valid JSON array.
`;


  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // ✅ Use updated supported model
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    console.log('🧠 Raw Groq response:\n', content);

    let plan;

    try {
      plan = JSON.parse(content);
      if (!Array.isArray(plan)) throw new Error("Not an array");
    } catch {
      const match = content?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (match) {
        try {
          plan = JSON.parse(match[0]);
        } catch (e) {
          console.error("❌ JSON extraction failed:", e.message);
          return res.status(500).json({ error: "Invalid plan format from Groq" });
        }
      } else {
        console.error("❌ No JSON array found in Groq response.");
        return res.status(500).json({ error: "Invalid plan format from Groq" });
      }
    }

    res.json({ plan });

  } catch (err) {
    console.error('❌ Error generating meal plan:', err.message);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});


// 📸 Route: Get Meal Image from Pexels
app.post('/get-meal-image', async (req, res) => {
  const { meal } = req.body;

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(meal)} indian food&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    const data = await response.json();
    const image = data.photos[0]?.src?.medium || '';

    res.json({ image });

  } catch (err) {
    console.error('❌ Error fetching image:', err.message);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

// 🚀 Start Server
app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
