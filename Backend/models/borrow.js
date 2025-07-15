const mongoose = require("mongoose");

const BorrowerSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        borrowDate: { type: Date, default: Date.now },
        returnDate: { type: Date, default: null },
        status: { type: String, enum: ["Borrowed", "Returned"], default: "Borrowed" }
    },
    { timestamps: true }
);



module.exports = mongoose.model("Borrower", BorrowerSchema);