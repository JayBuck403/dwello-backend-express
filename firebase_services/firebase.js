var admin = require("firebase-admin");

// var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(require('./secrets/firebase-service-account.json')),
});

module.exports = admin;
