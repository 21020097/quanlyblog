const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/database');
const string_of_renderfile_user_profile = require('../fs/user_profile');

router.get('/write',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(!isAdmin)
        {
            res.render('user_write');
        }else res.redirect('http://localhost:8080/login');
    }else res.redirect('http://localhost:8080/login');
})

router.post('/saveblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var email = verify(tokenKey,'secret').email;
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(!isAdmin)
        {
            const {title,content} = req.body;
            db.query("SELECT * FROM blog WHERE title = ?",[title],(error,resuft)=>{
                if(resuft.length>0)
                {
                    return res.render('user_write',{message : 'Tiêu đề này đã được thêm vào trước đây mới bạn đặt lại tiêu đề'})
                }

                db.query("INSERT INTO blog SET ?",{email:email,title:title,content:content},(error,resuft)=>
                {
                    return res.redirect('http://localhost:8080/homepage/user');
                })
            })
        }else res.redirect('http://localhost:8080/login');
    }else res.redirect('http://localhost:8080/login');
});

router.get('/profile',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var email = verify(tokenKey,'secret').email;
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(!isAdmin)
        {
            var html = "";
            db.query("SELECT * FROM blog WHERE email = ?",[email],(error,resuft)=>{
                for(var ob of resuft) html = html + 
                `<button class="accordion">${ob.title}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`
                return res.send(string_of_renderfile_user_profile.left+ html + string_of_renderfile_user_profile.right);
            })
        }else res.redirect('http://localhost:8080/login');
    }else res.redirect('http://localhost:8080/login');
})

module.exports=router;