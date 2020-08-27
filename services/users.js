const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const crypto = require('crypto');
const Op = Sequelize.Op;

class User extends Model {

  static async findUserById(id){
    return User.findByPk(id);
  }


  static async createToken(id){
   var token = crypto.randomBytes(12).toString('hex').toUpperCase();
   return await User.update({
      token
   },{
      where: {
         id
      }
   })
  }

  static async findUserByUsername(Username) {
    return User.findOne({
       where :{
        Username
       }
    });
  }

  static async findAllUserByUsername(Username){
     return User.findAll({
      where:{
         Username
      }
     });
  }

  static async findAllUserById(id){
     return User.findAll({
      where:{
         id
      }
     });
  }

  static async findUserNotActive(){
     return User.findAll({
         where :{
            isLocked : true,
            token: null
         }
     });
  }
  
  static async findUserInActive(){
   return User.findAll({
       limit:3,
       where :{
          isLocked : false,
          token : null
       }
   });
}

  //mở khóa user sau khi được nhân viên xác nhận
  static async unLockedUser(id){
      return await User.update({
         isLocked : false
      },{
        where:{
               id : id
        }
      });
  }

  static async LockedUser(id){
   return await User.update({
      isLocked : true
   },{
     where:{
            id : id
     }
   });
}

  static async findUserByEmail(email){
      return User.findOne({
          where:{
              email
          }
      });
  }

  static async add(Username,email){
    var password = crypto.randomBytes(8).toString('hex');
    var token = crypto.randomBytes(12).toString('hex').toUpperCase();
    return User.create({Username, email, password, token});
  }

  //chúng ta sẽ xóa các user bị decline bởi admin==>send mail khi user đó bị decline

  static async deleteDeclineUser(id){
    return await User.destroy({
      where: {
         id: id
      }
    });
  }

  static async updateToken(id){
    return await User.update({
        token : null
    },{
        where:{
            id : id
        }
    });
  }

  static getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
   }

  static async updateInfo(id, password, sex, fullname, birth, IDCard, HinhMatTruoc, HinhMatSau,ngaycap, noicap){
    password = this.hashPassword(password);
    return await User.update({
        password : password,
        sex,
        fullname,
        birth,
        IDCard,
        HinhMatTruoc,
        HinhMatSau,
        ngaycap,
        noicap,
        STK : this.getRandomIntInclusive(parseInt(IDCard), 999999999999) // idcard (12 number) => 999999999999
    },{
        where:{
            id : id
        }
    });
  }

  static async updatePassword(id, password){
   password = this.hashPassword(password);
   return await User.update({
      password : password
   },{
      where:{
         id 
      }
   });
  }

  static async updateFullName(id, fullname){
      return await User.update({
         fullname
      },
      {  where:{
            id: id
         }
      });
  }


  static async findUserBySTK(STK){
     return User.findOne({
        where: {
           STK
        }
     });
  }

  static async findHoTenBySTK(STK){
     let user_stk = await this.findUserBySTK(STK);
     return user_stk.fullname;
  }

  static hashPassword(password){
    //using bcrypt
    //nhan ve password goc va chuoi hash
    return bcrypt.hashSync(password, 10); 
  }
  // cái này để kiểm tra
  static verifyPassword(password, passwordIsHash){
      //using bcryt
      return bcrypt.compareSync(password,passwordIsHash);
  }
  //count user
  static countAllUserInActive(){
     return User.count({
        where:{
         isLocked : false,
         token : null
        }
     });
  }

  static countAllUserNotActive(){
   return User.count({
      where:{
       isLocked : true,
       token : null
      }
   });
  }



}
User.init({
   Username:{
     type: Sequelize.STRING,
     allowNull: false
   },
   email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
   },
   password:{
      type: Sequelize.STRING,
   },
   sex:{
      type: Sequelize.BOOLEAN// 0-Nu , 1-Nam
   }, 
   STK:{
      type: Sequelize.STRING,
      unique: true
   },
   fullname: {
      type: Sequelize.STRING
   }, 
   birth: {
      type: Sequelize.DATE
   }, 
   IDCard: {
      type: Sequelize.STRING
   },
   HinhMatTruoc: {
      type: Sequelize.STRING
   },
   HinhMatSau:{
      type: Sequelize.STRING
   },
   ngaycap: {
      type: Sequelize.DATE
   },
   noicap :{
      type: Sequelize.STRING
   },
   isLocked : {
      type: Sequelize.BOOLEAN,
      defaultValue: true
   }, 
   token: {
      type: Sequelize.STRING,
   },
   role: {
      type: Sequelize.INTEGER,
      defaultValue: 0,  //role: 0 => nguoidung, role: 1=> nhanvien
   }
},{ sequelize: db, modelName: 'users' });

module.exports = User;