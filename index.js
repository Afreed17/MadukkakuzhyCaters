import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "madukkakuzhy",
    password: "afreedafu17",
    port: 5432,
  });
  db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login.ejs");
})

app.post("/login",async (req,res)=>{

    const email = req.body.email;
    const password = req.body.password;

    try{
       const result =  await db.query("select * from login;");
       const checkEmail = result.rows[0].email;
       const checkPassword = result.rows[0].password;
       if(email==checkEmail && password==checkPassword){
        res.render("index.ejs");
       }
       else{
        res.send("incorrect credentials");
       }
    }
    catch(err)
    {
        console.log(err);
    }

})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });