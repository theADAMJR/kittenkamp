const mongoose = require("mongoose");

module.exports = mongoose.model("Campground",
{
	name: String,
	description: String,
	image: String,
	price: String,
	createdAt: Date,
	author:
	{
		id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		username: String
	},
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
});