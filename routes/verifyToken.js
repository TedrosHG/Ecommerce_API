const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifytoken = (req, res, next)=>{
    const authHeader = req.headers.token
    if(!authHeader){
        return res.status(401).json("you are not authenticated")
    }else{
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, async (error, data)=>{
            if(error) {
                res.status(403).json(error)
            }
            const user = await User.findById(data.id)
            if (!user) {
                return res.status(403).json("No user")
            }
            req.user= {id:user._id, isAdmin:user.isAdmin}
            
            next()
        })
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifytoken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json('You are not allowed to perform this action')
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifytoken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json('You are not allowed to perform this action')
        }
    })
}

module.exports = {
    verifytoken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
}