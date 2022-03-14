const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();

router.get('/myHomePage',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    console.log(tokenKey);
    if(tokenKey)
    {
        res.render('myHomePage',{message : verify(tokenKey,'secret').email});
    }
    else res.redirect('http://localhost:8080/login');
});

router.get('/logout',(req,res)=>
{
    req.session.destroy();
    res.redirect('http://localhost:8080/login');
});
module.exports = router;