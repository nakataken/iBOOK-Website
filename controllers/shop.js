const mysql = require("mysql");
const Cart = require('./cart');
const models = require('../models/index');
const authController = require('../controllers/auth');

//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//CHECKOUT THROUGH GCASH
exports.checkoutGcash = async (req, res, next) => {
    //previouscode //var params = [req.params.arr].concat(req.params[0].split('/').slice(1));
    //debugged code
    var params=[];
    params = req.params[0].split('/');
    params[0] = req.params.arr.concat(params[0]);
    //console.log(req.params)
    //console.log(req.params[0])
    //console.log(req.params.arr)
    //console.log(params)
    console.log("USER: ")
    console.log(req.user)

    const gcash = req.body.gcashNum;
    const userID = req.params.userID;
    const mop = 'Gcash';


    if ((!gcash.match(/^(09)/)) || (isNaN(gcash))) {
        var cart = new Cart(req.session.cart);

        res.redirect('/check-out/error/gcash')
    } else {
        var datetime = new Date();
        var cart = new Cart(req.session.cart);

        db.query('INSERT INTO checkout_table SET ?', {
            USER_ID: userID,
            PAYMENT_METHOD: mop,
            PAYMENT_AMOUNT: cart.totalPrice,
            PAYMENT_DATE: datetime
        }, (error, results) => {
            if (error) {
                console.log(error);
            } else {

                for (var i = 0; i < (params.length)-1; i++) {

                    var checkoutInput = {
                        USER_ID: userID,
                        BOOK_ID: params[i],
                        PAYMENT_DATE: datetime
                    }

                    var sqlInput = 'INSERT INTO checkout_items_table SET ?';
                    db.query(sqlInput, [checkoutInput], function (err, result) {
                        if (err) throw err;

                        var sql = 'UPDATE checkout_items_table, checkout_table SET checkout_items_table.CHECKOUT_ID = checkout_table.CHECKOUT_ID WHERE checkout_items_table.PAYMENT_DATE = checkout_table.PAYMENT_DATE';
                        db.query(sql, function (err, result) {
                            if (err) throw err;
                        })
                    })
               }
                    req.session.cart = null;
                    req.flash('success', 'You may now read the book.')
                    res.redirect('/library')
                    //req.flash('success', 'Your purchase is successful! Check the book on your library.')
                    //res.render('confirmation', {
                    //    user: req.user
                    //});
        }

    })

}
}
//CHECKOUT THROUGH CARD
exports.checkoutCard = async (req, res, next) => {
    //var params = [req.params.arr].concat(req.params[0].split('/').slice(1));
    var params=[];
    params = req.params[0].split('/');
    params[0] = req.params.arr.concat(params[0]);
    
    const cardName = req.body.cardName;
    const cardNum = req.body.cardNum;
    const cardSec = req.body.cardCCV;
    const expMonth = req.body.expMonth;
    const expYear = req.body.expYear;
    const userID = req.params.userID;
    const mop = 'Debit/Credit Card';

    var alphabet = /^[A-Za-z\s]+$/;


    if ((!alphabet.test(cardName)) || (isNaN(cardNum)) || (isNaN(cardSec))) {
        var cart = new Cart(req.session.cart);
        res.redirect('/check-out/error/card')

    } else {
        var datetime = new Date();
        var cart = new Cart(req.session.cart);

        db.query('INSERT INTO checkout_table SET ?', {
            USER_ID: userID,
            PAYMENT_METHOD: mop,
            PAYMENT_AMOUNT: cart.totalPrice,
            PAYMENT_DATE: datetime
        }, (error, results) => {
            if (error) {
                console.log(error);
            } else {

                for (var i = 0; i < (params.length)-1; i++) {

                    var checkoutInput = {
                        USER_ID: userID,
                        BOOK_ID: params[i],
                        PAYMENT_DATE: datetime
                    }

                    var sqlInput = 'INSERT INTO checkout_items_table SET ?';
                    db.query(sqlInput, [checkoutInput], function (err, result) {
                        if (err) throw err;

                        var sql = 'UPDATE checkout_items_table, checkout_table SET checkout_items_table.CHECKOUT_ID = checkout_table.CHECKOUT_ID WHERE checkout_items_table.PAYMENT_DATE = checkout_table.PAYMENT_DATE';
                        db.query(sql, function (err, result) {
                            if (err) throw err;
                        })
                    })
               }
                    req.session.cart = null;
                    req.flash('success', 'You may now read the book.')
                    res.redirect('/library')
                    //req.flash('success', 'Your purchase is successful! Check the book on your library.')
                    //res.render('confirmation', {
                    //    user: req.user
                    //});
                    //req.flash('success', 'Your purchase is successful! Check the book on your library.')
                    //res.redirect('/userProfile');
        }

    })

}
}

//DECREASE QUANTITY
exports.reduceQuantity = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}

//INCREASE QUANTITY
exports.increaseQuantity = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addByOne(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}

//ADD SELECTED BOOK
exports.addSelected = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addSelected(bookID);
    req.session.cart = cart;
    res.render('cartPage', {
        book: cart.generateArray(),
        totalPrice: cart.totalPrice
    });
}

//REMOVE BOOKS FROM THE CART
exports.remove = async (req, res, next) => {
    const bookID = req.params.bookID;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(bookID);
    req.session.cart = cart;
    res.redirect('/cart');
}


//ADD TO CART 
exports.searchAdd = async (req, res, next) => {
    // DEBUGGED:
    //  Is online?
    
    if (req.user) {

        const userID = req.user.USER_ID;
        const bookID = req.params.bookID;
        const searchBook = req.params.title;
        console.log(searchBook)
        db.query('SELECT DISTINCT BOOK_ID FROM checkout_items_table WHERE USER_ID = ?', [userID], (error, result) => {
            if (error) {
                throw error;
            } else {
                let isExist = false;
                result.forEach((id) => {
                    if (bookID == id.BOOK_ID) {
                        isExist = true;
                    }
                })

                // Check if book already in the library
                if (isExist == true){
                    req.flash('info', 'You already have it on your library.')
                    db.query('SELECT * FROM books_table WHERE BOOK_TITLE LIKE ? ORDER BY BOOK_TITLE', ['%' + searchBook + '%'], async (error, data) => {

                     
                            res.render('searchBooks', {
                                title: searchBook,
                                bookData: data,
                                user: req.user
                            });
                
                        
                    })
                } else {
                    const cart = new Cart(req.session.cart ? req.session.cart : {});
                    console.log(bookID);
                    models.books_table.findByPk(bookID).then(book => {

                        //console.log(book);
                        cart.add(book, book.BOOK_ID);
                        req.session.cart = cart;
                        console.log(req.session.cart)
                        db.query('SELECT * FROM books_table WHERE BOOK_TITLE LIKE ? ORDER BY BOOK_TITLE', ['%' + searchBook + '%'], async (error, data) => {


                                res.render('searchBooks', {
                                    title: searchBook,
                                    bookData: data,
                                    user: req.user
                                });
                    
                            
                        })
                    })
                }
            }
        });
    } else {
        res.redirect('/userLoginPage');
    }
    // Previous Code
    /*const cart = new Cart(req.session.cart ? req.session.cart : {});
    console.log(bookID);
    models.books_table.findByPk(bookID).then(book => {

        //console.log(book);
        cart.add(book, book.BOOK_ID);
        req.session.cart = cart;
        console.log(req.session.cart)
        res.redirect('back')
    })*/
}
