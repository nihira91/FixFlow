const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        issueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        //comment message(text)
        message: {
            type: String,
            required: true,
            trim: true,
        },

        role: {
            type: String,
            enum: ["employee", "technician", "admin"],
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);