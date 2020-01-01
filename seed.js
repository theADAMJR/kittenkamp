const faker = require("faker"),
	  mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment");
 
var data = [
{
	name: "Cat Caves", 
	image: "https://cdn.pixabay.com/photo/2017/09/15/02/22/fantasy-2750995_960_720.jpg",
	description: "Discover the hidden world of Cat Caves, and the cryptic caverns that stretch far below the overworld. Legends say they hide tremendous treasures.",
	price: "5",
	author: 
	{
		id: "5dd2d762a7c0cb095adce046",
		username: "t"
	}
},
{
	name: "Kitten Kreek", 
	image: "https://cdn.pixabay.com/photo/2016/10/25/12/28/iceland-1768744_960_720.jpg",
	description: "Marvel at the restless rapids that characterize this prestigious paradise. Climb the tall peaks and be amazed with a far panoramic view above the world.",
	price: "5",
	author: 
	{
		id: "5dd2d762a7c0cb095adce046",
		username: "t"
	}
},
{
	name: "Tabby Trail", 
	image: "https://cdn.pixabay.com/photo/2019/09/15/13/27/mountain-4478283_960_720.jpg",
	description: "Immerse into a peaceful atmosphere and view the galaxy, mostly unseen by modern civilization. Gaze as the spiralling milky way fills the dark horizon with endless vibrant stars.",
	price: "5",
	author: 
	{
		id: "5dd2d762a7c0cb095adce045",
		username: "t2"
	}
},
{
	name: "Shorthair Savanna", 
	image: "https://cdn.pixabay.com/photo/2019/03/03/16/43/zebra-4032285_960_720.jpg",
	description: "Witness the horizon as nature unfolds across a seamless sunrise, that bestirs the lavish landscape.",
	price: "5",
	author: 
	{
		id: "5dd2d762a7c0cb095adce045",
		username: "t2"
	}
}
];

addCampgrounds = err =>
{
	if(err) return log.error(err);
	log.info("Removed comments!");

	data.forEach(seed => Campground.create(seed, () => 
	log.info("Added a campground")));
}

createComment = async(err, campground) =>
{
	if(err) return log.error(err);
	log.info("Added a campground");
	
	Comment.create(
	{
		content: faker.lorem.sentence(),
		author: faker.name.findName()
	}, (err, comment) => 
	{
		campground.comments.push(comment);
		log.info("Created new comment");
		campground.save();
	});
}
 
function seedDB()
{
   	Campground.deleteMany({}, err =>
	{
		if(err) return log.error(err);
		log.info("Removed campgrounds!");
		
		Comment.deleteMany({}, addCampgrounds);
	});
}
 
module.exports = seedDB;