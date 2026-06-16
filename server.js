const express = require("express");
const path = require("path");

const app = express();
const router = express.Router();
const PORT = 3000;

const vocDataBase = require("./data/vocdatabase.json");

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

app.use(router);



router.get("/api/getbooks", (req, res) => {
    console.log("got book request");
    res.json({books:Object.keys(vocDataBase)});
});

router.get("/api/getchapters", (req, res) => {
    const { book } = req.query;
    console.log(`got chapter request for book ${book}`);
    res.json({chapters:Object.keys(vocDataBase[book])});
});

router.get("/api/getvoc", (req, res) => {
    const { subject, book, chapters } = req.query;
    console.log(`got: subject: ${subject} book: ${book} chapters: ${chapters}`);
    res.json({voc:["Rumpitur", "invidia"]});
});




app.listen(PORT, () => {
    console.log(`Server läuft auf http://127.0.0.1:${PORT}`);
});
