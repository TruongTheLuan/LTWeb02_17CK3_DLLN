module.exports = function logout(req, res){
    //xoa session
    req.session.destroy();
    res.clearCookie('user');
    res.redirect('/');
};
// module.exports = function logout(req,res){
//     delete req.session.userId;
//     res.redirect('/');
// };