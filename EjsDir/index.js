const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

app.get("/", (req, res) => {
   res.render("home.ejs");
});
app.get("/rolldice", (req, res) => {
    let diceVal = Math.floor(Math.random()*6) +1;
   res.render("rolldice.ejs", {num:diceVal});
});

app.get("/ig/:username", (req, res) => {
    // let followers = ["abc", "afgch", "steve", "tony", "banner", "natasha"];
    let {username} = req.params;
    const instaData = require("./data.json");
    const data = instaData[username];
    console.log(data);
    if(data) {
        res.render("instagram.ejs", {data});
    } else{
        res.render("error.ejs");
    }
    
})

app.get("*" ,(req, res) => {
    res.send("no data found");
});

app.listen(port, () =>{
    console.log(`app listening at port ${port}`);
});