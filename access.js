require('tls').DEFAULT_MIN_VERSION = 'TLSv1'   // since TLSv1.3 default disable v1.0 
const express = require('express');
const soap = require('soap');
const { userUsecase } = require('./usecase/userUsecase')
const jwt = require('jsonwebtoken');
const fs = require('fs')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const router = express.Router()
const firestore = require('./configs/firebase')
const db = firestore.firestore()
const { createToken } = require('./configs/jwt')


//remove token
router.delete('/logout/:token', async (req, res) => {
    const token = req.params.token
    const docRef = db.collection('token')
    const find = await docRef.where('token', "==", token).get()
    let deleteId = {}

    try {
        if (!find.empty) {
            find.forEach(res => deleteId = { ...res.data() })
        }
        docRef.doc(deleteId.id).delete()
        res.send("Logout");
    } catch (e) {
        res.sendStatus(500)
    }
})


//create token
router.post('/', (req, res) => {
    try {
        soap.createClient(url, (err, client) => {
            let user = {}
            user.username = req.body.username
            user.password = req.body.password
            user.type = req.body.type
            client.GetUserDetails(user, async function (err, response) {
                try {
                    const responseData = {
                        userId: userUsecase.getStudentId(response),
                        role: userUsecase.getRole(response)
                    }
                    createToken(user, responseData, req, res)
                } catch (error) {
                    res.sendStatus(501)
                }
                
            });
        });
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;