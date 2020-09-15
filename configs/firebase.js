const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://psu-phuket-dormitory.firebaseio.com',
  storageBucket: "gs://psu-phuket-dormitory.appspot.com"
});

module.exports = admin;
