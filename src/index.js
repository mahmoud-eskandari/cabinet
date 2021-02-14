const dotenv = require("dotenv");
const getInteractions = require("./data");
const render = require("./image");
const {getUser} = require("./api");
const Twitter = require("twitter-lite");

/**
 * Load the environment variables from the .env file
 */
dotenv.config();

/**
 * This is the main function of the app. It need to be a function because we can't have a top level await.
 */
async function main() {
	// Create an instance of the API client using the consumer keys for your app
	const client = new Twitter({
		consumer_key: process.env.CONSUMER_KEY,
		consumer_secret: process.env.CONSUMER_SECRET,
	});

	// Use the previous client to fetch the bearer token
	// This method gives you an application-only token specifically for read-only access to public information.
	const bearer = await client.getBearerToken();

	// Create a new twitter client with this token.
	// We assign this client to a global variable so we can access it in the api module

	globalThis.TwitterClient = new Twitter({
		bearer_token: bearer.access_token,
	});

	// fetch the information of the logged in user
	// instead of getMe you could replace it with another method to get a third user to generate their circles

	const user = await getUser(process.env.USER_ID);


	// this is how many users we will have for each layer from the inside out
	const layers = [10,23];

	// fetch the interactions
	const data = await getInteractions(user.screen_name.toLowerCase(), layers);


	//move 1st and 2nd users to side of president :)
	let i = data[1][4];
	data[1][4] = data[1][0];
	data[1][0] = i;

	i = data[1][5];
	data[1][5] = data[1][1];
	data[1][1] = i;

	const exp = data[0].concat(data[1]).concat(data[2]);
	// render the image
	await render([
		{users: [user]},
		{users: exp},
	]);
}

// entry point
main();
