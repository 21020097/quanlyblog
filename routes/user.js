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
        }else res.redirect('/login');
    }else res.redirect('/login');
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
                    return res.redirect('/homepage/user');
                })
            })
        }else res.redirect('/login');
    }else res.redirect('/login');
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
                for(var ob of resuft) html = 
                `<button class="accordion">${ob.title}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`+html;
                return res.send(string_of_renderfile_user_profile.left+ `<h4>Các bài viết của ${email}<\h4>`+ html + string_of_renderfile_user_profile.right);
            })
        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.get('/deleteblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(!isAdmin)
        {
            return res.render('user_deleteblog');
        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.post('/resaveblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        var email = verify(tokenKey,'secret').email;
        if(!isAdmin)
        {
            var {title} = req.body;

            db.query('SELECT * FROM blog WHERE title = ?',[title],(err,resuft)=>{
                if(resuft.length <= 0)
                {
                    return res.render('user_deleteblog',{message : 'Không tồn tại bài viết có tiêu đề như thế'});
                }

                if(resuft[0].email!=email)
                {
                    return res.render('user_deleteblog',{message : 'Bài viết này không phải là của bạn'});
                }
                db.query('DELETE FROM blog WHERE title = ?',[title],(err,resuft)=>{
                    if(err) console.log(err);
                });
                return res.render('user_deleteblog',{message : 'Bạn đã xóa bài viết thành công!'});
            })

        }else res.redirect('/login');
    }else res.redirect('/login');
})

module.exports=router;