const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("../model/User")
const bcrypt = require("bcryptjs")
const JWT_Secret = "geguergjndgdnfgjfnfsdieapa3435334vgedffsgdbds"

router.post("/signup", async(req, res) => {
    const { username, email, password, conpassword } = req.body;

    if (!username || !email || !password || !conpassword) {
        return res.status(404).send(error = "please fill all")
    }


    if (password !== conpassword) {
        return res.status(401).send(error = "verify your password")
    }

    try {
        const user = await User.create({ username, email, password, allergies: [] })
        user.hashPassword()
        user.token = jwt.sign({ userId: user._id },
            JWT_Secret, { expiresIn: '24h' }
        )

        await user.save()
        return res.status(201).send(user.token)
    } catch (error) {
        console.log(error)
        res.status(422).send("une erreur est survenu")

    }
})

router.post("/login", async(req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        console.log("hi bye ", email)
        return res.status(401).json({ msg: "Please provide all values", email: email, password: password })

    }
    const user = await User.findOne({ email }).select('+password')
    console.log(user)
    if (!user) {
        return res.status(404).json({ msg: "invalid credentials" })
    }

    console.log(password)
    console.log(user)
    const isCorrect = await user.comparePassword(password)
    console.log(isCorrect)
    if (!isCorrect) {
        console.log("ma3ereft", email)
        return res.status(403).json({ msg: "mot de passe incorrecte" })
    } else {
        return res.status(200).json(user.token)
    }

})


module.exports = router;