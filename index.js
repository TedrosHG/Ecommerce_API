const express = require('express')
const mongoose = require('mongoose')
const dontenv = require('dotenv').config()

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')

const app = express()

// Database connection
mongoose.connect(process.env.MONGO_DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=>{
    console.log("DB connected successfully");
}).catch((error)=>{
    console.log(error.message) 
})

const port = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use('/api/users', userRoute)  
app.use('/api/auth', authRoute)

app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port} `);
})