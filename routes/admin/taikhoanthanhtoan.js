const {
    Router
} = require('express');
const asyncHandler = require('express-async-handler');

const taikhoanthanhtoans = require('../../services/taikhoanthanhtoans');
const user = require('../../services/users');
const giaodich = require('../../services/giaodichs');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/', asyncHandler(async (req, res) => {
    let curr = req.session.user || req.cookies['user'];
    let taikhoans = await taikhoanthanhtoans.findAllAccount();
    res.render('admin/taikhoanthanhtoan', {
        taikhoans: taikhoans,
        currentUser: curr
    });
}));
//locked tài khoản
router.post('/lock', asyncHandler(async (req, res) => {
    await taikhoanthanhtoans.lockedAccount(req.body.stk);
    res.redirect('back');
}));

router.post('/open', asyncHandler(async (req, res) => {
    await taikhoanthanhtoans.unlockedAccount(req.body.stk);
    res.redirect('back');
}));

router.get('/rut-tien/:sotaikhoan', asyncHandler(async (req, res) => {

    let curr = req.session.user || req.cookies['user'];
    res.render('admin/taikhoanthanhtoan_edit', {
        currentUser: curr,
        sotaikhoan: req.params.sotaikhoan,
        errors: ""
    });
}));

router.post('/rut-tien', asyncHandler(async (req, res) => {
    
    
    let account_thanhtoan = await taikhoanthanhtoans.findAccountBySoTaiKhoan(req.body.sotaikhoan);

    let money = req.body.money;
    //chuyển đổi tỉ giá
    if (req.body.donvi != account_thanhtoan.DonViTienTe) {
        //cập nhật hình thức, kì hạn, số tiền
        //donvi = USD => account = VND
        if (req.body.donvi == "USD") {
            money = money * thamso[0].TiGiaUSD;
        } else {
            money = money / thamso[0].TiGiaUSD;
        }
    }
    await taikhoanthanhtoans.rutTienTuTaiKhoan(req.body.sotaikhoan, account_thanhtoan.SoDu - money);
    res.redirect('/admin/account/tai-khoan-thanh-toan');
}));



//add 
router.get('/them-moi', (req, res) => {
    let curr = req.session.user || req.cookies['user'];
    res.render('admin/taikhoanthanhtoan_add', {
        currentUser: curr,
        errors: ""
    });
});

router.post('/them-moi', asyncHandler(async (req, res) => {
    let user_add = await user.findUserById(req.body.MaKhachHang);
    let curr = req.session.user || req.cookies['user'];
    let account_user = await taikhoanthanhtoans.findAccountByMaKhachHang(req.body.MaKhachHang);
    if (!user_add) {
        return res.render('admin/taikhoanthanhtoan_add', {
            currentUser: curr,
            errors: "Khách Hàng Này Chưa Đăng Kí Tài Khoản Tại Ngân Hàng"
        });
    }
    if (account_user) {
        return res.render('admin/taikhoanthanhtoan_add', {
            currentUser: curr,
            errors: "Khách Hàng Này Đã Tạo 1 Tài Khoản Tại Ngân Hàng"
        });
    }
    //thêm tài khoản
    let taikhoanthanhtoan = await taikhoanthanhtoans.add(user_add.STK, req.body.money, req.body.donvi, new Date(), req.body.MaKhachHang);
    //cập nhật lịch sử giao dịch
    await giaodich.add(taikhoanthanhtoan.SoTaiKhoan, req.body.money, 0, 3, new Date(),req.body.donvi);
    return res.redirect('/admin/account/tai-khoan-thanh-toan');
}));

router.post('/tim-kiem',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let taikhoans = await taikhoanthanhtoans.findAllAccountBySTK(req.body.sotaikhoan);

    res.render('admin/taikhoanthanhtoan',{currentUser: curr, taikhoans: taikhoans});
}));


module.exports = router;