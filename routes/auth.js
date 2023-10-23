const router = require('express').Router()
//const CryptoJS = require('crypto-js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

router.get('/', async (req,res)=>{
    try {
        const user = await User.find().select('-password')
        if(!user){
            return res.status(404).send("Hello")
        }else{
            res.status(200).json(user)
        }
    } catch (error) {
        
    }
})

router.post('/register', async (req,res)=>{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        //password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        password: hashedPassword,
        email: req.body.email,
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/login',async (req,res)=>{
    try {
        const user = await User.findOne({ username: req.body.username})
        if(!user){
            return res.status(401).json({msg:"Invalid credentials"})
        }
        // const hashedPassword  = CryptoJS.AES.decrypt(
        //     user.password ,process.env.PASS_SEC);
        //const password = hashedPassword.toString(CryptoJS.enc.Utf8)
        const passwords = await bcrypt.compare(req.body.password, user.password);

        if(!passwords){
            return res.status(401).json({msg:"Invalid credentials: password"})
        }
        
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn:'3d'}
            )

        const {password, ...others} = user._doc
        res.status(200).json({...others, accessToken})
        
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router