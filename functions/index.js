const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

exports.generatePlan = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { name, preference } = req.body;
    res.status(200).json({
      message: "Plan generated successfully!",
      name,
      preference,
    });
  });
});
