const express = require('express');
const firestore= require('../configs/firebase')
const cors = require('cors')
const requireJWTAuth = require("../configs/jwt")
const db = firestore.firestore();
const app = express()
const router = express.Router()

app.use(cors())
app.use(router)

router.post('/staff/room/',requireJWTAuth,(req, res) => {
      try {
            const statusDormitory = {
                  system:req.body.system,
                  all:req.body.all,
            };
            const docRef = db.doc('/dormitory/status')
            docRef.set(statusDormitory)
            res.status(200).send("change status");

      } catch (error) {
            console.log(error)
      }
});

router.get('/staff/room/:floorId/',requireJWTAuth,async (req, res) => {
      try {
            const floorId = req.params.floorId;
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result=[];

            roomRef.forEach(profile=>{

                  let profileList = {
                        profileId : '',      
                  }

                  profileList.profileId = profile.id
                  Object.assign(profileList, profile.data() )
                  result.push(profileList)
                
            })
            res.status(200).send(result);  

      } catch (error) {
            console.log(error)
      }
})  

router.post('/staff/room/:floorId/:roomId',requireJWTAuth,async (req, res) => {
      try {
            const statusRoom = {
                  roomStatus:req.body.roomStatus
            }

            const floorId = req.params.floorId;
            const roomId = req.params.roomId;
            const docRef = db.collection(`${floorId}`).doc(`${roomId}`)
            await docRef.update(statusRoom)
            res.status(200).send("change status");

      } catch (error) {
            console.log(error)
      }
});

router.delete('/staff/room/:floorId/:roomId/:studentId',requireJWTAuth, (req, res) => {
      try {
            const floorId = req.params.floorId;
            const roomId = req.params.roomId;
            const studentId = req.params.studentId;
            const FieldValue = firestore.firestore.FieldValue;
            const docRef = db.doc(`/${floorId}/${roomId}`)
            const value = `${studentId}`
            
            if (value == "student1") {
                  docRef.update({
                        student1:FieldValue.delete()
                  })
                  res.status(200).send("delete student1 success");
            }
            else if(value == "student2"){
                  docRef.update({
                        student2:FieldValue.delete()
                  })
                  res.status(200).send("delete student2 success");
            }
            else{
                  res.status(200).send("delete failed");
            }
      } 
      catch (error) {
            console.log(error)
      }
});

module.exports = router;