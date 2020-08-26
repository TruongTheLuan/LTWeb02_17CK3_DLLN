const asyncHandler = require('express-async-handler');

//Middleware
module.exports = asyncHandler(async function auth(req, res, next){
    //tim user qua session hoac cookie
    let user = req.session.user || req.cookies['user'];
    res.locals.currentUser = null;
    //neu khong co user trong session thi quay ve login
    if(!user)
        return res.redirect('/login');
    
    //neu co thi di tiep 
    req.currentUser = user;
    res.locals.currentUser = user;
   
    next();
});