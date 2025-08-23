const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      enum: ["Borrower", "Librarian"],
      default: "Borrower",
      required: true,
    },
    status:{
      type: String,
      enum:["Active", "Inactive"],
      default: "Inactive",
      required: true,
    },
    profilePicture: { type: String, default: "" },
    otp:{type:String, default:null},
    otpExpires:{type:Date , default:null}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
