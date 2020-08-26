const asyncHandler = require('express-async-handler');

//Middleware
module.exports = asyncHandler(async function auth(req, res, next){
    let user = req.session.user || req.cookies['user'];
    res.locals.currentUser = null;
   //neu k co user thi quay ve login
   //neu co thi kiem tra user do co la admin k neu k quay ve trang chu
    if(!user)
        return res.redirect('/login');
    else
        if(user.role != 1)
            return res.redirect('/');
        else {
            next();
        }
});