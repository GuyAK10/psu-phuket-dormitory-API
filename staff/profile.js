const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()
const bucket = firestore.storage().bucket()

router.get('/staff/profile/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId
    const docRef = db.collection('students').doc(`${studentId}`);
    const profile = await docRef.get();
    res.status(200).send(profile.data());
  }
  catch (error) {
    res.sendStatus(400);
  }
});

router.get('/staff/profile/picture/:studentId' ,(req, res) => {
    try {
  
      const file = bucket.file(`profile/${req.params.studentId}`);
      file.download().then(downloadResponse => {
        res.status(200).send(downloadResponse[0]);
      });
  
    } catch (error) {
      res.sendStatus(400);
    }
  });

module.exports = router;