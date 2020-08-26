//day la file co chuc nang la se inject vao 1 file khac de goi nhung cai trong no

module.exports = function(req, res, next){
	//set current user la session hoac cookie
    res.locals.currentUser = req.session.user || req.cookies['user'];
    req.currentUser = req.session.user || req.cookies['user'];
    return next();
}