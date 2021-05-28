const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");
const Cart = require('../controllers/cart');
const models = require('../models/index');


//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: '',
    database: process.env.DATABASE
});

//USER REGISTER PAGE ROUTER
router.get('/userRegisterPage', (req, res) => {
    res.render('userRegisterPage');
})

//USER LOGIN PAGE ROUTER
router.get('/userLoginPage', authController.isLoggedIn, (req, res) => {
    //check if there's a user
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('userLoginPage');
    }
})

//CHECK IF USER IS LOGGED IN
router.get('/', authController.isLoggedIn, (req, res) => {
    var sql = 'SELECT * FROM books_table ORDER BY BOOK_ID DESC LIMIT 8 OFFSET 0 ';
        db.query(sql, function (err, newrelease, fields) {
            var sqlSale = 'SELECT * FROM books_table ORDER BY BOOK_PRICE LIMIT 4 OFFSET 0 ';
                db.query(sqlSale, function (err, onSale, fields) {
                    var sqlRandom = 'SELECT * FROM books_table ORDER BY RAND() LIMIT 4 OFFSET 0 ';
                        db.query(sqlRandom, function (err, random, fields) {
                        if (err) throw err;
                        res.render('index', {
                            user: req.user,
                            newBook: newrelease,
                            sale: onSale,
                            rand: random
                        });
                })    
            })
        })
})

//FORGOT PASSWORD PAGE ROUTER
router.get('/userForgotPassword/:token/:userEmail', (req, res) => {
   // const userEmail = req.params.userEmail;   
    res.render('userForgotPassword', {
        userEmail: req.params.userEmail
     
    });
})

//USER SEND EMAIL FOR PASSWORD PAGE ROUTER
router.get('/userSendEmail', (req, res) => {
    res.render('userSendEmail');
})

//USERS PROFILE PAGE ROUTER
router.get('/userProfile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        const userID = req.user.USER_ID;

        var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
        db.query(sql, [userID], function (err, data, fields) {
            if (err) throw err;

            var sqlLibrary = `SELECT books_table.BOOK_TITLE AS title, 
            books_table.BOOK_COVER AS cover, books_table.BOOK_FILE AS file
            FROM books_table JOIN checkout_items_table ON books_table.BOOK_ID = checkout_items_table.BOOK_ID WHERE checkout_items_table.USER_ID = ?`

            db.query(sqlLibrary, [userID], function (err, books, fields) {
                if (err) throw err;

                res.render('userProfile', {
                    user: req.user,
                    libraryBooks: books,
                    userData: data
                });
            })
        })
    } else {
        res.redirect('/userLoginPage');
    }
})

//USER DEACTIVATE
router.get('/userDeactivate/:userID', (req, res) => {
    const userID = req.params.userID;

    db.query('DELETE FROM users_table WHERE USER_ID = ?', [userID], async (error, data) => {
        if (error) {
            throw error;
        } else {
            res.redirect("/");
        }
    })
})

//CHECK IF ADMIN IS LOGGED IN
router.get('/adminPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) {
        var sql = 'SELECT * FROM books_table LIMIT 10';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(bookTotal, function (err, result) {

                var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
                db.query(usersTotal, function (err, result2) {

                    var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
                    db.query(salesTotal, function (err, result3) {
                        // console.log(result3)
                        // Newly added code
                        let bookNames = "SELECT books_table.book_title FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id"
                        db.query(bookNames, (err, book) => {
                            let bookData = book.map((book) => {
                                return book.book_title;
                            });
                            let bookSales = [];
                            let books = [...new Set(bookData)]

                            for(let i=0; i<books.length; i++) {
                                let sales = 0;
                                for(let j=0; j<bookData.length; j++) {
                                    if(books[i] === bookData[j]) {
                                        sales++;
                                    }
                                }
                                bookSales.push(sales);
                            }

                            for (let i=bookSales.length; i>=0; i--) {
                                for (let j = bookSales.length; j > bookSales.length - i; j--) {
                                    if (bookSales[j] > bookSales[j-1]) {
                                        // Swap orders of sales
                                        let salesSwap = bookSales[j];
                                        bookSales[j] = bookSales[j - 1];
                                        bookSales[j - 1] = salesSwap;
                                        // Swap orders of books
                                        let bookSwap = books[j];
                                        books[j] = books[j - 1];
                                        books[j - 1] = bookSwap;
                                    }
                                }
                            }

                            books = books.slice(0,10);
                            bookSales = bookSales.slice(0,10);

                            if(err) {
                                console.log(err);
                            } else {
                                res.render('adminPage', {
                                    usersCount: result2,
                                    bookData: data,
                                    booksCount: result,
                                    totalSales: result3,
                                    books: encodeURI(JSON.stringify(books)),
                                    bookSales: encodeURI(JSON.stringify(bookSales))
                                });
                            }
                        })
                    });
                });
            });
        })
    } else {
        res.redirect('/adminLoginPage');
    }
});

