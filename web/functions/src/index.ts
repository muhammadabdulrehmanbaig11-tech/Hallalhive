import * as functions from "firebase-functions";

// 🐝 Test Cloud Function — just returns a string
export const helloWorld = functions.https.onRequest((req, res) => {
  res.status(200).send("Hello from HalalHive Functions!");
});
