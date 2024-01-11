const express = require('express');
const app = express();
const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');
const path = require('path');
const methodOverride = require('method-override');
const { v4 : uuidv4 } = require('uuid');




app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host : 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'abcd1234'
});


let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};


// try {
//   connection.query(q, [data] , (err, result) => {
//     if(err) throw err;
//     console.log(result);
//   });
// } catch (err){
// console.log(err);
// }




// home route
app.get("/", (req, res) => {
  let q = `SELECT count(*) from user`;
  try {
  connection.query(q, (err, result) => {
    if(err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", {count});

  });
} catch (err){
console.log(err);
res.send("some error occured");
}
});

// show route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result;
      // console.log(data);
      res.render("user.ejs", {data});
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }
});

// edit route 
app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'` ;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      // console.log(result);
      res.render("edit.ejs", {user});
    });
  } catch (err) {
    console.log(err);
    res.send("some error occurred");
  }
});

// Update (DB) Route
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'` ;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      let {password:formPass, username: newUsername} = req.body;
      if(formPass != user.password) {
        res.send("!!Wrong password!!")
      } else{
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }
});


// Take the new username
app.post("/user/new", (req, res) => {
  res.render("add.ejs");
})

// Add new user
app.put("/user/new", (req, res) => {
  let id = uuidv4();
  let {username, email, password} = req.body;
  let userData = [id, username, email, password]
  let q = `INSERT INTO user (id, username, email, password) VALUE (?,?,?,?)`;
  try{
    connection.query(q, userData, (err, result) => {
      if(err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }
});

// Delete the user
app.get("/user/:id", (req, res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
let user = result[0];
console.log(user);
res.render("delete.ejs", {user});
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }

})

// Delete the user 
app.delete("/user/:id", (req, res) => {
  // res.send("user deleted successfully");
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  let {password:passwd} = req.body; 
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      if (passwd != result[0].password) {
        res.send("<h1>!! You entered wrong password</h1> <h1> Please! enter correct password</h1>");
      } else {
        let q2 = `DELETE FROM user WHERE id = '${id}'`;
        connection.query(q2, (err, result) => {
if(err) throw err;
res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error occured");
  }

});

app.listen(8080, () => {
console.log(`server is listening on port 8080`);
});


// connection.end();