// almost same code from above, will clean if ever
router.post('/adminSelectChart', authController.adminIsLoggedIn, (req, res) => {
    const {
        selectTop,
    } = req.body;

    if (req.admin) {
        var sql = 'SELECT * FROM books_table LIMIT 10';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(bookTotal, function (err, result) {

                var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
                db.query(usersTotal, function (err, result2) {

                    var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
                    db.query(salesTotal, function (err, result3) {
                        // console.log(result3)
                        // Newly added code
                        let bookNames = "SELECT books_table.book_title FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id"
                        db.query(bookNames, (err, book) => {
                            let bookData = book.map((book) => {
                                return book.book_title;
                            });
                            let bookSales = [];
                            let books = [...new Set(bookData)]

                            for(let i=0; i<books.length; i++) {
                                let sales = 0;
                                for(let j=0; j<bookData.length; j++) {
                                    if(books[i] === bookData[j]) {
                                        sales++;
                                    }
                                }
                                bookSales.push(sales);
                            }

                            for (let i=bookSales.length; i>=0; i--) {
                                for (let j = bookSales.length; j > bookSales.length - i; j--) {
                                    if (bookSales[j] > bookSales[j-1]) {
                                        // Swap orders of sales
                                        let salesSwap = bookSales[j];
                                        bookSales[j] = bookSales[j - 1];
                                        bookSales[j - 1] = salesSwap;
                                        // Swap orders of books
                                        let bookSwap = books[j];
                                        books[j] = books[j - 1];
                                        books[j - 1] = bookSwap;
                                    }
                                }
                            }

                            if(selectTop==3) {
                                books = books.slice(0,3);
                                bookSales = bookSales.slice(0,3);
                            } else if(selectTop==5) {
                                books = books.slice(0,5);
                                bookSales = bookSales.slice(0,5);
                            } else if(selectTop==10) {
                                books = books.slice(0,10);
                                bookSales = bookSales.slice(0,10);
                            } else {
                                books = books.slice(0,10);
                                bookSales = bookSales.slice(0,10);
                            }
                            

                            if(err) {
                                console.log(err);
                            } else {
                                res.render('adminPage', {
                                    usersCount: result2,
                                    bookData: data,
                                    booksCount: result,
                                    totalSales: result3,
                                    books: encodeURI(JSON.stringify(books)),
                                    bookSales: encodeURI(JSON.stringify(bookSales))
                                });
                            }
                        })
                    });
                });
            });
        })
    } else {
        res.redirect('/adminLoginPage');
    }
});

//ADMIN LOGIN PAGE ROUTER
router.get('/adminLoginPage', authController.adminIsLoggedIn, (req, res) => {
    if (req.admin) {
        res.redirect('/adminPage');
    } else {
        res.render('adminLoginPage');
    }
})

//ADMIN PAGE ROUTER
router.get('/adminProfile', authController.adminIsLoggedIn, (req, res) => {

    if (req.admin) {
        var sql = 'SELECT * FROM admin_table';
        db.query(sql, function (err, data, fields) {
            res.render('adminProfile', {
                adminData: data
            });
        })
    } else {
        res.redirect('adminLoginPage');
    }
})

//SEARCH BOOKS PAGE ROUTER
router.get('/searchBooks', (req, res) => {
    res.render('searchBooks');
})

//CART PAGE ROUTER
router.get('/cart', authController.isLoggedIn, (req, res, next) => {
    if (!req.session.cart) {
        return res.render('cartPage', {
            book: null,
            user: req.user
        });
    }

    var cart = new Cart(req.session.cart);

    res.render('cartPage', {
        user: req.user,
        book: cart.generateArray(),
        totalPrice: cart.totalPrice
    });

})

