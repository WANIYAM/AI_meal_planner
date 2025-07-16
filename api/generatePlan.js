export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { age, weight, height, goal, preference } = req.body;

  // Simulate a meal plan based on input (replace this with real logic or API call)
  const sampleMeals = [
    `${preference} Breakfast: Poha with Chai`,
    `${preference} Lunch: Dal, Roti, and Salad`,
    `${preference} Dinner: Khichdi with Curd`
  ];

  res.status(200).json({
    message: 'Meal plan generated successfully!',
    data: {
      age,
      weight,
      height,
      goal,
      preference,
      plan: sampleMeals
    }
  });
}
