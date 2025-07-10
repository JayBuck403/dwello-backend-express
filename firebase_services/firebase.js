var admin = require("firebase-admin");

var serviceAccount = JSON.parse(
  require(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
