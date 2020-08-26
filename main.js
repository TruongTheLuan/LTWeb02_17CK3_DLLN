const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./services/db');
var app = express();
var port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');

app.use(session({
    name: 'session',
    secret: 'keyboard cat',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(cookieParser());

app.set('views',__dirname + '/views');
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//phan middleware
app.use(require('./middleware/init'));
//Router
//file index
app.use('/',require('./routes/index'));
//file sign up
app.use('/sign-in', require('./routes/signup'));
//file login
app.use('/login', require('./routes/login'));
//file contact
app.use('/contact', require('./routes/contact'));
//loc tai khoan chua login
app.use(require('./middleware/auth'));
//about me
app.use('/aboutMe', require('./routes/aboutMe'));
//tai khoan tiet kiem
app.use('/savings', require('./routes/savings'));
//tai khoan thanh toan
app.use('/internal', require('./routes/internal'));
//chuyen tien
app.use('/transfer', require('./routes/transfer'));
//lich su giao dich
app.use('/history', require('./routes/history'));
//log out
app.get('/logout',require('./routes/logout'));
//thong tin ca nhan
app.use('/account', require('./routes/account'));

//admin router

app.use('/admin', require('./routes/admin'));
app.use('/admin/cau-hinh', require('./routes/admin/cauhinh'));
app.use('/admin/account/tai-khoan-thanh-toan', require('./routes/admin/taikhoanthanhtoan'));
app.use('/admin/account/tai-khoan-tiet-kiem',require('./routes/admin/taikhoantietkiem'));
app.use('/admin/account/giao-dich',require('./routes/admin/giaodich'));
app.use('/admin/nguoi-dung',require('./routes/admin/nguoidung'));



db.sync().then(function(){
    app.listen(port , (err)=>{
        console.log(`listen at ${port}`);
    });
}).catch(function(err){
    console.log(err);
});