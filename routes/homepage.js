const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();
const db = require('../database/database');
const render_homepage = require('../fs/user_homepage');
const render_homepage_admin = require('../fs/admin_homepage');

router.get('/admin',(req,res)=>
{
    const tokenKey = req.session.tokenKey;
    if(tokenKey)
    {
        const {email,isAdmin} = verify(tokenKey,'secret');
        if(isAdmin)
        {
            db.query('SELECT * FROM blog',(err,resulf)=>{
                let html = "";
                for(var ob of resulf) html=
                `<button class="accordion">${ob.title} - ${ob.email}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`+html;
                return res.send(render_homepage_admin.left+html +render_homepage_admin.right);
            })
        }
        else res.redirect('/login');
    }
    else res.redirect('/login');
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
                for(var ob of resulf) html=
                `<button class="accordion">${ob.title} - ${ob.email}</button>
                <div class="panel">
                  <p>${ob.content}</p>
                </div>`+html;
                return res.send(render_homepage.left+html +render_homepage.right);
            })
        }
        else res.redirect('/login');
    }
    else res.redirect('/login');
});


module.exports = router;