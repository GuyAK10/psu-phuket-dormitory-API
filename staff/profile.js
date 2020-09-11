const express = require('express');
const firestore = require('../configs/firebase')
const cors = require('cors');
const requireJWTAuth = require("../configs/jwt")
const db = firestore.firestore()
const app = express()
const router = express.Router()

app.use(cors())
app.use(router)

router.get('/staff/profile/', requireJWTAuth , async (req, res) => {
    try {
        let studentList = []
        const docRef = db.collection('students')
        const profile = await docRef.get();
        profile.forEach(list => {
            let studentData = {
                studentId : '',
            }
            studentData.studentId = list.id
            Object.assign(studentData,list.data())
            studentList.push(studentData)
        })
        res.status(200).send(studentList);
    }
    catch (error) {
        console.log(error)
    }
});

module.exports = router;