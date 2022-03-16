const express = require('express');
const router = express.Router();
const db = require('../database/database');
const hashing = require('../database/hashing');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');

router.post('/register',(req,res) =>{
    const {email,password,passwordcomfirm} = req.body;
    db.query('SELECT email FROM users WHERE email = ?',[email],async (error,result)=>{
        if(error) console.log(error);
        if(result.length > 0) return res.render('register',{message:'Email đã được sử dụng'});
        if (password!==passwordcomfirm) return res.render('register',{message:'Mật khẩu nhập lại không chính xác'});
        db.query('INSERT INTO users SET?',{email: email,password: hashing.hashpassword(password)});
        return res.render('register',{message:'Bạn đã đăng kí thành công hãy đăng nhập'});
    })
});

router.post('/login',(req,res) =>{
    const {email,password} = req.body;
    db.query('SELECT * FROM users WHERE email = ?',[email],async (error,result)=>
    {
        if(error) console.log(error);
        if(result.length <=0) 
        {
            return res.render('login',{message:'Email không tồn tại'});
        }
        if(!hashing.compare(password,result[0].password)) 
        {
            return res.render('login',{message:"Sai mật khẩu"});
        }
        
        const jsonObject = {email : email,isAdmin : result[0].isAdmin};

        const tokenKey = jwt.sign(jsonObject,'secret',{expiresIn: 8640});

        req.session.tokenKey = tokenKey;
        return res.redirect('http://localhost:8080/myHomePage');
    });
    console.log('done!');
})

module.exports=router;