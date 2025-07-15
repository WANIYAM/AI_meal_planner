const functions = require("firebase-functions");
const axios = require("axios");

exports.generateMealPlan = functions.https.onCall(async (data, context) => {
  const prompt = `Generate a ${data.duration}-day Indian meal plan for a ${data.age} year old, ${data.weight}kg, ${data.height}cm person, goal: ${data.goal}, diet: ${data.diet}. Include recipes and grocery list.`;

  try {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return { plan: res.data.choices[0].message.content };
  } catch (err) {
    console.error("Meal plan generation failed:", err.message);
    throw new functions.https.HttpsError('internal', 'Failed to generate meal plan');
  }
});