//ADD TO CART 
router.get('/add/:bookID', authController.isLoggedIn, (req, res) => {
    // DEBUGGED:
    //  Is online?
    if (req.user) {

        const userID = req.user.USER_ID;
        const bookID = req.params.bookID;
        
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
                    return res.redirect('back')
                } else {
                    const cart = new Cart(req.session.cart ? req.session.cart : {});
                    console.log(bookID);
                    models.books_table.findByPk(bookID).then(book => {

                        //console.log(book);
                        cart.add(book, book.BOOK_ID);
                        req.session.cart = cart;
                        console.log(req.session.cart)
                        res.redirect('back')
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
})

//CHECKOUT ROUTER
router.get('/check-out', authController.isLoggedIn, (req, res) => {

    if (req.user) {
        if (!req.session.cart || req.session.cart.totalPrice === 0) {
            res.redirect('/cart')
        } else {
            var cart = new Cart(req.session.cart);
            res.render('checkOutPage', {
                user: req.user,
                book: cart.generateArray(),
                total: cart.totalPrice
            });
        }
    } else {
        res.redirect('/userLoginPage');
    }
})

//CHECKOUT GCASH ERROR PAGE
router.get('/check-out/error/gcash', authController.isLoggedIn, (req, res) => {
    var cart = new Cart(req.session.cart);
    res.render('checkOutPage', {
        message: 'Please input a valid gcash number',
        book: cart.generateArray(),
        total: cart.totalPrice,
        user: req.user
    });
})

//CHECKOUT GCASH ERROR CARD
router.get('/check-out/error/card', authController.isLoggedIn, (req, res) => {
    var cart = new Cart(req.session.cart);
    res.render('checkOutPage', {
        message: 'Please input valid card credentials',
        book: cart.generateArray(),
        total: cart.totalPrice,
        user: req.user
    });
})


//ADD BOOK PAGE ROUTER
router.get('/adminAddBook', (req, res) => {
    res.render('adminAddBook');
})

//ADMIN SALES DATA PAGE ROUTER
router.get('/adminSalesData', function (req, res, next) {
    var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
            checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%m/%d/%y') AS date
            FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID ORDER BY checkout_table.PAYMENT_DATE`;
    db.query(sql, function (err, data, fields) {
        if (err) throw err;

        res.render('adminSalesData', {
            title: 'Sales List',
            salesData: data
        });
    });
});

//DISPLAY ALL BOOKS PAGE ROUTER
router.get('/display/all-books/:page', (req, res) => {
    const page = req.params.page;

    if (page === '1') {
        var sql = 'SELECT * FROM books_table LIMIT 20 OFFSET 0';

        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });

    } else if (page === '2') {
        var sql = 'SELECT * FROM books_table LIMIT 20 OFFSET 20';

        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });

    }

})

//DISPLAY BOOKS CATEGORY ROUTERS
router.get('/display/:category/:book', authController.isLoggedIn, (req, res) => {
    const book = req.params.book;
    const category = req.params.category;

    var sql = 'SELECT * FROM books_table WHERE BOOK_TITLE = ?';
    var sqlSimilar = 'SELECT * FROM books_table WHERE BOOK_CATEGORY = ? AND BOOK_TITLE != ? LIMIT 4';
    db.query(sql, [book], function (error, data) {
        db.query(sqlSimilar, [category, book], function (error, similar) {
            if (error) {
                throw error;
            } else {
                res.render('viewBook', {
                    user: req.user,
                    book: data,
                    category: similar
                });
            }
        })
    })

})

router.get('/viewPdf/:bookTitle', authController.isLoggedIn, (req, res) => {
    const bookTitle = req.params.bookTitle;


    var sql = 'SELECT * FROM books_table WHERE BOOK_TITLE = ?';
 
    db.query(sql, [bookTitle], function (error, data) {
        
            if (error) {
                throw error;
            } else {
                res.render('userViewPdf', {
                    user: req.user,
                    book: data
                });
            }
        
    })

})


//ACTION ADVENTURE PAGE ROUTER
router.get('/category/action-adventure', authController.isLoggedIn, (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Action and Adventure'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryActAdvPage', {
            user: req.user,
            category: 'action-adventure',
            title: 'Action and Adventure',
            bookData: data
        });
    });
})

//CHILDRENS FICTION PAGE ROUTER
router.get('/category/childrens-fiction',authController.isLoggedIn, (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Childrens Fiction'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryChildrensPage', {
            category: 'childrens-fiction',
            title: 'Childrens Fiction',
            bookData: data,
            user: req.user
        });
    });
})

//COMICS GRAPHICS PAGE ROUTER
router.get('/category/comic-graphic', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Comic and Graphic Novel'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryComicPage', {
            category: 'comic-graphic',
            title: 'Comic and Graphic Novel',
            bookData: data
        });
    });
})

//DRAMA PAGE ROUTER
router.get('/category/drama', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Drama'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryDramaPage', {
            category: 'drama',
            title: 'Drama',
            bookData: data
        });
    });
})

//FAIRYTALE PAGE ROUTER
router.get('/category/fairytale', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Fairy Tale'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryFairyPage', {
            category: 'fairytale',
            title: 'Fairy Tale',
            bookData: data
        });
    });
})

//FANTASY PAGE ROUTER
router.get('/category/fantasy-scifi', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Fantasy and Sci-Fi'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryFanSciPage', {
            category: 'fantasy-scifi',
            title: 'Fantasy and Sci-Fi',
            bookData: data
        });
    });
})

//MYSTERY PAGE ROUTER
router.get('/category/mystery', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Mystery'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryMystPage', {
            category: 'mystery',
            title: 'Mystery',
            bookData: data
        });
    });
})

//ROMANCE PAGE ROUTER
router.get('/category/romance', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Romance'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryRomancePage', {
            category: 'romance',
            title: 'Romance',
            bookData: data
        });
    });
})

//HORROR THRILLER PAGE ROUTER
router.get('/category/horror-thriller', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Horror and Thriller'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryThrillerPage', {
            category: 'horror-thriller',
            title: 'Horror and Thriller',
            bookData: data
        });
    });
})

//YOUNG ADULT PAGE ROUTER
router.get('/category/young-adult', (req, res) => {
    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = 'Young Adult'";
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('categoryYoungPage', {
            category: 'young-adult',
            title: 'Young Adult',
            bookData: data
        });
    });
})

//ADMIN MODIFY BOOKS ROUTER
router.get('/adminModifyBook/:bookID', (req, res) => {
    const bookID = req.params.bookID;
    var sql = 'SELECT * FROM books_table WHERE BOOK_ID = ?';
    db.query(sql, [bookID], function (error, data) {
        if (error) {
            throw error;
        } else {
            res.render('adminModifyBook', {
                book: data
            });
        }
    })
})

//ADMIN DELETE BOOK 
router.get('/adminDeleteBook/:bookID', (req, res) => {
    const bookID = req.params.bookID;

    db.query('DELETE FROM books_table WHERE BOOK_ID = ?', [bookID], async (error, data) => {
        if (error) {
            throw error;
        }

        else {
            res.redirect("/adminBooksData/1");
            
        }
    })
})

//ADMIN BOOKS DATA PAGE ROUTER
router.get('/adminBooksData/:page', (req, res) => {
    const page = req.params.page;

    if (page === '1') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 0';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function (err, result) {

                console.log("Total Records: " + result[0].booksCount);

                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result
                });
            });
        })
    } else if (page === '2') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 10';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function (err, result) {

                console.log("Total Records: " + result[0].booksCount);

                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result
                });
            });
        })

    } else if (page === '3') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 20';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function (err, result) {

                console.log("Total Records: " + result[0].booksCount);

                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result
                });
            });
        })
    } else if (page === '4') {
        var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 30';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(sqltotal, function (err, result) {

                console.log("Total Records: " + result[0].booksCount);

                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result
                });
            });
        })
    } else if (page === '5') {
    var sql = 'SELECT * FROM books_table LIMIT 10 OFFSET 40';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;

        var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";
        db.query(sqltotal, function (err, result) {

            console.log("Total Records: " + result[0].booksCount);

            res.render('adminBooksData', {
                title: 'Books List',
                bookData: data,
                booksCount: result
            });
        });
    })
}

})

//ADMIN USERS DATA PAGE ROUTER
router.get('/adminUsersData', function (req, res, next) {
    var sql = `SELECT USER_NAME, USER_EMAIL, DATE_FORMAT(USER_CREATED_DATE, '%m/%d/%y') AS created, DATE_FORMAT(USER_MODIFIED_DATE, '%m/%d/%y') AS modified
             FROM users_table `;
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('adminUsersData', {
            title: 'User List',
            userData: data
        });
    });
});

module.exports = router;