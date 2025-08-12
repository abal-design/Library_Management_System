const mongoose = require("mongoose");




const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, min: 0 },
    category:{ type: String },
    available: { type: Number, required: true, min: 0 },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
