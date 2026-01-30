import express from 'express';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'url';

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));

app.get('/', (req, res) => {
    const data = fs.readFileSync(__dirname + '/posts.json', 'utf8');
    const posts = truncatePosts(JSON.parse(data), 97);
    res.render('index.ejs', { posts: posts});
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})

function truncatePosts(array, n) {
    for(let i = 0; i < array.length; i++) {
        if(array[i].content.length <= n) {
            continue
        } else {
            array[i].content = array[i].content.slice(0, n) + '...';
        }
    }
    return array;
}