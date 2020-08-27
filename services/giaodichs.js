const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const support_ = require('./support_');

class GiaoDich extends Model {
   //tim giao dich bang ma giao dich
    static async findGiaoDichByID(id) {
        return GiaoDich.findByPk(id);
    }
    //tim toan bo ma giao dich
    static async findAllGiaoDich(){
        return GiaoDich.findAll({
            order: [
                ['NgayThucHien', 'DESC']
            ],
            }     
        );
    }
    //tim giao dich bang so tai khoan
    static async findGiaoDichBySTK(SoTaiKhoan){
        return GiaoDich.findAll({
            where:{
                SoTaiKhoan
            },
            order: [
                ['NgayThucHien', 'DESC']
            ],
        })
    }
    //them giao dich
    static async add(SoTaiKhoan, SoTienGiaoDich,MaLoaiTaiKhoan, LoaiHinhThuc, NgayThucHien, DonViTienTe){
        return GiaoDich.create({
            SoTaiKhoan,
            SoTienGiaoDich,
            MaLoaiTaiKhoan,
            TenLoaiTaiKhoan : support_.getTenLoaiTaiKhoan(MaLoaiTaiKhoan),
            LoaiHinhThuc,
            TenLoaiHinhThuc: support_.getHinhThucChuyenTien(LoaiHinhThuc),
            NgayThucHien,
            DonViTienTe
        });
    }
    //dem giao dich
    static async countLuotGD(){
       return GiaoDich.count({
        
       });
    }
}   


GiaoDich.init({
  SoTaiKhoan: {
      type: Sequelize.STRING,
      allowNull: false,
  },

  SoTienGiaoDich: {
      type: Sequelize.FLOAT,
      allowNull: false
  },

  MaLoaiTaiKhoan:{
      type: Sequelize.INTEGER, //0-TKTT,1-TKTK
  },

  TenLoaiTaiKhoan:{
      type: Sequelize.STRING, // support_
  },
  //0- Nhận Tiền , 1- Chuyển Tiền Nội Bộ , 2- Chuyển Tiền Liên Ngân Hàng, 3- Tạo tài khoản
  LoaiHinhThuc:{
      type: Sequelize.INTEGER,   
  },

  TenLoaiHinhThuc: {
      type: Sequelize.STRING,  //support_
  },

  NgayThucHien:{
      type: Sequelize.DATE,
  }, 
  DonViTienTe :{
    type: Sequelize.STRING,
    allowNull: false,
  }
},{ sequelize: db, modelName: 'giaodichs' });

module.exports = GiaoDich;