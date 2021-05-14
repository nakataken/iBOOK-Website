const mysql = require("mysql");

//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//ADMIN PAGE 

//SORT USERS DATA
exports.sortUserData = async (req, res) => {
    const {
        sortUsers,
    } = req.body
    
    if (sortUsers === 'sortIDAsc') {
        var sql = 'SELECT * FROM users_table ORDER BY USER_ID';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminUsersData', {
                title: 'User List',
                userData: data
            });
        });

    } else if (sortUsers === 'sortIDDesc') {
        var sql = 'SELECT * FROM users_table ORDER BY USER_ID DESC';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminUsersData', {
                title: 'User List',
                userData: data
            });
        });

    } else if (sortUsers === 'sortUsernameAsc') {
        var sql = 'SELECT * FROM users_table ORDER BY USER_NAME';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('adminUsersData', {
                title: 'User List',
                userData: data
            });
        });
    } else if (sortUsers === 'sortUsernameDesc') {
        var sql = 'SELECT * FROM users_table ORDER BY USER_NAME DESC';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;

            res.render('adminUsersData', {
                title: 'User List',
                userData: data
            });
        });
    }
}

//SEARCH USERS DATA
exports.searchUserData = async (req, res) => {
    const {
        searchUser,
    } = req.body

    db.query('SELECT * FROM users_table WHERE USER_NAME LIKE ?', [searchUser + '%'], async (error, data) => {
        console.log(data);
        if (data.length < 1) {
            return res.status(401).render('adminUsersData', {
                message: 'There are no users with that username'
            });
        } else {
            res.render('adminUsersData', {
                title: 'User List',
                userData: data
            });

        }
    })
}

//SALES PAGE

//SORT BOOKS SALES
exports.adminSortSales = async (req, res) => {
    const {
        sortSales,
    } = req.body

    if (sortSales === 'sortDateAsc') {
        var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
        checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
        FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
        ORDER BY PAYMENT_DATE`;
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });
        });

    } else if (sortSales === 'sortDateDesc') {
        var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
        checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
        FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
        ORDER BY PAYMENT_DATE DESC`;
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });
        });
    } else if (sortSales === 'sortAmountAsc') {
        var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
        checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
        FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
        ORDER BY PAYMENT_AMOUNT`;
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });
        });
    } else if (sortSales === 'sortAmountDesc') {
        var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
        checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
        FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
        ORDER BY PAYMENT_AMOUNT DESC`;
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });
        });
    }
}

//SEARCH SALES
exports.adminSearchSales = async (req, res) => {
    const {
        searchSales,
    } = req.body

    db.query(`SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
    checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
    FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
    WHERE users_table.USER_NAME LIKE ?`, ['%' + searchSales + '%'], async (error, data) => {
        console.log(data);
        if (data.length < 1) {
            return res.status(401).render('adminSalesData', {
                message: 'There are no users with that username'
            });
        } else {
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });

        }
    })
}

//VIEW DAILY SALES
exports.dailySales = async (req, res) => {

    db.query(`SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
    checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
    FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
    WHERE DATE(checkout_table.PAYMENT_DATE) = CURDATE() ORDER BY checkout_table.PAYMENT_DATE`, async (error, data) => {
        console.log(data);
        if (data.length < 1) {
            return res.status(401).render('adminSalesData', {
                message: 'There are no purchases for today.'
            });
        } else {
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });

        }
    })
}

//VIEW MONTHLY SALES
exports.monthlySales = async (req, res) => {

    db.query(`SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
    checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
    FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
    WHERE MONTH(checkout_table.PAYMENT_DATE) = MONTH(CURDATE()) AND YEAR(checkout_table.PAYMENT_DATE) = YEAR(CURDATE()) 
    ORDER BY checkout_table.PAYMENT_DATE`, async (error, data) => {
        console.log(data);
        if (data.length < 1) {
            return res.status(401).render('adminSalesData', {
                message: 'There are no purchases for this month.'
            });
        } else {
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });

        }
    })
}

//VIEW ANNUAL SALES
exports.annualSales = async (req, res) => {

    db.query(`SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
    checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%y/%m/%d') AS date
    FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID
    WHERE YEAR(checkout_table.PAYMENT_DATE) = YEAR(CURDATE()) ORDER BY checkout_table.PAYMENT_DATE`, async (error, data) => {
        console.log(data);
        if (data.length < 1) {
            return res.status(401).render('adminSalesData', {
                message: 'There are no purchases for this month.'
            });
        } else {
            res.render('adminSalesData', {
                title: 'User List',
                salesData: data
            });

        }
    })
}

//BOOKS PAGE

