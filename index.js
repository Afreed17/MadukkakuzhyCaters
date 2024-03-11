import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
// import fs from "fs";
// import {google} from "googleapis";
// import apikeys  from  "./apikey.json";

const app = express();
const port = 3000;


// const SCOPE = ['https://www.googleapis.com/auth/drive'];
// // A Function that can provide access to google drive api
// async function authorize(){
//     const jwtClient = new google.auth.JWT(
//         apikeys.client_email,
//         null,
//         apikeys.private_key,
//         SCOPE
//     );
//     await jwtClient.authorize();
//     return jwtClient;
// }


// A Function that will upload the desired file to google drive folder
// async function uploadFile(authClient){
//     return new Promise((resolve,rejected)=>{
//         const drive = google.drive({version:'v3',auth:authClient}); 
//         var fileMetaData = {
//             name:'staffImages',    
//             parents:['18kfDL8AILd3ueqe81WMrWBna_g2huPUq'] // A folder ID to which file will get uploaded
//         }
//         drive.files.create({
//             resource:fileMetaData,
//             media:{
//                 body: fs.createReadStream('assets/icons/logo.svg'), // files that will get uploaded
//                 mimeType:'text/plain'
//             },
//             fields:'id'
//         },function(error,file){
//             if(error){
//                 return rejected(error)
//             }
//             resolve(file);
//         })
//     });
// }

// authorize().then(uploadFile).catch("error",console.error()); // function call



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
async function showStaffAddress(){
    const result = await db.query("SELECT * FROM address");
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
            console.log(items);
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
        const result = await db.query("select * from employees as e JOIN address as a ON e.id=a.id and e.id = ($1)",[profileId]);
        const items = result.rows;
        res.render("profile.ejs",{data:items});
    }
    catch(err){
        res.send("404");
    }
})


app.get("/add",async(req,res)=>{
    res.render("add.ejs");
})

app.post("/delete",async(req,res)=>{
    const id = req.body.staffId;
    try{
        await db.query("delete from employees where id = ($1)",[id]);
        const items = await showStaff();
        res.render("index.ejs",{data:items});
    }
    catch(err){
        console.log("error in delete route"+err);
        const items = await showStaff();
        res.render("index.ejs",{data:items});
        
    }
});

app.post("/addNew",async(req,res)=>{
    const name = req.body.name;
    const designation = req.body.designation;
    const phone =req.body.phone;
    const email = req.body.email;
    const salary = req.body.salary;
    const pincode = req.body.pincode;
    const state = req.body.state;
    const city = req.body.city;
    const house = req.body.house;

    try{
        await db.query("Insert into employees (name,designation,phone,email,salary) values ($1,$2,$3,$4,$5)",[name,designation,phone,email,salary]);
        await db.query("Insert into address (housename,pincode,state,city) values ($1,$2,$3,$4)",[house,pincode,state,city]);
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