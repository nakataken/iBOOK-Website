const Sequelize = require("sequelize");
var SequelizeAuto = require('sequelize-auto-models')

const sequelize = new Sequelize("ebookasyon_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
      decimalNumbers: true
  }
});

var auto = new SequelizeAuto('ebookasyon_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  directory: false, // prevents the program from writing to disk
  port: '3306',
  additional: {
    timestamps: false,
    typescript: true
  },
  tables: ['books_table', 'admin_table', 'users_table', 'cart_items_table', 'cart_table', 'sessions']

})


module.exports = sequelize;