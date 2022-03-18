const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/database');
const string_of_renderfile_admin_profile = require('../fs/admin_profile');

router.get('/write',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(isAdmin)
        {
            res.render('admin_write');
        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.post('/saveblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var email = verify(tokenKey,'secret').email;
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(isAdmin)
        {
            const {title,content} = req.body;
            db.query("SELECT * FROM blog WHERE title = ?",[title],(error,resuft)=>{
                if(resuft.length>0)
                {
                    return res.render('admin_write',{message : 'Tiêu đề này đã được thêm vào trước đây mới bạn đặt lại tiêu đề'})
                }

                db.query("INSERT INTO blog SET ?",{email:email,title:title,content:content},(error,resuft)=>
                {
                    return res.redirect('/homepage/admin');
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
        if(isAdmin)
        {
            var html = "";
            db.query("SELECT * FROM blog WHERE email = ?",[email],(error,resuft)=>{
                for(var ob of resuft) html = 
                `<button class="accordion">${ob.title}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`+html
                return res.send(string_of_renderfile_admin_profile.left+ `Các bài viết của ${email}` + html + string_of_renderfile_admin_profile.right);
            })
        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.get('/deleteblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(isAdmin)
        {
            return res.render('admin_deleteblog');
        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.post('/resaveblog',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        var email = verify(tokenKey,'secret').email;
        if(isAdmin)
        {
            var {title} = req.body;

            db.query('SELECT * FROM blog WHERE title = ?',[title],(err,resuft)=>{
                if(resuft.length <= 0)
                {
                    return res.render('admin_deleteblog',{message : 'Không tồn tại bài viết có tiêu đề như thế'});
                }

                db.query('DELETE FROM blog WHERE title = ?',[title],(err,resuft)=>{
                    if(err) console.log(err);
                });
                return res.render('admin_deleteblog',{message : 'Bạn đã xóa bài viết thành công!'});
            })

        }else res.redirect('/login');
    }else res.redirect('/login');
})

router.post('/lock',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        var emailadmin = verify(tokenKey,'secret').email;
        if(isAdmin)
        {
            var {email} = req.body;
            console.log(email);
            db.query('SELECT * FROM users WHERE email = ?',[email],(err,resuft)=>{
                if(resuft.length <= 0)
                {
                    return res.render('admin_manage',{message : 'Không tồn tại email này'});
                }

                if(resuft[0].email==emailadmin)
                {
                    return res.render('admin_manage',{message : 'Bạn không thể hủy tài khoản này'});
                }

                db.query(`UPDATE users SET isBan = 'lock' WHERE email = '${email}'`,(err,resuft)=>{
                    if(err) console.log(err);
                });
                return res.render('admin_manage',{message : `Bạn đã khóa user ${email}!`});
            })

        }else res.redirect('/login');
    }else res.redirect('/login');
});

router.post('/unlock',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(isAdmin)
        {
            var {email} = req.body;

            db.query('SELECT * FROM users WHERE email = ?',[email],(err,resuft)=>{
                if(resuft.length <= 0)
                {
                    return res.render('admin_manage',{message : 'Không tồn tại email này'});
                }

                db.query(`UPDATE users SET isBan = 'unlock' WHERE email = '${email}'`,(err,resuft)=>{
                    if(err) console.log(err);
                });
                return res.render('admin_manage',{message : `Bạn đã mở khóa user ${email}!`});
            })

        }else res.redirect('/login');
    }else res.redirect('/login');
});

router.get('/manageuser',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        var isAdmin = verify(tokenKey,'secret').isAdmin;
        if(isAdmin)
        {
            return res.render('admin_manage');
        }else res.redirect('/login');
    }else res.redirect('/login');
})

module.exports=router;