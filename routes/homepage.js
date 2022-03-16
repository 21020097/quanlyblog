const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/database');
const render_homepage = require('../fs/user_homepage');


router.get('/admin',(req,res)=>
{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        const verify1= verify(tokenKey,'secret');
        const isAdmin = verify1.isAdmin;
        const email = verify1.email;
        console.log(email);
        if(isAdmin)
        {
            res.render('admin_homepage');
        }
        else res.redirect('http://localhost:8080/login');
    }
    else res.redirect('http://localhost:8080/login');
});

router.get('/user',(req,res)=>
{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        const {email,isAdmin} = verify(tokenKey,'secret');
        if(!isAdmin)
        {
           
            db.query('SELECT * FROM blog',(err,resulf)=>{
                let html = "";
                for(var ob of resulf) html=html+
                `<button class="accordion">${ob.title} - ${ob.email}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`
                return res.send(render_homepage.left+html +render_homepage.right);
            })
        }
        else res.redirect('http://localhost:8080/login');
    }
    else res.redirect('http://localhost:8080/login');
});


router.get('/blog',(req,res)=>
{
    db.query("SELECT * FROM blog",(error,resuft)=>{
        return res.render('public_homepage',{data : resuft});
    })
})

module.exports = router;