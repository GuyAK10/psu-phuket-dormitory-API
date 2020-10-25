const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()

router.post('/staff/room/',  (req, res) => {
      try {
            const statusDormitory = {
                  system: req.body.system,
                  all: req.body.all,
            };
            const docRef = db.doc('/dormitory/status')
            docRef.set(statusDormitory)
            res.status(200).send("change status");

      } catch (error) {
            res.sendStatus(400)
      }
});

router.get('/staff/room/:floorId/', async (req, res) => {
      try {
            const floorId = req.params.floorId;
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result = [];

            roomRef.forEach(profile => {

                  let profileList = {
                        profileId: '',
                  }

                  profileList.profileId = profile.id
                  Object.assign(profileList, profile.data())
                  result.push(profileList)

            })
            res.status(200).send(result);

      } catch (error) {
            res.sendStatus(400)
      }
})

router.post('/staff/room/:floorId/:roomId',  async (req, res) => {
      try {
            const statusRoom = {
                  roomStatus: req.body.roomStatus
            }

            const floorId = req.params.floorId;
            const roomId = req.params.roomId;
            const docRef = db.collection(`${floorId}`).doc(`${roomId}`)
            await docRef.update(statusRoom)
            res.status(200).send("change status");

      } catch (error) {
            res.sendStatus(400)
      }
});

router.delete('/staff/room/:floorId/:roomId/:orderId' , (req, res) => {
      try {
            const floorId = req.params.floorId;
            const roomId = req.params.roomId;
            const orderId = req.params.orderId;
            const FieldValue = firestore.firestore.FieldValue;
            const docRef = db.doc(`/${floorId}/${roomId}`)
            const value = `${orderId}`

            if (value == "student1") {
                  docRef.update({
                        student1: FieldValue.delete()
                  })
                  res.status(200).send("delete student1 success");
            }
            else if (value == "student2") {
                  docRef.update({
                        student2: FieldValue.delete()
                  })
                  res.status(200).send("delete student2 success");
            }
            else {
                  res.status(400).send("delete failed");
            }
      }
      catch (error) {
            res.sendStatus(400)
      }
});

module.exports = router;