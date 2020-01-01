const config = require("../config"),
	  express = require("express"),
	  LocalStrategy = require("passport-local"),
	  passport = require("passport"),
	  User = require("../models/user"),
	  utils = require("../utils");

let router = express.Router();

router.get("/sign-up", (req, res) => res.render("sign-up"));

router.post("/sign-up", (req, res) => 
{
	var newUser = new User({ username: req.body.username, avatar: config.user.defaultAvatar });
	// password is handled differently, as it is encrypted and stored in the database,
	// therefore it is not passed in the 'newUser' object
	User.register(newUser, req.body.password, (err, user) =>
	{
		if (err)
		{
			req.flash("error", err.message);
			return res.render("sign-up");
		}
		// automatically login user with the newly registered user details
		passport.authenticate("local")(req, res, () => res.redirect("/campgrounds"));
	});
});

// redirect -> used after login to redirect to pre-login page for extra convenience
router.get("/login", (req, res) => res.render("login", { redirect: req.query.redirect }));

// login with form data
// redirect back to "/login" on failure, else login user and redirect
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => 
{		
	req.flash("success", `Logged in as <em>${req.user.username}</em>`);
	res.redirect(req.query.redirect || "/campgrounds");
});

// logout => reset user session and redirect to "/"
router.get("/logout", (req, res) =>
{
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/");
});

module.exports = router;