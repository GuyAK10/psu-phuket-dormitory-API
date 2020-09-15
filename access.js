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

router.delete('/logout/:id', (req, res) => {
    const id = req.params.id
    const docRef = db.collection('token').doc(`${id}`)
    docRef.delete()
    res.send("logout success");
    res.redirect('/');
});

router.post('/', (req, res) => {
    try {
        soap.createClient(url, (err, client) => {
            let user = {}
            user.username = req.body.username
            user.password = req.body.password
            user.type = req.body.type

            client.GetUserDetails(user, async function (err, response) {
                const responseData = {

                    userId: userUsecase.getStudentId(response),
                    role: userUsecase.getRole(response)
                }

                if (user.type == responseData.role) {

                    let oldToken = []
                    const payload = {
                        id: responseData.userId,
                        type: responseData.role,
                        exp: Date.now() + (1000 * 60 * 10)
                    }
                    let privateKey = fs.readFileSync('./configs/private.pem', 'utf8');
                    let encoded = jwt.sign(payload, privateKey, { algorithm: 'HS256' });
                    const docRef = db.collection('token');
                    const snapshot = await docRef.where('id', '==', `${responseData.userId}`).get();
                    if (snapshot.empty) {
                        const register = docRef.doc(`${responseData.userId}`)
                        await register.set({
                            login: true,
                            id: responseData.userId,
                            type: responseData.role,
                            token: encoded
                        });
                        res.status(200).send({
                            login: true,
                            id: responseData.userId,
                            type: responseData.role,
                            token: encoded
                        })
                    } else {
                        snapshot.forEach(doc => {
                            oldToken.push(doc.data())
                        });
                        oldToken.find(obj => {
                            jwt.verify(obj.token, privateKey, { algorithm: "HS256" }, async (err, decoded) => {
                                if (err) {
                                    res.status(500).json({ error: "Not Authorized" });
                                    throw new Error("Not Authorized");
                                } else if (parseInt(decoded.exp) > Date.now()) {
                                    res.status(200).send('you can logging in')
                                } else {
                                    const register = docRef.doc(`${responseData.userId}`)
                                    await register.set({
                                        login: true,
                                        id: responseData.userId,
                                        type: responseData.role,
                                        token: encoded
                                    });
                                    res.status(200).send({
                                        login: true,
                                        id: responseData.userId,
                                        type: responseData.role,
                                        token: encoded
                                    })
                                }
                            });
                        })
                    }
                }
                else {
                    res.sendStatus(400)
                }
            });
        });
    } catch (error) {
        res.send(error);
    }

})

module.exports = router;

