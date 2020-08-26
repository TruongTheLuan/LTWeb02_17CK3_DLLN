const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
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

class TaiKhoanThanhToan extends Model {
    static async findAccountById(id) {
        return TaiKhoanThanhToan.findByPk(id);
    }

    static async findAllAccount(){
        return TaiKhoanThanhToan.findAll();
    }
     
    static async lockedAccount(SoTaiKhoan){
        return await TaiKhoanThanhToan.update({
            isLocked: true
        },{
            where:{
                SoTaiKhoan
            }
        });
    }

    static async findAllAccountBySTK(SoTaiKhoan){
        return TaiKhoanThanhToan.findAll({
            where: {
                SoTaiKhoan
            }
        });
    }

    static async add(SoTaiKhoan, SoDu, DonViTienTe, NgayMo , MaKhachHang ){
        return TaiKhoanThanhToan.create({
            SoTaiKhoan,
            SoDu,
            DonViTienTe,
            NgayMo,
            LichSuGiaoDich: MaKhachHang,
            MaKhachHang
        });       
    }

    static async updateSoTien(SoTaiKhoan, SoTien){
        let TaiKhoan = await this.findAccountBySoTaiKhoan(SoTaiKhoan);
        return await TaiKhoanThanhToan.update({
            SoDu: Number(TaiKhoan.SoDu - SoTien)
        },{
            where: {
                SoTaiKhoan
            } 
        });
    }

    static async findAccountBySoTaiKhoan(SoTaiKhoan){
        return TaiKhoanThanhToan.findOne({
            where: {
                SoTaiKhoan
            }
        });
    }
    //tìm toàn bộ account theo mã khách hàng
    static async findAllAccountForKH(MaKhachHang){
        return TaiKhoanThanhToan.findAll({
            where: {
                MaKhachHang
            }
        })
    }
    //tìm toàn bộ account không bị khóa
    static async findAllAccountNotLockedForKH(MaKhachHang){
        return TaiKhoanThanhToan.findAll({
            where :{
                MaKhachHang,
                isLocked: false
            }
        })
    }
    //tìm account bằng mã khách hàng
    static async findAccountByMaKhachHang(MaKhachHang){
        return TaiKhoanThanhToan.findOne({
            where :{
                MaKhachHang,
            }
        })
    }

    //cộng lời vào tài khoản thanh toán
    static async CongLai(SoTaiKhoan, SoTienMoi){
        
        return await TaiKhoanThanhToan.update({
            SoDu: Number(SoTienMoi)
        },{
            where: {
                SoTaiKhoan
            } 
        });
    }

}   
TaiKhoanThanhToan.init({
  SoTaiKhoan: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  SoDu: {
      type: Sequelize.FLOAT,
      allowNull: false
  },
  DonViTienTe: {
      type: Sequelize.STRING,
      allowNull: false,
  },
  isLocked:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
  },
  NgayMo: {
      type: Sequelize.DATE,
  },

  LichSuGiaoDich :{
      type: Sequelize.INTEGER
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
},{ sequelize: db, modelName: 'taikhoanthanhtoans' });

module.exports = TaiKhoanThanhToan;