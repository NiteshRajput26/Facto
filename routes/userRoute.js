const express = require("express");
const user_route =express();
const session = require("express-session");
// user_route.use(session({secret:}))

const config = require('../config/config');
user_route.use(session({secret:config.sessionSecret}));


user_route.set('view engine','ejs');
user_route.set('views','./views/users')

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination:function(req,file,cb){
     cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
     const name = Date.now()+'-'+file.originalname;
     cb(null,name);
    }
});

const auth= require('../middleware/auth');

const upload = multer({storage : storage});

const userController = require('../controllers/userController');

// user_route.get('/register',userController.loadRegister);
user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser)

user_route.get('/verify',userController.verifyMail);

user_route.get('/login',auth.isLogout, userController.loginload);

user_route.get('/',auth.isLogout,userController.loginload)

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin, userController.userLogout);

user_route.get('/verification', userController.verificationload);

user_route.post('/verification', userController.sentverification);

module.exports=user_route;