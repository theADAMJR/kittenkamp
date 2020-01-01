const mongoose = require("mongoose");

module.exports = mongoose.model("Comment",
{
	content: String,
	author:
	{
		// mongoose object id -> reference to the User model
		id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		username: String
	}
});