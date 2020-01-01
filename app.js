// require modules
const bodyParser = require("body-parser"),
	  compression = require("compression"),
	  config = require("./config"),
	  express = require("express"),
	  faker = require("faker"),
	  flash = require("connect-flash-plus"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  minify = require("express-minify"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  seedDb = require("./seed"),
	  utils = require("./utils"),
	  User = require("./models/user");

// routes for later declaration
const authRoutes = require("./routes/auth"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");

// conventional app variable -> initialize express function as app
let app = express();

// process.env.DB_URL:
//  local -> export DB_URL=mongodb://localhost/kittenKamp
mongoose.connect(process.env.DB_URL || `mongodb://localhost/kittenKamp`, { useNewUrlParser: true, useUnifiedTopology: true });

// start mongodb with fresh data
// seedDb(); // <= uncomment to enable

// middleware - automatically parse form data sent on POST, PUT requests etc. to JSON
app.use(bodyParser.urlencoded({ extended: true }));
// middleware - serve public assets in the local public folder
app.use(express.static("public"));
// middleware - enable convenient event messages to be sent to user/client -> i.e. "You've logged in!"
app.use(flash());
// middleware - a way around HTML only supporting GET, and POST requests
// https://...?_method=PUT -> an example of a PUT request; overrides POST requests in forms 
app.use(methodOverride("_method"));
// middleware - 'minify' EJS files. This makes requests load faster due to smaller files to load 
// passport config middleware
app.use(require("express-session")(
{
	secret: "lol secret ┬┴┬┴┤(･_├┬┴┬┴",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport-local-mongoose config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// automatically defaults res.render file extensions to '.ejs'
app.set("view engine", "ejs");
app.use(minify());
app.use(compression());

// start the server with the port provided on the config
app.listen(process.env.PORT || config.app.port, () => log.info(`KittenKamp server has started on port ${config.app.port}`));

// middleware -> set local variables for use in EJS template files and routes
app.use((req, res, next) =>
{	
	res.locals = 
	{ 
		error: req.flash("error"),
		faker: faker,
		loginRedirect: req.originalUrl,
		success: req.flash("success"),
		truncate: truncate,
		user: req.user
	}
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", authRoutes);

// 404 -> any request that is not defined is sent to this route
app.all("*", (req, res) => res.status(404).render("errors/404"));

// if an error is thrown in a route, inform the client what went wrong
app.use((err, req, res, next) => res.status(500).render("errors/500", { message: err }));

// set default image for use in campground routes
app.locals.defaultImage = config.campgrounds.defaultImage;