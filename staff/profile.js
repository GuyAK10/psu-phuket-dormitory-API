const express = require('express');
const cors = require('cors');
const requireJWTAuth = require("../configs/jwt")
const firestore = require('../configs/firebase')
// const storage = require('../configs/storage')

const app = express()
const router = express.Router()
const db = firestore.firestore()
//const bocket = storage.storage().bucket()


app.use(cors())
app.use(router)

router.get('/staff/profile/', requireJWTAuth, async (req, res) => {
    try {
        let studentList = []
        const docRef = db.collection('students')
        const profile = await docRef.get();
        profile.forEach(list => {
            let studentData = {
                studentId: '',
            }
            studentData.studentId = list.id
            Object.assign(studentData, list.data())
            studentList.push(studentData)
        })
        res.status(200).send(studentList);
    }
    catch (error) {
        console.log(error)
    }
});

module.exports = router;