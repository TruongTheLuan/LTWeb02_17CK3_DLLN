const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');

const thamsos = require('./thamsos');
const support_ = require('./support_');
// Quản lý các tài khoản:
// Số tài khoản (duy nhất trong một ngân hàng)
// Số dư
// Đơn vị tiền tệ: VND/USD
// Lịch sử giao dịch: Theo khoảng thời gian được yêu cầu
// Tình trạng: đóng/mở
// Lãi suất/năm (TKTK)
// Ngày mở
// Ngày đóng (TKTK)
// Kỳ hạn (TKTK)

class TaiKhoanTietKiem extends Model {
    static async findAccountById(id) {
        return TaiKhoanTietKiem.findByPk(id);
    }

    static async closeTKTK(SoTaiKhoan){
        return await TaiKhoanTietKiem.destroy({
          where: {
            SoTaiKhoan
          }
        });
      }

    static async findAccountBySoTaiKhoan(SoTaiKhoan) {
        return TaiKhoanTietKiem.findOne({
            where: {
                SoTaiKhoan
            }
        });
    }

    static async findAccountForKH(MaKhachHang) {
        return TaiKhoanTietKiem.findOne({
            where: {
                MaKhachHang
            }
        })
    }
    

    //HT1: Gửi Tiết Kiệm Có Kì Hạn - Dùng Vốn Và Lời Để Đáo Hạn - tích lãi vào tài khoản gốc
    static async guiTietKiemHT1(SoTaiKhoan, KyHan, TienGuiVaoMoi){
        let TaiKhoan = await this.findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanTietKiem.update({
            TienGuiVao : TaiKhoan.TienGuiVao + TienGuiVaoMoi + TaiKhoan.TienLaiToanBo,
            TienLaiToanBo: 0.0,
            KyHan
        },{
            where :{
                SoTaiKhoan
            }
        })
    }

    //HT2: Gửi Tiết Kiệm có Kì Hạn - Rút Lời Về Tài Khoản Chính Gửi Tiếp Vốn (vốn + tiền gửi vào)
    static async guiTietKiemHT2(SoTaiKhoan, KyHan, TienGuiVaoMoi ){
        let TaiKhoan = await findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanTietKiem.update({
            TienGuiVao : TaiKhoan.TienGuiVao + TienGuiVaoMoi,
            TienLaiToanBo: 0.0,
            KyHan
        },{
            where :{
                SoTaiKhoan
            }
        })
    }
    //HT3: Rút Cả Vốn Lẫn lời về tài khoản 
    static async guiTietKiemHT3(SoTaiKhoan, KyHan, TienGuiVaoMoi ){
        return await TaiKhoanTietKiem.update({
            TienGuiVao : TienGuiVaoMoi,
            TienLaiToanBo: 0.0,
            KyHan
        },{
            where :{
                SoTaiKhoan
            }
        })
    }
    

    static async findAllAccount(){
        return TaiKhoanTietKiem.findAll();
    }

    static async findAllAccountBySTK(SoTaiKhoan){
        return TaiKhoanTietKiem.findAll({
            where: {
                SoTaiKhoan
            }
        });
    }

    static async findAllNotLocked(){
        return TaiKhoanTietKiem.findAll({
            where: {
                isLocked : false
            }
        });
    }

    static async findAllAccountNotLockedForKH(MaKhachHang) {
        return TaiKhoanTietKiem.findAll({
            where: {
                MaKhachHang,
                isLocked: false
            }
        })
    }
    //cập nhật lãi suất dựa trên hình thức gửi tiết kiệm
    static async updateLaiSuat(MaKhachHang, LaiSuat){
        return await TaiKhoanTietKiem.update({
            LaiSuat
        },{
            where: {
                MaKhachHang
            }
        })
    }
    /*
        //giảm kì hạn
        //tính lãi
        //thêm vào tiền lời
    */
    //giảm kì hạn -1
    static async giamKyHan(SoTaiKhoan){
        let TaiKhoan = await findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanTietKiem.update({
            KyHan: Number(TaiKhoan.KyHan - 1)
        },{
            where:{
                SoTaiKhoan
            }
        })
    }
    //tính lãi -2
    static async tinhLai(SoTaiKhoan){
        let TaiKhoan = await this.findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanTietKiem.update({
            TienLoi:  Number(( TaiKhoan.TienGuiVao * TaiKhoan.LaiSuat ) / 100)
        },{
            where:{
                SoTaiKhoan
            }
        });
    }
    //thêm vào tiền lời -3
    static async tinhTienLoi(SoTaiKhoan){
        let TaiKhoan = await this.findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanTietKiem.update({
            TienLaiToanBo: Number(TaiKhoan.TienLaiToanBo + TaiKhoan.TienLoi)
        },{
            where:{
                SoTaiKhoan
            }
        });
    }


    static async add(SoTaiKhoan, TienGuiVao, DonViTienTe, NgayMo, 
                    KyHan, LoaiHinhThuc, TenLoaiHinhThuc,
                    MaKhachHang ) {
            let thamso = await thamsos.findAll();
            return TaiKhoanTietKiem.create({
                SoTaiKhoan,
                TienGuiVao,
                DonViTienTe,
                NgayMo,
                NgayDong : new Date(NgayMo.getFullYear() + thamso[0].NgayDong, NgayMo.getMonth(), NgayMo.getDate()),
                KyHan,
                LichSuGiaoDich : MaKhachHang,
                LoaiHinhThuc,
                TenLoaiHinhThuc,
                MaKhachHang
            });
    }
    static async updateTaiKhoanTK(DonViTienTe, LoaiHinhThuc, SoTaiKhoan){
        return await TaiKhoanTietKiem.update({
            DonViTienTe,
            LoaiHinhThuc,
            TenLoaiHinhThuc : support_.getTenHinhThuc(LoaiHinhThuc)
        },{
            where :{
                SoTaiKhoan
            }
        });
    }
}
TaiKhoanTietKiem.init({
    SoTaiKhoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    TienGuiVao :{
        type: Sequelize.FLOAT,
        allowNull: false
    },

    TienLaiToanBo :{
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
    },
    TienLoi: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
    },
    DonViTienTe: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isLocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    LaiSuat: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
    },

    NgayMo: {
        type: Sequelize.DATE,
    },
    NgayDong: {
        type: Sequelize.DATE,
    },

    KyHan: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },

    LichSuGiaoDich: {
        type: Sequelize.INTEGER
    },

    LoaiHinhThuc:{
        type: Sequelize.INTEGER,
    },

    TenLoaiHinhThuc:{
        type: Sequelize.STRING,    
    },

    //this is foreign key
    MaKhachHang: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, { sequelize: db, modelName: 'taikhoantietkiems' });

module.exports = TaiKhoanTietKiem;