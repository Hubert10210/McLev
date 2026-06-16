const express = require("express");
const readline = require("readline");
const path = require("path");

const app = express();
const router = express.Router();
const PORT = 3000;

const vocDataBase = require("./data/vocdatabase.json");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.use(router);

rl.on("line", (input) => {
    if (input == "stop") {
        console.log("Server wird beendet...");
        process.exit(0);
    }
})

router.get("/api/getbooks", (req, res) => {
    console.log("got book request");
    res.json({books:Object.keys(vocDataBase)});
});

router.get("/api/getchapters", (req, res) => {
    const { book } = req.query;
    console.log(`got chapter request for book ${book}`);
    res.json({chapters:Object.keys(vocDataBase[book])});
});

router.post("/api/getvoc", (req, res) => {
    const { book, chapters } = req.body;
    let vocList = {};
    for (let c of chapters){
        vocList[c] = vocDataBase[book][c];
    }
    res.json({voc:vocList});
});




app.listen(PORT, () => {
    console.log(`Server läuft auf http://127.0.0.1:${PORT}`);
});
