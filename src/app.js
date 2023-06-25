import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const tweets = [];
const usuarios = [];


app.get("/tweets", (req,res) =>{
    let ultimosTweets = []
    ultimosTweets = tweets.slice(-10);

    const tweetsComAvatar = ultimosTweets.map(tweet => {
        const usuarioEncontrado = usuarios.find(usuario => usuario.username === tweet.username);
        
        return {
            username: tweet.username,
            avatar: usuarioEncontrado.avatar,
            tweet: tweet.tweet
        };
    });

    res.send(tweetsComAvatar);
});

app.post("/sign-up",(req,res)=>{
    const {username, avatar} = req.body;

    if(!username || !avatar){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }
    if(typeof username !== "string" || typeof avatar !== "string"){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    const usuario = {
        username: username, 
        avatar: avatar 
    }

    usuarios.push(usuario);

    res.status(201).send("OK")
})

app.post("/tweets", (req,res)=>{
    const {username, tweet} = req.body;

    if(!username || !tweet){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    if(typeof username !== "string" || typeof tweet !== "string"){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    if (!usuarios.includes(username)) {
        res.status(401).send("“UNAUTHORIZED”");
        return;
    }

    const newTweet = {
        username: username,
        tweet: tweet
    }

    tweets.push(newTweet);

    res.status(201).send("OK")
})

app.listen(5000);