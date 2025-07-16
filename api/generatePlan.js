export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { name, preference } = req.body;

  // You can put your meal planning logic here, or call another API

  return res.status(200).json({
    message: 'Plan generated successfully!',
    data: {
      name,
      preference,
      sampleMeals: ['Dal Chawal', 'Sabzi Roti', 'Chana Salad'],
    },
  });
}
