const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

//TO ACCESS AND BE ABLE TO MODIFY THE CONTENTS OF BOOKS TABLE
class books_table extends Model {}
books_table.init({
		BOOK_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			autoIncrement: true
		},
		BOOK_TITLE: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		BOOK_AUTHOR: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		BOOK_COVER: {
			type: Sequelize.STRING(10000),
			allowNull: false
		},
		BOOK_FILE: {
			type: Sequelize.BLOB('long'),
			allowNull: false
		},
		BOOK_PRICE: {
			type: Sequelize.DECIMAL(50,2),
			allowNull: false
		},
		BOOK_DESC: {
			type: Sequelize.STRING(1000),
			allowNull: false
		},
		BOOK_CATEGORY: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		BOOK_CREATED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		},
		BOOK_MODIFIED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'books_table',
		freezeTableName: true,
		timestamps: false
	}
);


      books_table.associate = (db) => {
        
      };
      module.exports = () =>books_table;
