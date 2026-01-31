import express from 'express';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'url';

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const data = fs.readFileSync(__dirname + '/posts.json', 'utf8');
    const posts = truncatePosts(JSON.parse(data), 97);
    res.render('index.ejs', { posts: posts});
})

app.get('/create', (req, res) => {
    res.render('create.ejs');
})

app.post('/submit', (req, res) => {
    const data = fs.readFileSync(__dirname + '/posts.json', 'utf8');
    
    const newPost = {
        id: JSON.parse(data).length,
        image: req.body.image,
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date().toISOString()
    };

    const updatedPosts = [...JSON.parse(data), newPost];
    fs.writeFileSync(__dirname + '/posts.json', JSON.stringify(updatedPosts, null, 2));
    res.redirect('/');
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