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
app.use('/',require('./routes/index'));
app.use('/sign-in', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/contact', require('./routes/contact'));

app.use(require('./middleware/auth'));

app.use('/aboutMe', require('./routes/aboutMe'));
app.use('/savings', require('./routes/savings'));
app.use('/internal', require('./routes/internal'));
app.use('/transfer', require('./routes/transfer'));
app.use('/history', require('./routes/history'));
app.get('/logout',require('./routes/logout'));
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