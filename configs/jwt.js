const jwt = require('jsonwebtoken');
const fs = require('fs')
const firebase = require('./firebase')
const tokenRef = firebase.firestore().collection('token')
const db = firebase.firestore()
const privateKey = fs.readFileSync('./configs/private.pem', 'utf8');

const createToken = async (user, responseData, _req, res) => {

      if (responseData.userId === null && responseData.role === null) {

            res.status(401).send("ID หรือ Password ผิด");
      } else {
            if (user.type == responseData.role) {

                  const payload = {
                        id: responseData.userId,
                        type: responseData.role,
                        exp: Date.now() + (1000 * 60 * 60)
                  }
                  let encoded = jwt.sign(payload, privateKey, { algorithm: 'HS256' });
                  const docRef = db.collection('token');
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
            else {
                  res.status(400).send(สถานะไม่ถูกต้อง)
            }
      }
}

const verifyHeader = async (req, res, next) => {
      try {
            if (req.headers.authorization) {
                  const tokenReceive = req.headers.authorization
                  const token = tokenReceive.slice(7)
                  const verifyHeaderToken = await tokenRef.where('token', '==', token).get()
                  let isExpToken = {}
                  const decode = jwt.decode(token, privateKey)
                  if (!verifyHeaderToken.empty) {
                        await verifyHeaderToken.forEach(result => isExpToken = { ...result.data() })
                  }
                  if (isExpToken.token !== token) {
                        console.log("Not authorization")
                        res.status(401).send('Not authorization')
                  }
                  if (+decode.exp < Date.now()) {
                        console.log("token expired")
                        res.status(401).send('Token expired')
                  }
                  else next()

            } else {
                  console.log("Please Login")
                  res.status(401).send('Please Login')
            }
      } catch (e) {
            res.sendStatus(400);
      }
}

module.exports = {
      verifyHeader,
      createToken
}
