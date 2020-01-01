const Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  config = require("../config"),
	  express = require("express"),
	  middleware = require("../middleware"),
	  utils = require("../utils");

let router = express.Router();

router.get("/", (req, res) =>
{	
	// find all campgrounds and pass them to campgrounds.ejs 
	Campground.find({}, (err, campgrounds) => err ? res.send("Failed - Ensure database is running") : res.render("campgrounds/index", { campgrounds: campgrounds }));
});

// ':id' -> sets a variable of name 'id' - req.params.id
router.get("/:id", (req, res, next) => 
{	
	Campground.findById(req.params.id).populate("comments").exec((err, campground) =>
	{
		if (!campground || err)
		{
			res.status(!campground ? 404 : 500);
			return next();
		}
		res.render("campgrounds/show", { campground: campground });	
	});
});

// middleware - user must be logged in to access the routes defined below
router.use(middleware.validateUser);

router.get("/new", (req, res) => res.render("campgrounds/new"));

router.post("/", (req, res) =>
{	
	// request body -> sent when a form is submitted to '/campgrounds' 
	var body = req.body;
	Campground.create(
	{ 
		name: body.name,
		description: body.description,
		image: body.image || config.campgrounds.defaultImage,
		createdAt: new Date(),
		author: { id: req.user.id, username: req.user.username },
	}, (err, campground) => err ? log.error(err) : log.info(`Created campground: ${campground.name}`));
	
	res.redirect("/campgrounds");
});

router.get("/:id/edit", middleware.validateCampOwner, (req, res, next) =>
{
	Campground.findById(req.params.id, (err, campground) =>
	{
		if (!campground || err)
		{
			res.status(!campground ? 404 : 500);
			return next();
		}
		res.render("campgrounds/edit", { campground: campground })
	});
});

router.put("/:id", middleware.validateCampOwner, (req, res, next) =>
{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) =>
	{
		if (!campground || err)
		{
			res.status(!campground ? 404 : 500);
			return next();
		}
		res.redirect(`/campgrounds/${req.params.id}`);
	});
});

router.delete("/:id", middleware.validateCampOwner, (req, res, next) =>
{
	Campground.findByIdAndRemove(req.params.id, (err, campground) =>
	{
		if (!campground || err)
		{
			res.status(!campground ? 404 : 500);
			return next();
		}
		res.redirect(`/campgrounds`);
	});
});

router.post("/:id/comments", (req, res, next) =>
{
	Campground.findById(req.params.id).populate("comments").exec((err, campground) =>
	{
		if (!campground || err)
		{
			res.status(!campground ? 404 : 500);
			return next();
		}
		// storing a username is more convenient as it's less data to store than an entire User object
		req.body.comment.author = { id: req.user.id, username: req.user.username };
		Comment.create(req.body.comment, (err, comment) =>
		{
			err && log.error(err);
			campground.comments.push(comment);
			campground.save();
			res.redirect(`/campgrounds/${req.params.id}`);
		});
	});
});

router.put("/:id/comments/:commentId", middleware.validateCommentOwner, (req, res, next) =>
{
	// update comment author with their current username
	req.body.comment.author = { id: req.user.id, username: req.user.username };
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) =>
	{
		return err ? res.redirect("back") : res.redirect(`/campgrounds/${req.params.id}`);
	});
});

router.delete("/:id/comments/:commentId", middleware.validateCommentOwner, (req, res, next) =>
{
	Comment.findByIdAndRemove(req.params.commentId, (err, comment) =>
	{
		return err ? res.redirect("back") : res.redirect(`/campgrounds/${req.params.id}`);
	});
});

module.exports = router;