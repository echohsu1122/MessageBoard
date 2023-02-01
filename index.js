//建立資料庫連線
const mongo =require("mongodb");
const uri="mongodb+srv://root:root123@cluster0.ftav2x1.mongodb.net/?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri);
let db =null;
client.connect(async function(err){
    if(err){
        console.log("db fail",err);
        return;
    }
    db =client.db("message-board");
    console.log("資料庫連線成功")
})

//後端:建立網站伺服器基礎設定
const express=require("express");
const app =express();
const session = require("express-session");
app.use(session({
    secret:"anything",
    resave:false,
    saveUninitialized:true
}))
app.set("view engine","ejs");
app.set("views",'./views');
app.use(express.static("public"));
//處理POS方法傳遞進來的參數
app.use (express.urlencoded({extended:true}));

//建立需要的路由
app.get("/",async function(req,res){
    const collection = db.collection("messages");
    let result = await collection.find({});
    let data = [];
    await result.forEach(function(messages){
        data.push(messages);
    });
    res.render("index.ejs",{data:data});
    
});
app.post("/w",async function(req,res){
    const name =req.body.name;
    const message= req.body.message;
    const date = new Date().toLocaleString();
    const collection = db.collection("messages");
    result = await collection.insertOne({
        name:name,message:message,date:date
    });
    res.redirect("/");
    
});


//http://localhost:3000/
app.listen(3000,function(){
    console.log("伺服器啟動");
})