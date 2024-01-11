const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const chat = require("./models/chat");
const methodOverride = require("method-override");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then( () => {
    console.log("connection successfull");
})
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}


app.get("/", (req, res) => {
    res.send("working root");
});

// show all chats
app.get("/chats", async(req, res) => {
    let chats = await chat.find();
res.render("index.ejs", {chats});
});

// New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
})

// Create route
app.post("/chats", (req, res) => {
    let {from, msg, to} = req.body;
    console.log(from, msg, to);
    let newChat = new chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    console.log(newChat);
  newChat.save()
  .then( (result) => {
    console.log("result:", result);
  })
  .catch( (err) => {
    console.log(err);
    res.send("some err occured");
  });
  res.redirect("/chats");
});

// Edit Route
app.get("/chats/:id/edit", async(req, res) => {
    let {id} = req.params;
    let chats = await chat.findById(id);
    console.log(chats);
    res.render("edit.ejs", {chats});
});

// Update Route
app.put("/chats/:id", async (req, res) => {
    let {id} = req.params;
    let {msg} = req.body;
    let cht = await chat.findByIdAndUpdate(id,{msg}, {runValidators: true, new: true});
    res.redirect("/chats");
});

// Destroy Route
app.delete("/chats/:id", async (req, res) => {
let {id} = req.params;
let delChat = await chat.findByIdAndDelete(id);
console.log(delChat);
res.redirect("/chats");
});


app.listen(8080, () => {
    console.log("app is listening on port 8080");
});