
const mysql=require('mysql');
const dp = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pass: '',
    database: 'manage_blog',
})

dp.connect(()=>console.log('Connected database!'));

module.exports = dp;