//ADD BOOK DATA
exports.adminAddBook = (req, res) => {
    console.log(req.body);

    const bookTitle = req.body.bookTitle;
    const bookAuthor = req.body.bookAuthor;
    const bookDesc = req.body.bookDesc;
    const bookPrice = req.body.bookPrice;
    const bookCategory = req.body.bookCategory;
    var file = req.files.bookCover;

    var bookCoverName = file.name
    var datetime = new Date();
    console.log(datetime);


    db.query('SELECT BOOK_TITLE, BOOK_AUTHOR FROM books_table WHERE BOOK_TITLE = ? AND BOOK_AUTHOR = ?',
        [bookTitle, bookAuthor], async (error, results) => {

            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('adminAddBook', {
                    message: 'That book is already displayed.'
                })
            }

            file.mv('public/uploadedImages/' + file.name, function (err) {

                if (err)

                    return res.status(500).send(err);
                db.query('INSERT INTO books_table SET ?', {
                    BOOK_TITLE: bookTitle,
                    BOOK_AUTHOR: bookAuthor,
                    BOOK_COVER: bookCoverName,
                    BOOK_PRICE: bookPrice,
                    BOOK_DESC: bookDesc,
                    BOOK_CATEGORY: bookCategory,
                    BOOK_CREATED_DATE: datetime,
                    BOOK_MODIFIED_DATE: datetime
                }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.redirect("/adminBooksData/1");
                    }
                })

            });


        });


}

//SAVE BOOK DATA
exports.adminSaveBook = (req, res) => {
    const bookID = req.params.bookID;
    const bookTitle = req.body.bookTitle;
    const bookAuthor = req.body.bookAuthor;
    const bookDesc = req.body.bookDesc;
    const bookPrice = req.body.bookPrice;
    const bookCategory = req.body.bookCategory;
    var file = req.files.bookCover;
    var bookCoverName = file.name
    var datetime = new Date();

    file.mv('public/uploadedImages/' + file.name, function (err) {

        if (err)

            return res.status(500).send(err);

        db.query('UPDATE books_table SET ? WHERE BOOK_ID = ?',
            [{
                BOOK_TITLE: bookTitle,
                BOOK_AUTHOR: bookAuthor,
                BOOK_COVER: bookCoverName,
                BOOK_PRICE: bookPrice,
                BOOK_DESC: bookDesc,
                BOOK_CATEGORY: bookCategory,
                BOOK_MODIFIED_DATE: datetime,
            }, bookID],
            (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/adminBooksData/1");
                }
            })

    });
}

//SORT BOOKS DATA
exports.adminSortBooks = async (req, res) => {
    const {
        sortBooks,
    } = req.body

    var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";

    if (sortBooks === 'sortTitleAsc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_TITLE';

        db.query(sql, function (err, data, fields) {
            db.query(sqltotal, function (err, result) {
                if (err) throw err;
                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result,
                });
            });
        });

    } else if (sortBooks === 'sortTitleDesc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_TITLE DESC';

        db.query(sql, function (err, data, fields) {
            db.query(sqltotal, function (err, result) {
                if (err) throw err;
                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result,
                });
            });
        });

    } else if (sortBooks === 'sortPriceAsc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_PRICE';

        db.query(sql, function (err, data, fields) {
            db.query(sqltotal, function (err, result) {
                if (err) throw err;
                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result,
                });
            });
        });
    } else if (sortBooks === 'sortPriceDesc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_PRICE DESC';

        db.query(sql, function (err, data, fields) {
            db.query(sqltotal, function (err, result) {
                if (err) throw err;
                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result,
                });
            });
        });
    }
}

//SEARCH BOOKS DATA
exports.adminSearchBooks = async (req, res) => {
    const {
        searchBook,
    } = req.body

    var sqltotal = "SELECT COUNT(*) AS booksCount FROM books_table";

    db.query('SELECT * FROM books_table WHERE BOOK_TITLE LIKE ?', [searchBook + '%'], async (error, data) => {
        console.log(data);
        db.query(sqltotal, function (err, result) {
            if (data.length < 1) {
                return res.status(401).render('adminBooksData', {
                    message: 'There are no books with that title',
                    booksCount: result,
                });
            } else {

                res.render('adminBooksData', {
                    title: 'Books List',
                    bookData: data,
                    booksCount: result,
                });

            }
        });
    })
}

//DELETE BOOK
exports.adminDeleteBook = async (req, res) => {
    const bookID = req.params.bookID;

    db.query('DELETE FROM books_table WHERE BOOK_ID = ?', [bookID], async (error, data) => {
        if (error) {
            throw error;
        }
        else {
            res.redirect("/adminBooksData/1");
            //res.render('adminBooksData', { title: 'Books List', bookData: data});
        }
    })
}

//MODIFY A BOOK
exports.adminModifyBook = async (req, res) => {

    const bookID = req.params.bookID;

    db.query('SELECT * FROM books_table WHERE BOOK_ID = ?', [bookID], async (error, data) => {
        if (error) {
            throw error;
        } else {

            res.render('adminModifyBook', {
                bookData: data
            });
        }
    })
}

