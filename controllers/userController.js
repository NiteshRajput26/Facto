const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");


const securePassword = async(password)=>{
   try {
    const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;
   } catch (error) {
    console.log(error.messgae);
   }
}

//for senting mail
const sendVerifyMail = async(name, email, user_id)=>{
  
try {
  
  const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:586,
    secure:false,
    requireTLS:true,
    auth:{
      user:'email',
      pass:''
      
    }
  });

  const mailOptions = {
    from:'',
    to:email,
    subject:'For verification email',
    html:'<p>Hii '+name+',check kro tumko mail aaya h ky maine nodejs se bheja h nd click here <a href="http://localhost:3002/register/verify?id='+user_id+'"> Verify</a>your mail.</p>'
  }
   transporter.sendMail(mailOptions, function(error,info){
      if(error){
        console.log(error);
      }
      else{
        console.log("Email has been sent-", info.response);
      }
   })
} catch (error) {
  console.log(error.meaasge);
}
}


const loadRegister = async(req,res)=>{
  try{
    res.render('registration.ejs')
  } catch(error){
    console.log(error.message);

  } 
}

const insertUser = async(req,res)=>{
  try{
    const spassword = await securePassword(req.body.password);
   const user = new User({
     name:req.body.name,
     email:req.body.email,
     mobile:req.body.mno,
     image:req.file.filename,
     password:spassword,
     is_admin:0
     
    })
    const userData = await user.save();
    if(userData){
      sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.render('registration',{message: "your registration successed, verify your email"})
    }
    else{
      res.render('registration',{message:"your registration not successed"})
    }
  }catch(error){
    console.log(error.message);
  }
}

const verifyMail = async()=>{
  try {
    
   const updateInfo =  User.updateOne({_id:req.query.id}, {$set:{is_verified:1}});
   console.log(updateInfo);
   res.render("email-verified");

  } catch (error) {
    console.log(error.message)
  }
}

//login user session method
const loginload = async(req,res)=>{
  try {
    res.render('login');
  } catch (error) {
    console.log(error.message);
  }
}

const verifyLogin = async(req,res)=>{
  try {
    
    const email = req.body.email;
    const password = req.body.password;

   const userData=  await User.findOne({email:email});
   if(userData){
    
    const passwordMatch = bcrypt.compare(password, userData.password);
    if(passwordMatch){

      if(userData.is_verified === 0){
      res.render('login',{message:"please verify your email"});
      }
      else{
       req.session.user_id = userData._id;
       res.redirect('/home');
      // res.render('home');
      }

    }
else{
  res.render('login',{message:"Email & password incorrect"})
}

   }else{
     res.render('login',{message:"Email & password incorrect"})
   }

  } catch (error) {
    console.log(error.meaasge);
  }
}

const loadHome = async(req,res)=>{
  try {
    res.render('home');
  } catch (error) {
    console.log(error.meaasge);
  }
}

const userLogout = async(req,res)=>{
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    console.log(error.meaasge);
  }
}

const verificationload = async(req,res)=>{
  try {
    res.render('verification');
  } catch (error) {
    console.log(error.meaasge);
  }
}

const sentverification = async(req,res)=>{
  try {
    
    const email= req.body.email;
    const userData= User.findOne({email: email});
    if(userData){
     sendVerifyMail(userdata.name, userData.email,userData._id );
     res.render("/verification",{message: "Verification link has been sent to ur email"});
    }
    else{
      res.render("/verification", {message:"This email is incorrect"});
    }

  } catch (error) {
    console.log(error.meaasge);
  }
}

module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginload,
    verifyLogin,
    loadHome,
    userLogout,
    verificationload,
    sentverification
}