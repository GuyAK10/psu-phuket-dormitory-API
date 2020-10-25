const express = require('express');
const firestore = require('../configs/firebase')
const multer = require('multer');

const router = express.Router()
const db = firestore.firestore()
const bucket = firestore.storage().bucket()
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/student/profile/upload/:studentId' , uploader.single('img'), (req, res) => {
  try {
    const id = req.params.studentId
    const folder = 'profile'
    const fileName = `${id}`
    const fileUpload = bucket.file(`${folder}/` + fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    blobStream.on('error', (err) => {
      res.status(405).json(err);
    });

    blobStream.on('finish', () => {
      res.status(200).send('Upload complete!');
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.sendStatus(400);
  }

});

router.get('/student/profile/picture/studentId' , (req, res) => {
  try {

    const file = bucket.file(`profile/${req.params.studentId}`);
    file.download().then(downloadResponse => {
      res.status(200).send(downloadResponse[0]);
    });

  } catch (error) {
    res.sendStatus(400);
  }
});

router.get('/student/profile/:studentId', async (req, res) => {
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

router.post('/student/profile/:studentId',  (req, res) => {
  try {
    const user = {
      profile: {
        id: req.body.profile.id,
        name: req.body.profile.name,
        surname: req.body.profile.surname,
        nickname: req.body.profile.nickname,
        religion: req.body.profile.religion,
        race: req.body.profile.race,
        nationality: req.body.profile.nationality,
        birthday: req.body.profile.birthday,
        faculty: req.body.profile.faculty,
        department: req.body.profile.department,
        line: req.body.profile.line
      },
      contact: {
        tel: req.body.contact.tel,
        network: req.body.contact.network,
        email: req.body.contact.email,
        facebook: req.body.contact.facebook,
        houseno: req.body.contact.houseno,
        village: req.body.contact.village,
        villageno: req.body.contact.villageno,
        road: req.body.contact.road,
        subdistrict: req.body.contact.subdistrict,
        district: req.body.contact.district,
        province: req.body.contact.province,
        postalcode: req.body.contact.postalcode

      },
      information: {
        school: req.body.information.school,
        county: req.body.information.county,
        gpa: req.body.information.gpa,
        plan: req.body.information.plan,
        height: req.body.information.height,
        weight: req.body.information.weight,
        blood: req.body.information.blood,
        disease: req.body.information.disease,
        drugallergy: req.body.information.drugallergy
      },
      friend: {
        name: req.body.friend.name,
        surname: req.body.friend.surname,
        nickname: req.body.friend.nickname,
        tel: req.body.friend.tel,
        faculty: req.body.friend.faculty,
        department: req.body.friend.department
      },
      family: {
        dad: {
          name: req.body.family.dad.name,
          surname: req.body.family.dad.surname,
          age: req.body.family.dad.age,
          career: req.body.family.dad.career,
          workplace: req.body.family.dad.workplace,
          position: req.body.family.dad.position,
          income: req.body.family.dad.income,
          tel: req.body.family.dad.tel,
          network: req.body.family.dad.network
        },
        mom: {
          name: req.body.family.mom.name,
          surname: req.body.family.mom.surname,
          age: req.body.family.mom.age,
          career: req.body.family.mom.career,
          workplace: req.body.family.mom.workplace,
          position: req.body.family.mom.position,
          income: req.body.family.mom.income,
          tel: req.body.family.mom.tel,
          network: req.body.family.mom.network
        },
        emergency: {
          name: req.body.family.emergency.name,
          surname: req.body.family.emergency.surname,
          age: req.body.family.emergency.age,
          concerned: req.body.family.emergency.concerned,
          career: req.body.family.emergency.career,
          tel: req.body.family.emergency.tel,
          network: req.body.family.emergency.network
        },
        status: req.body.family.status
      },
      other: {
        talent: req.body.other.talent,
        character: req.body.other.character,
        position: req.body.other.position
      }
    }

    const studentId = req.params.studentId;
    const docRef = db.collection('students').doc(`${studentId}`)
    docRef.set(user)
    res.status(200).send("add profile success");
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
