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

async function showStaff(){
    const result = await db.query("SELECT * FROM employees");
    const items = result.rows;
    return items;
}


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
        try{
            
            const items = await showStaff();
            res.render("index.ejs",{data:items});
        }
        catch(err)
        {
            console.log(err)
        }
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

app.post("/viewEach",async(req,res)=>{
    const profileId = req.body.viewDetails;
    try{
        const result = await db.query("select * from employees where id =($1)",[profileId]);
        const items = result.rows
        res.render("profile.ejs",{data:items});
    }
    catch(err){
        res.send("404");
    }
})


app.get("/add",async(req,res)=>{
    res.render("add.ejs");
})

app.post("/addNew",async(req,res)=>{
    const name = req.body.name;
    const designation = req.body.designation;
    const phone =req.body.phone;
    const email = req.body.email;
    const address = req.body.address;
    const salary = req.body.salary;

    try{
        await db.query("Insert into employees (name,designation,phone,email,address,salary) values ($1,$2,$3,$4,$5,$6)",[name,designation,phone,email,address,salary]);
        const items = await showStaff();
        res.render("index.ejs",{data:items});
      }
      catch(err){
        console.log (err)
      }
    
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });