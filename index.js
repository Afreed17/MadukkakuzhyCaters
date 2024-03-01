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

app.get("/reset",async(req,res)=>{
    res.render("reset.ejs")
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
        res.render("login.ejs",{error:"incorrect credentilas"})
       }
    }
    catch(err)
    {
        console.log(err);
    }

});

app.post("/resetPassword",async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    try{
        if (email=="admin@gmail.com"){
            if(password==confirmPassword){
                await db.query("update login set password = ($1) where email = ($2)",[password,email])
                res.render("login.ejs",{success:"successfully updated password"});
            }
            else{
                res.render("reset.ejs",{pswdError:"password doesn't match"})
            } 
        }
        else{
            res.render("reset.ejs",{mailError:"Invalid Email"})
        }
    }
    catch(err){

    }
})

app.get("/login",async(req,res)=>{
    res.render("login.ejs");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });