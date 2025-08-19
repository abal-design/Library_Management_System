const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date }, // ✅ submit date (15 days later)
    status: { 
    type: String, 
    enum: ["Pending", "Borrowed", "Returned", "Declined"], 
    default: "Pending" 
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", borrowSchema);
