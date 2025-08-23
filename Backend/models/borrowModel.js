const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date }, // ✅ submit date (15 days later)
    status: { type: String, enum: ["Pending", "Borrowed", "Returned", "Declined"], default: "Pending" },
    coverImage: { type: String, default: "" }, // URL of the book cover image
    fine: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook → set due date = 15 days from borrowDate
borrowSchema.pre("save", function (next) {
  if (this.isNew && this.borrowDate && !this.dueDate) {
    this.dueDate = new Date(this.borrowDate.getTime() + 15 * 24 * 60 * 60 * 1000);
  }
  next();
});


module.exports = mongoose.model("Borrow", borrowSchema);
