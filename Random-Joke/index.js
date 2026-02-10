import express from "express";
import axios from "axios";

const app = express(); 
const PORT = 3000;
const pullLimit = 100;
const API_URL = `https://www.reddit.com/r/jokes.json?limit=${pullLimit}&raw_json=1`;

app.use(express.static('public'));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const randomJoke = response.data.data.children[Math.floor(Math.random() * pullLimit)].data;
        const joke = {
            title: randomJoke.title,
            body: randomJoke.selftext,
            author: randomJoke.author,
            link: randomJoke.url,
            upvotes: randomJoke.ups,
            comments: randomJoke.num_comments
        }

        res.render("index.ejs", { joke: joke });
    }
    catch (error) {
        res.status(500).send("An error occurred while fetching the joke.");
        console.log(error.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})