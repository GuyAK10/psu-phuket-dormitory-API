const express = require('express');
const firestore = require('../configs/firebase')
const cors = require('cors');
const requireJWTAuth = require("../configs/jwt")
const db = firestore.firestore()
const app = express()
const router = express.Router()

app.use(cors())
app.use(router)

router.get('/student/room/:floorId/', requireJWTAuth ,async (req, res) => {
    try {
        const floorId = req.params.floorId;
        const checkRef = db.collection('dormitory').doc('status');
        const checkStatus = await checkRef.get()
        const check = Object.values(checkStatus.data())
        const checkDormitory = check[0]
        const checkAllroom = check[1]
        if (checkDormitory) {
            const docRef = db.collection(`${floorId}`);
            const roomRef = await docRef.get()
            let result=[];

            roomRef.forEach(profile=>{
                let profileList={
                    profileId : '',     
                }

                profileList.profileId = profile.id
                Object.assign(profileList, profile.data())
                result.push(profileList)
        
            })
            res.status(200).send({
                result,
                statusAllroom:checkAllroom
            });
        } else {
            res.send("ระบบยังไม่เปิดจอง");;
        }
        
    } catch (error) {
        console.log(error)
    }
    
});


router.post('/student/room/:floorId/:roomId/:studentId',requireJWTAuth, (req, res) => {
    try {
        let firstData = {
            student1: {
                id: "",
                name: "",
                surname: "",
                nickname:"",
                tel:""
            }
        }

        let secondData = {
            student2:{
                id: "",
                name: "",
                surname: "",
                nickname:"",
                tel:""
            }
        }

        const floorId = req.params.floorId;
        const roomId = req.params.roomId;
        const studentId = req.params.studentId;

        const docRef = db.doc(`/${floorId}/${roomId}`)
        if(studentId == "student1"){
            firstData.student1.id = req.body.id
            firstData.student1.name = req.body.name
            firstData.student1.surname = req.body.surname
            firstData.student1.nickname = req.body.nickname
            firstData.student1.tel = req.body.tel

            docRef.update(firstData)
            res.status(200).send("booking student1 success");
        }
        else if(studentId == "student2"){
            secondData.student2.id = req.body.id
            secondData.student2.name = req.body.name
            secondData.student2.surname = req.body.surname
            secondData.student2.nickname = req.body.nickname
            secondData.student2.tel = req.body.tel

            docRef.update(secondData)
            res.status(200).send("booking student2 success");
        }
        else{
            res.status(200).send("booking failed");
        }
    } catch (error) {
        console.log(error)
    }

});

module.exports = router;