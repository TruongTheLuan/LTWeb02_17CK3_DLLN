const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const user = require('../../services/users');
const Email = require('../../services/mail')
const fs = require('fs');
const giaodich = require('../../services/giaodichs');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/index',asyncHandler(async(req, res)=>{
    //danh sách user chưa active
    let userNotActive = await user.findUserNotActive();
    //danh sách user đã active
    let userInActive = await user.findUserInActive();
    //đếm tổng số user
    let tongUser = await user.countAllUserInActive();
    //tổng số user chưa duyệt
    let tongUserChuaDuyet = await user.countAllUserNotActive();
    //tổng số giao dịch được thực hiện
    let tongGiaoDich = await giaodich.countLuotGD();

    let curr = req.session.user || req.cookies['user'];
    res.render('admin/index',{ 
        userNotActive : userNotActive, 
        currentUser: curr, 
        userInActive: userInActive,
        tongUser : tongUser,
        tongUserChuaDuyet: tongUserChuaDuyet,
        tongGiaoDich : tongGiaoDich  });
}));

router.post('/accept', asyncHandler(async(req,res)=>{
    let id = req.body.id;
    await user.unLockedUser(id);
    return res.redirect('back');
}));

router.post('/decline', asyncHandler(async(req,res)=>{
    let id = req.body.id;
    
    //send email to user
    let user_isDecline = await user.findUserById(id);
    await Email.send(user_isDecline.email, `Thông Tin Giấy Tờ Của Quý Khách Không Hợp Lệ ,
                                  Quý Khách Vui Lòng Đăng Kí Lại thông tin khác, hoặc ra chi nhánh DLLN gần nhất để được nhân viên hỗ trợ làm thẻ`);
    
    //xóa hình
    fs.unlink("uploads/" + user_isDecline.HinhMatTruoc,(err)=>{
        throw err;
    });
    fs.unlink("uploads/" + user_isDecline.HinhMatSau,(err)=>{
        throw err;
    });
    await user.deleteDeclineUser(id);
    return res.redirect('back');
}));

module.exports = router;