const Campground = require("./models/campground"),
	  Comment = require("./models/comment");

let middleware = {};

// ensure user is logged in -> Authentication
middleware.validateUser = (req, res, next) => 
{
	if (!req.isAuthenticated())
	{
		req.flash("error", "Please login first!");
		return res.redirect(`/login?redirect=${req.originalUrl}`);
	}
	next();
}

// ensure logged in users owns the requested campground -> Authorization
middleware.validateCampOwner = (req, res, next) =>
{
	Campground.findById(req.params.id, (err, campground) =>
	{
		if (!campground) return res.sendStatus(404);
		else if (err || !req.user || !req.user._id.equals(campground.author.id)) return res.sendStatus(401);
		return next();
	});
}

// ensure user owns comment -> Authorization
middleware.validateCommentOwner = (req, res, next) =>
{
	Comment.findById(req.params.commentId, (err, comment) =>
	{
		if (!comment) return res.send(404);
		else if (err || !req.user._id.equals(comment.author.id)) return res.send(401);
		return next();
	});
}

module.exports = middleware;