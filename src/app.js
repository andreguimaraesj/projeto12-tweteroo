import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const tweets = [];
const usuarios = [];

app.get("/tweets", (req,res) =>{
    const page = parseInt(req.query.page);
    if(page === undefined){
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
        return;
    }
    if(page<1){
        res.status(400).send("Informe uma página válida!");
        return;
    }
    if(page>0){
        const tweetsReverse = [...tweets].reverse();

        const indiceComeco = (page - 1) * 10;
        const indiceFinal = indiceComeco + 9;

        const limiteArray = tweetsReverse.slice(indiceComeco, indiceFinal);

        const tweetsComAvatar = limiteArray.map(tweet => {
            const usuarioEncontrado = usuarios.find(usuario => usuario.username === tweet.username);
            
            return {
                username: tweet.username,
                avatar: usuarioEncontrado.avatar,
                tweet: tweet.tweet
            };
        });

        res.send(tweetsComAvatar);
        return;
    }
});

app.get("/tweets/:USERNAME", (req,res)=>{
    const { USERNAME } = req.params

    const userTweets = tweets.filter(tweet => tweet.username === USERNAME);

    res.send(userTweets);
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
    const {tweet} = req.body;
    const {user} = req.headers;


    if(!user || !tweet){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    if(typeof user !== "string" || typeof tweet !== "string"){
        res.status(400).send("Todos os campos são obrigatórios!")
        return
    }

    if (!usuarios.find(usuario => usuario.username === user)) {
        res.status(401).send("UNAUTHORIZED");
        return;
    }

    const newTweet = {
        username: user,
        tweet: tweet
    }

    tweets.push(newTweet);

    res.status(201).send("OK")
})

app.listen(5000);