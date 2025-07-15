const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title:{ type:String, required:true, unique:true },
        author:{ type:String, required:true },
        isbn:{ type:String, unique:true, required:true },
        quality:{ type:Number, required:true },
        available:{ type:Number, default:true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);