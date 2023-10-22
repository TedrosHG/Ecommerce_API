const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { trpe: String, required: true},
    isAdmin:{ type: Array},
    size: { type: String },
    color: { trpe: String},
    price: { type: Number, required: true },

 },
 { timestamps:true }
 )

 module.exports = mongoose.model("Product",ProductSchema)