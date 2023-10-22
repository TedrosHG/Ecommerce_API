const router = require('express').Router()

router.get('/', (req,res)=>{
    res.send({message: 'Welcome to the API'})
})

module.exports = router