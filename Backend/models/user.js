const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{ type:String, required:true, unique:true },
        email:{ type:String, required:true, unique:true },
        password:{ type:String, required:true, minLength:6},
        role:{ type:String, required:true, enum:["Borrower","Librarian"], default:"Borrower" },
        profilePicture:{ type:String, default:"" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
