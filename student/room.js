const express = require('express');
const firestore = require('../configs/firebase')

const router = express.Router()
const db = firestore.firestore()

bookInfomation = async (profileData, res) => {
    try {

        const floors = [
            "floorA",
            "floorB",
            " floorC",
            "floorD",
            "floorE",
            "floorF",
            "floorG",
            "floorH"
        ]

        const orderId = [
            "student1",
            "student2"
        ]

        let booked = false;

        for (var a in floors) {
            var b = floors[a];
            const roomRef = db.collection(b)
            for (c in orderId) {
                var d = orderId[c]
                const result = await roomRef.where(`${d}.id`, "==", profileData.profile.id).get()
                
                if (!result.empty) {
                    booked = true
                }
            }
        }
        return booked

    } catch (error) {
        res.sendStatus(400);
    }
}

const bookingRoom = (bookRoom, floorId, roomId, orderId, res) => {
    try {
        const bookRef = db.collection(floorId).doc(roomId)
        if (orderId == "student1") {
            bookRef.update({ student1: bookRoom })
            res.status(200).send("booking student1 success");
        }
        else if (orderId == "student2") {
            bookRef.update({ student2: bookRoom })
            res.status(200).send("booking student2 success");
        }
        else {
            res.status(400).send("booking failed");
        }
    } catch (error) {
        res.sendStatus(400);
    }

}

router.get('/student/room/:floorId/',  async (req, res) => {
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
            let result = [];

            roomRef.forEach(profile => {
                let profileList = {
                    profileId: '',
                }

                profileList.profileId = profile.id
                Object.assign(profileList, profile.data())
                result.push(profileList)

            })
            res.status(200).send({
                result,
                statusAllroom: checkAllroom
            });
        } else {
            res.status().send("ระบบยังไม่เปิดจอง");;
        }

    } catch (error) {
        res.sendStatus(400);
    }

});

router.post('/student/room/:floorId/:roomId/:studentId/:orderId', async (req, res) => {
    try {

        const floorId = req.params.floorId;
        const roomId = req.params.roomId;
        const studentId = req.params.studentId;
        const orderId = req.params.orderId;

        const profileRef = db.collection('students').doc(`${studentId}`);
        const studentRef = await profileRef.get()
        if (!studentRef.exists) {
            res.send("กรุณาบันทึกข้อมูลส่วนตัว")
        } else {
            const profileData = studentRef.data()
            const bookRoom = {
                id: profileData.profile.id,
                name: profileData.profile.name,
                surname: profileData.profile.surname,
                nickname: profileData.profile.nickname,
                tel: profileData.contact.tel
            }

            const isBooked = await bookInfomation(profileData, res) 
            if (isBooked) {
                res.status(200).send("จองแล้ว")
            } else if (!isBooked) {
                bookingRoom(bookRoom, floorId, roomId, orderId, res)
            }
            
        }

    } catch (error) {
        res.sendStatus(400);
    }

});

module.exports = router;