//SORT BOOKS BY CATEGORY
exports.categorySortBooks = async (req, res) => {
    const title = req.params.title;
    const sortBooks = req.body.sortBooks;
    
    //SORT BY TITLE ASCENDING
    if (sortBooks === 'sortTitleAsc') {
        var sql = 'SELECT * FROM books_table WHERE BOOK_CATEGORY = ? ORDER BY BOOK_TITLE';

        db.query(sql, [title], function (err, data, fields) {
            if (err) throw err;
            if (title === 'Action and Adventure') {
                res.render("categoryActAdvPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Romance') {
                res.render("categoryRomancePage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Childrens Fiction') {
                res.render("categoryChildrensPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Comic and Graphic Novel') {
                res.render("categoryComicPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Drama') {
                res.render("categoryDramaPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fairy Tale') {
                res.render("categoryFairyPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fantasy and Sci-Fi') {
                res.render("categoryFanSciPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Horror and Thriller') {
                res.render("categoryThrillerPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Mystery') {
                res.render("categoryMystPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Young Adult') {
                res.render("categoryYoungPage", {
                    title: title,
                    bookData: data,
                });
            }
        });

    //SORT BY TITLE DESCENDING
    } else if (sortBooks === 'sortTitleDesc') {
        var sql = 'SELECT * FROM books_table WHERE BOOK_CATEGORY = ? ORDER BY BOOK_TITLE DESC';

        db.query(sql, [title], function (err, data, fields) {
            if (title === 'Action and Adventure') {
                res.render("categoryActAdvPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Romance') {
                res.render("categoryRomancePage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Childrens Fiction') {
                res.render("categoryChildrensPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Comic and Graphic Novel') {
                res.render("categoryComicPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Drama') {
                res.render("categoryDramaPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fairy Tale') {
                res.render("categoryFairyPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fantasy and Sci-Fi') {
                res.render("categoryFanSciPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Horror and Thriller') {
                res.render("categoryThrillerPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Mystery') {
                res.render("categoryMystPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Young Adult') {
                res.render("categoryYoungPage", {
                    title: title,
                    bookData: data,
                });
            }
        });

    //SORT BY PRICE ASCENDING
    } else if (sortBooks === 'sortPriceAsc') {
        var sql = 'SELECT * FROM books_table WHERE BOOK_CATEGORY = ? ORDER BY BOOK_PRICE';

        db.query(sql, [title], function (err, data, fields) {
            if (title === 'Action and Adventure') {
                res.render("categoryActAdvPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Romance') {
                res.render("categoryRomancePage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Childrens Fiction') {
                res.render("categoryChildrensPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Comic and Graphic Novel') {
                res.render("categoryComicPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Drama') {
                res.render("categoryDramaPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fairy Tale') {
                res.render("categoryFairyPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fantasy and Sci-Fi') {
                res.render("categoryFanSciPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Horror and Thriller') {
                res.render("categoryThrillerPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Mystery') {
                res.render("categoryMystPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Young Adult') {
                res.render("categoryYoungPage", {
                    title: title,
                    bookData: data,
                });
            }
        });

    //SORT PRICE DESCENDING
    } else if (sortBooks === 'sortPriceDesc') {
        var sql = 'SELECT * FROM books_table WHERE BOOK_CATEGORY = ? ORDER BY BOOK_PRICE DESC';

        db.query(sql, [title], function (err, data, fields) {
            if (title === 'Action and Adventure') {
                res.render("categoryActAdvPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Romance') {
                res.render("categoryRomancePage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Childrens Fiction') {
                res.render("categoryChildrensPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Comic and Graphic Novel') {
                res.render("categoryComicPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Drama') {
                res.render("categoryDramaPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fairy Tale') {
                res.render("categoryFairyPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Fantasy and Sci-Fi') {
                res.render("categoryFanSciPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Horror and Thriller') {
                res.render("categoryThrillerPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Mystery') {
                res.render("categoryMystPage", {
                    title: title,
                    bookData: data,
                });
            } else if (title === 'Young Adult') {
                res.render("categoryYoungPage", {
                    title: title,
                    bookData: data,
                });
            }
        });
    }
}

//DISPLAY AND SORT BOOKS
exports.displaySortBooks = async (req, res) => {
    const {
        sortBooks,
    } = req.body


    if (sortBooks === 'sortTitleAsc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_TITLE';

        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });

    } else if (sortBooks === 'sortTitleDesc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_TITLE DESC';

        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });

    } else if (sortBooks === 'sortPriceAsc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_PRICE';

        db.query(sql, function (err, data, fields) {
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });
    } else if (sortBooks === 'sortPriceDesc') {
        var sql = 'SELECT * FROM books_table ORDER BY BOOK_PRICE DESC';

        db.query(sql, function (err, data, fields) {
            res.render('displayBooks', {
                title: 'All Books',
                bookData: data,
            });
        });
    }
}

//SEARCH BOOKS
exports.searchBooks = async (req, res) => {
    const {
        searchBook,
    } = req.body
    console.log(req.body);
    db.query('SELECT * FROM books_table WHERE BOOK_TITLE LIKE ? ORDER BY BOOK_TITLE', ['%' + searchBook + '%'], async (error, data) => {

        if (data.length < 1) {
            return res.status(401).render('searchBooks', {
                title: searchBook,
                message: 'There are no books with that title'
            });
        } else {
            res.render('searchBooks', {
                title: searchBook,
                bookData: data
            });

        }
    })
}
