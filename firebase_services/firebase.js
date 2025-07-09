var admin = require("firebase-admin");

// var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(require('../secrets/dwello-homes-firebase-adminsdk-fbsvc-166b167823.json')),
});

module.exports = admin;
