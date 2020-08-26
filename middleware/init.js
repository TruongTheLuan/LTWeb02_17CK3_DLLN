module.exports = function(req, res, next){

    res.locals.currentUser = req.session.user || req.cookies['user'];
    req.currentUser = req.session.user || req.cookies['user'];
    return next();
}