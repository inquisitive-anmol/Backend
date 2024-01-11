const express = require("express");
const app = express();

// console.log(app);

let port = 3000;

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
    // console.log("Welcome! your first server side code worked");
});

app.get("/", (req, res) => {
    res.send("hii i'm root");
});

// app.get("/:username/:id", (req, res) => {
//     console.log(req.params);
//     let {username, id} = req.params;
//     res.send(`Welcome! @ ${username} with id ${id}`);
// })

app.get("/search", (req, res) => {
    // console.log(req.query);
    let {name, color} = req.query;
    res.send(`Search results for query ${name} and ${color}`);
})
// app.get("/apple", (req, res) => {
//     res.send("you contacted apple path");
// });
// app.get("/orange", (req, res) => {
//     res.send("you contacted orange path");
// });

// app.get("*", (req, res) => {
//     res.send("requested path doesn't exist");
// });

// app.post("/", (req, res) => {
//     res.send("you sent post request");
// });


// app.use((req, res) => {
//     console.log("request recieved");
    // res.send("this is the first ever response");
    // res.send({
    //     name:"apple",
    //     color:"red"
//     // })
// let code = "<h1>Fruit</h1> <ul><li>apple</li><li>orange</li></ul>"; 
//     res.send(code);
// });