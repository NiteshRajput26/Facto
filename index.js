const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/facto");

const express = require("express");
const app = express();

// app.set('view engine','ejs');
// app.set('views','./views/users')

//for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute);


app.listen(3002,function(){
    console.log("Server is running ...")
});