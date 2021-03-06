const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const mysql = require("mysql");
const Cart = require('../controllers/cart');
const models = require('../models/index');
const { reset } = require('nodemon');


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
                        // Render top sales book
                        db.query(sqlRandom, function (err, random, fields) {    
                        let bookQuery = "SELECT books_table.* FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id"    
                            db.query(bookQuery, (err, book) => {
                                let bookData = JSON.parse(JSON.stringify(book))
                                let books = [...bookData]
                                let bookTitles = books.map((book) => {
                                    return book.BOOK_TITLE;
                                });
                                let distinctBookTitles = [...new Set(bookTitles)]
                                let distinctBooks = removeDuplicates(books, item=>item.BOOK_ID)
                                let bookNumbers = Object.keys(bookData).length
                                let bookSales = [];
                                for(let i=0; i<distinctBookTitles.length; i++) {
                                    let sales = 0;
                                    for(let j=0; j<bookNumbers; j++) {
                                        if(distinctBookTitles[i] === bookData[j].BOOK_TITLE) {
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
                                            let bookSwap = distinctBooks[j];
                                            distinctBooks[j] = distinctBooks[j - 1];
                                            distinctBooks[j - 1] = bookSwap;
                                        }
                                    }
                                }

                                let topSales = [];
                                for(let i=0; i<8; i++) {
                                    topSales.push(distinctBooks[i])
                                }
                                
                                if(req.user) {
                                    let ownedBooksQuery = `SELECT books_table.book_category FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id WHERE checkout_items_table.user_id = ${req.user.USER_ID}`
                                    db.query(ownedBooksQuery, async (err, ownedBook) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            if(ownedBook[0] != null) {
                                                // based on the owned books of user
                                                var categoriesOwned = ownedBook.map((category) => {
                                                    return category.book_category
                                                })
                                                var distinctCategories = [...new Set(categoriesOwned)];
                                                
                                                //Start
                                                var totalBookPerCategory = []
                                                var noBookToDisplayPerCategory
                                                var sum = 0
                                                // get total number of books per category
                                                for(let i=0; i<distinctCategories.length; i++) {
                                                    let categoryQuery = `SELECT COUNT(book_category) as count FROM books_table WHERE book_category = "${distinctCategories[i]}"`
                                                    await db.query(categoryQuery, async (err,count) => {
                                                        totalBookPerCategory[i] = count[0].count
                                                        sum = sum +  totalBookPerCategory[i]
                                                        console.log("COUNT" + i + ": ")
                                                        console.log(totalBookPerCategory[i])
                                                        if (i == distinctCategories.length-1) {
                                                            console.log(sum)
                                                            // get 50%
                                                            sum = Math.round(sum/2)
                                                            console.log("SUM: " + sum)
                                                            // get number of books to display per category
                                                            noBookToDisplayPerCategory = Math.round(sum/distinctCategories.length)
                                                            console.log("noToDisplay: " + noBookToDisplayPerCategory)

                                                            //LOOP
                                                            // get recommended books to display based on top sales of owned categories
                                                            var recommendedBooks = []
                                                            for(let j=0;j<distinctCategories.length; j++) {
                                                                let recommendedBooksQuery = `SELECT COUNT(C.CHECKOUT_ID) as CID, C.USER_ID, B.*
                                                                FROM  BOOKS_TABLE B JOIN CHECKOUT_ITEMS_TABLE C ON B.BOOK_ID = C.BOOK_ID 
                                                                WHERE B.BOOK_CATEGORY = "${distinctCategories[j]}" AND  C.USER_ID != ${req.user.USER_ID}
                                                                GROUP BY B.BOOK_ID
                                                                ORDER BY COUNT(CHECKOUT_ID) DESC
                                                                LIMIT ${noBookToDisplayPerCategory}`
                                                                console.log("recommendedBooksQuery: " + recommendedBooksQuery)
                                                                await db.query(recommendedBooksQuery, async (err,recommendation) => {
                                                                    if (err) 
                                                                        throw err 
                                                                    else{
                                                                        for (let k = 0; k < recommendation.length; k++) {
                                                                            recommendedBooks.push(recommendation[k])
                                                                        }
                                                                    }
                                                                    // on last iteration - before loop ends
                                                                    if (j == distinctCategories.length-1) {
                                                                        console.log("recommendedBooks: ")
                                                                        console.log(recommendedBooks)
                                                                        var filtered = []
                                                                        let existingBookQuery = `SELECT DISTINCT BOOK_ID FROM CHECKOUT_ITEMS_TABLE WHERE USER_ID = ${req.user.USER_ID}`
                                                                        await db.query(existingBookQuery, async (err,existingBooks) => {
                                                                            if (err) throw err 
                                                                            else {
                                                                                for (let m = 0; m < recommendedBooks.length; m++) {
                                                                                    var checker = false
                                                                                    for (let l = 0; l < existingBooks.length; l++) {
                                                                                        if (existingBooks[l].BOOK_ID == recommendedBooks[m].BOOK_ID) {
                                                                                            checker = true
                                                                                        }
                                                                                    }
                                                                                    if (!checker) {
                                                                                        filtered.push(recommendedBooks[m])
                                                                                    }
                                                                                }
                                                                                // when no content
                                                                                if (filtered.length > 0) {
                                                                                    renderHomepage(req,res,true,newrelease,onSale,topSales,filtered);
                                                                                } else {
                                                                                    var newFiltered = []
                                                                                    for(let o=0;o<distinctCategories.length; o++) {
                                                                                        let catecoricalBookQuery =`SELECT * FROM  BOOKS_TABLE WHERE BOOK_CATEGORY = "${distinctCategories[o]}"`
                                                                                        await db.query(catecoricalBookQuery, async (err,catecoricalBook) => {
                                                                                            if (err) throw err 
                                                                                            else {
                                                                                                for (let n = 0; n < catecoricalBook.length; n++) {
                                                                                                    var catChecker = false
                                                                                                    for (let p = 0; p < existingBooks.length; p++) {
                                                                                                        if (existingBooks[p].BOOK_ID == catecoricalBook[n].BOOK_ID) {
                                                                                                            catChecker = true
                                                                                                        }
                                                                                                    }
                                                                                                    if (!catChecker) {
                                                                                                        newFiltered.push(catecoricalBook[n])
                                                                                                    }
                                                                                                }
                                                                                                // last iteration
                                                                                                if (o == distinctCategories.length-1) {
                                                                                                    renderHomepage(req,res,true,newrelease,onSale,topSales,newFiltered);
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                                
                                                                            }
                                                                        })
                                                                        //renderHomepage(req,res,true,newrelease,onSale,topSales,recommendedBooks);
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })                                                            
                                                }
                                                /*
                                                let recoBooks = []
                                                let totalRecos = 0;
                                                // change code here to query based on the top sales on each category
                                                for(let i=0;i<distinctCategories.length; i++) {
                                                    let categoryQuery = `SELECT * FROM books_table WHERE book_category = "${distinctCategories[i]}" ORDER BY RAND() LIMIT 5 OFFSET 0`
                                                    await db.query(categoryQuery, async (err,recommendation) => {
                                                        if (err) throw err 
                                                        else {
                                                            for(let j=0;j<5; j++) {
                                                                recoBooks[totalRecos] = recommendation[j]
                                                                totalRecos++;
                                                                if(totalRecos == distinctCategories.length*5) {
                                                                    let shuffledBooks = shuffleArray(recoBooks);
                                                                    recoBooks = [];
                                                                    if(totalRecos<=5) {
                                                                        for(let i=0; i<shuffledBooks.length; i++) {
                                                                            recoBooks.push(shuffledBooks[i])
                                                                        }
                                                                    } else {
                                                                        for(let i=0; i<8; i++) {
                                                                            recoBooks.push(shuffledBooks[i])
                                                                        }
                                                                    }
                                                                    renderHomepage(req,res,true,newrelease,onSale,topSales,recoBooks);
                                                                }
                                                            }
                                                        }
                                                    })
                                                }*/
                                            } else {
                                                renderHomepage(req,res,false,newrelease,onSale,topSales);
                                            }
                                        }
                                    })
                                } else {
                                    // no recommendation if there's no logged user
                                    renderHomepage(req,res,false,newrelease,onSale,topSales);
                                }
                        })
                })    
            })
        })
})

function removeDuplicates(data, key) {
    return [...new Map(data.map(item => [key(item), item])).values()]
};

const shuffleArray = (array) => {
    var currentIndex = array.length,  randomIndex;
    while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

// function to render index page
const renderHomepage = (req, res, displayRecommendation, newrelease, onSale, topSales, recoBooks) => {
    res.render('index', {
        user: req.user,
        newBook: newrelease,
        sale: onSale,
        topSaleBooks: topSales,
        recommendation: displayRecommendation,
        recoBooks
    });
}

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
        var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(bookTotal, function (err, result) {
                var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
                db.query(usersTotal, function (err, result2) {
                    var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
                    db.query(salesTotal, function (err, result3) {
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

                            let year = new Date().getFullYear();
                            let yearString = year.toString();
                            let yearNumber = parseInt(yearString);
                            let annualLabel = [yearNumber-5,yearNumber-4,yearNumber-3,yearNumber-2,yearNumber-1,yearNumber];
                            let annualSales = [];
                            for(let i=5;i>=0;i--) {
                                let querySales = `SELECT payment_amount FROM checkout_table where payment_date like "${yearString-i}%"`;
                                db.query(querySales, (err, salesData) => {
                                    if (err) throw err;
                                    annualSales[i] = compressSalesData(salesData);
                                    if(i==0) {
                                        res.render('adminPage', {
                                            title: 'Admin Page',
                                            topBooks: encodeURI(JSON.stringify(books)),
                                            topBooksSales: encodeURI(JSON.stringify(bookSales)),
                                            booksCount: result,
                                            usersCount: result2,
                                            salesTotal: result3,
                                            salesLabel: encodeURI(JSON.stringify(annualLabel)),
                                            totalSales: encodeURI(JSON.stringify(annualSales.reverse())),
                                            lineChartName: `Total Sales`,
                                            books: encodeURI(JSON.stringify(books)),
                                            bookSales: encodeURI(JSON.stringify(bookSales)),
                                            barChartName: `Top Selling Books (Category)`
                                        });
                                    }
                                })
                            }
                        })
                    })
                })
            })
    } else {
        res.redirect('/adminLoginPage');
    }
});

// almost same code from above, will clean if ever
router.post('/adminTopChart', authController.adminIsLoggedIn, (req, res) => {
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

                            let topBooks = books.slice(0,10);
                            let topBookSales = bookSales.slice(0,10);

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
                            
                            let year = new Date().getFullYear();
                            let yearString = year.toString();
                            let yearNumber = parseInt(yearString);
                            let annualLabel = [yearNumber-5,yearNumber-4,yearNumber-3,yearNumber-2,yearNumber-1,yearNumber];
                            let annualSales = [];
                            for(let i=5;i>=0;i--) {
                                let querySales = `SELECT payment_amount FROM checkout_table where payment_date like "${yearString-i}%"`;
                                db.query(querySales, (err, salesData) => {
                                    if (err) throw err;
                                    annualSales[i] = compressSalesData(salesData);
                                    if(i==0) {
                                        res.render('adminPage', {
                                            title: 'Admin Page',
                                            topBooks: encodeURI(JSON.stringify(books)),
                                            topBooksSales: encodeURI(JSON.stringify(bookSales)),
                                            booksCount: result,
                                            usersCount: result2,
                                            salesTotal: result3,
                                            salesLabel: encodeURI(JSON.stringify(annualLabel)),
                                            totalSales: encodeURI(JSON.stringify(annualSales.reverse())),
                                            lineChartName: `Total Sales`,
                                            books: encodeURI(JSON.stringify(topBooks)),
                                            bookSales: encodeURI(JSON.stringify(topBookSales)),
                                            barChartName: `Top Selling Books (Category)`
                                        });
                                    }
                                })
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

// selected category on admin page - bar chart
router.post('/adminSelectChart', authController.adminIsLoggedIn, (req, res) => {
    const {
        selectCategory
    } = req.body;

    if (req.admin) {
        if(selectCategory != "all") {
            var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
            db.query(bookTotal, function (err, result) {
                var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
                db.query(usersTotal, function (err, result2) {
                    var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
                    db.query(salesTotal, function (err, result3) {
                        let topBooksQuery = "SELECT books_table.book_title FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id"
                        db.query(topBooksQuery, (err, topBooks) => {
                            let topBookData = topBooks.map((book) => {
                                return book.book_title;
                            });
                            let topBookSales = [];
                            let topBooksSet = [...new Set(topBookData)]

                            for(let i=0; i<topBooksSet.length; i++) {
                                let sales = 0;
                                for(let j=0; j<topBookData.length; j++) {
                                    if(topBooksSet[i] === topBookData[j]) {
                                        sales++;
                                    }
                                }
                                topBookSales.push(sales);
                            }

                            for (let i=topBookSales.length; i>=0; i--) {
                                for (let j = topBookSales.length; j > topBookSales.length - i; j--) {
                                    if (topBookSales[j] > topBookSales[j-1]) {
                                        // Swap orders of sales
                                        let salesSwap = topBookSales[j];
                                        topBookSales[j] = topBookSales[j - 1];
                                        topBookSales[j - 1] = salesSwap;
                                        // Swap orders of books
                                        let bookSwap = topBooksSet[j];
                                        topBooksSet[j] = topBooksSet[j - 1];
                                        topBooksSet[j - 1] = bookSwap;
                                    }
                                }
                            }

                            topBooksSet = topBooksSet.slice(0,10);
                            topBookSales = topBookSales.slice(0,10);

                            let bookNames = `SELECT books_table.book_title FROM books_table INNER JOIN checkout_items_table ON books_table.book_id = checkout_items_table.book_id WHERE books_table.book_category = "${selectCategory}"`
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
                                
                                books = books.slice(0,5);
                                bookSales = bookSales.slice(0,5);
                                
                                let year = new Date().getFullYear();
                                let yearString = year.toString();
                                let yearNumber = parseInt(yearString);
                                let annualLabel = [yearNumber-5,yearNumber-4,yearNumber-3,yearNumber-2,yearNumber-1,yearNumber];
                                let annualSales = [];
                                for(let i=5;i>=0;i--) {
                                    let querySales = `SELECT payment_amount FROM checkout_table where payment_date like "${yearString-i}%"`;
                                    db.query(querySales, (err, salesData) => {
                                        if (err) throw err;
                                        annualSales[i] = compressSalesData(salesData);
                                        if(i==0) {
                                            res.render('adminPage', {
                                                title: 'Admin Page',
                                                topBooks: encodeURI(JSON.stringify(topBooksSet)),
                                                topBooksSales: encodeURI(JSON.stringify(topBookSales)),
                                                booksCount: result,
                                                usersCount: result2,
                                                salesTotal: result3,
                                                salesLabel: encodeURI(JSON.stringify(annualLabel)),
                                                totalSales: encodeURI(JSON.stringify(annualSales.reverse())),
                                                lineChartName: `Total Sales`,
                                                books: encodeURI(JSON.stringify(books)),
                                                bookSales: encodeURI(JSON.stringify(bookSales)),
                                                barChartName: `Top Selling Books - ${selectCategory}`
                                            });
                                        }
                                    })
                                }
                            })
                        })
                    })
                })
            })
            } else {
                res.redirect('/adminPage')    
            }
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
    var totalPrice = cart.totalPrice.toFixed(2)
    res.render('cartPage', {
        user: req.user,
        book: cart.generateArray(),
        totalPrice: totalPrice
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
            var totalPrice = cart.totalPrice.toFixed(2)
            res.render('checkOutPage', {
                user: req.user,
                book: cart.generateArray(),
                total: totalPrice
            });
        }
    } else {
        res.redirect('/userLoginPage');
    }
})



//CHECKOUT GCASH ERROR PAGE
router.get('/check-out/error/gcash', authController.isLoggedIn, (req, res) => {
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice.toFixed(2)

    res.render('checkOutPage', {
        message: 'Please input a valid gcash number',
        book: cart.generateArray(),
        total: totalPrice,
        user: req.user
    });
})

//CHECKOUT GCASH ERROR CARD
router.get('/check-out/error/card', authController.isLoggedIn, (req, res) => {
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice.toFixed(2)
    res.render('checkOutPage', {
        message: 'Please input valid card credentials',
        book: cart.generateArray(),
        total: totalPrice,
        user: req.user
    });
})


//ADD BOOK PAGE ROUTER
router.get('/adminAddBook', (req, res) => {
    res.render('adminAddBook');
})

// Compute the total of selected time frame
const compressSalesData = (salesData) => {
    let sales = salesData.reduce((accumulator, sales) => {
        return accumulator + sales.payment_amount;
    }, 0);
    return sales;
}

//ADMIN SALES DATA PAGE ROUTER
router.get('/adminSalesData', function (req, res, next) {
    var sql = `SELECT users_table.USER_NAME AS user, checkout_table.PAYMENT_METHOD AS mop, 
            checkout_table.PAYMENT_AMOUNT AS amount, DATE_FORMAT(checkout_table.PAYMENT_DATE, '%m/%d/%y') AS date
            FROM users_table JOIN checkout_table ON users_table.USER_ID = checkout_table.USER_ID ORDER BY checkout_table.PAYMENT_DATE`;
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
        db.query(salesTotal, function (err, totalSales) {
            
            res.render('adminSalesData', {
                title: 'Sales List',
                salesData: data,
                totalSales
            });
        });
    })
});

router.post('/adminSalesChart', function (req, res, next) {
    var bookTotal = "SELECT COUNT(*) AS booksCount FROM books_table";
    db.query(bookTotal, function (err, result) {
        var usersTotal = "SELECT COUNT(*) AS usersCount FROM users_table";
        db.query(usersTotal, function (err, result2) {
            var salesTotal = "SELECT SUM(PAYMENT_AMOUNT) AS totalSales FROM checkout_table";
            db.query(salesTotal, function (err, result3) {
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
                    
                    if(req.body.timeframe == "daily") {
                        let selectedDate = req.body.selectedDaily;
                            let date = new Date();
                            let currentYear = date.getFullYear();
                            var currentMonth = date.getMonth() + 1;
                            let monthFormat = (currentMonth<10) ? `0${currentMonth}` : (currentMonth>9) ? `${currentMonth}` : "";
                            let dateFormat = (selectedDate<10) ? `0${selectedDate}` : (selectedDate>9) ? `${selectedDate}` : "";
                            let hourOptions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
                            let lastDay = 32 - new Date(currentYear, parseInt(monthFormat)-1, 32).getDate();
                            let dailyLabel = [];
                            for(let i=1;i<=lastDay;i++) {
                                dailyLabel[i-1] = i;
                            }
                            let hourlySales = [];
                            for(let i=1;i<=24;i++) {
                                let timeFormat = (i<10) ? `0${i}` : (i==24) ? `00` : (i>9) ? `${i}` : "";
                                let querySales = `SELECT payment_amount FROM checkout_table where payment_date like "${currentYear}-${monthFormat}-${dateFormat} ${timeFormat}%"`
                                db.query(querySales, (err, salesData) => {
                                    if (err) throw err;
                                    hourlySales[i-1] = compressSalesData(salesData);

                                    if(i==24) {
                                        res.render('adminPage', {
                                            title: 'Admin Page',
                                            topBooks: encodeURI(JSON.stringify(books)),
                                            topBooksSales: encodeURI(JSON.stringify(bookSales)),
                                            salesLabel: encodeURI(JSON.stringify(hourOptions)),
                                            totalSales: encodeURI(JSON.stringify(hourlySales)),
                                            daily: true,
                                            dailyLabel,
                                            lineChartName: `Total Sales - Hourly Sales of ${currentYear}-${monthFormat}-${dateFormat}`,
                                            books: encodeURI(JSON.stringify(books)),
                                            bookSales: encodeURI(JSON.stringify(bookSales)),
                                            barChartName: `Top Selling Books (Category)`,
                                        });
                                    }
                                })
                            }
                    } else if (req.body.timeframe == "monthly") {
                        let selectedMonth = req.body.selectedMonthly;
                            let year = new Date().getFullYear();
                            let monthLabel = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
                            let monthNumber = (selectedMonth == "Jan") ? "01" : (selectedMonth == "Feb") ? "02" : (selectedMonth == "Mar") ? "03" : (selectedMonth == "Apr") ? "04" : (selectedMonth == "May") ? "05" : (selectedMonth == "June") ? "06" : (selectedMonth == "July") ? "07" : (selectedMonth == "Aug") ? "08" : (selectedMonth == "Sept") ? "09" :  (selectedMonth == "Oct") ? "10" : (selectedMonth == "Nov") ? "11" : (selectedMonth == "Dec") ? "12": ""
                            let yearString = year.toString();
                            let lastDay = 32 - new Date(parseInt(yearString), parseInt(monthNumber)-1, 32).getDate();
                            let dailyLabel = [];
                            let dailySales = [];
                            for(let i=1;i<=lastDay;i++) {
                                let querySales = (i>9) ? `SELECT payment_amount FROM checkout_table where payment_date like "${yearString}-${monthNumber}-${i}%"` : `SELECT payment_amount FROM checkout_table where payment_date like "${yearString}-${monthNumber}-0${i}%"`;
                                db.query(querySales, (err, salesData) => {
                                    if (err) throw err;
                                    dailyLabel[i-1] = i;
                                    dailySales[i-1] = compressSalesData(salesData);
                                    if(i==lastDay) {
                                        res.render('adminPage', {
                                            title: 'Admin Page',
                                            topBooks: encodeURI(JSON.stringify(books)),
                                            topBooksSales: encodeURI(JSON.stringify(bookSales)),
                                            salesLabel: encodeURI(JSON.stringify(dailyLabel)),
                                            totalSales: encodeURI(JSON.stringify(dailySales)),
                                            monthly: true,
                                            monthLabel,
                                            lineChartName: `Total Sales - Daily Sales of ${year}-${selectedMonth}`,
                                            books: encodeURI(JSON.stringify(books)),
                                            bookSales: encodeURI(JSON.stringify(bookSales)),
                                            barChartName: `Top Selling Books (Category)`
                                        });
                                    }
                                })
                            }
                    } else if (req.body.timeframe =="annual") {
                        let selectedYear = req.body.selectedAnnualy;
                            let year = new Date().getFullYear();
                            let yearString = year.toString();
                            let yearNumber = parseInt(yearString);
                            let annualLabel = [yearNumber-5,yearNumber-4,yearNumber-3,yearNumber-2,yearNumber-1,yearNumber];
                            
                            let monthLabel = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
                            var monthlySales = [];
                            for(let i=1;i<=12;i++) {
                                let querySales = (i>9) ? `SELECT payment_amount FROM checkout_table where payment_date like "${selectedYear}-${i}%"`:`SELECT payment_amount FROM checkout_table where payment_date like "${selectedYear}-0${i}%"`;
                                db.query(querySales, (err, salesData) => {
                                    if (err) throw err;
                                    monthlySales[i-1] = compressSalesData(salesData);

                                    if(i==12) {
                                        res.render('adminPage', {
                                            title: 'Admin Page',
                                            topBooks: encodeURI(JSON.stringify(books)),
                                            topBooksSales: encodeURI(JSON.stringify(bookSales)),
                                            salesLabel: encodeURI(JSON.stringify(monthLabel)),
                                            totalSales: encodeURI(JSON.stringify(monthlySales)),
                                            annual: true,
                                            annualLabel,
                                            lineChartName: `Total Sales - Annual Sales of ${selectedYear}`,
                                            books: encodeURI(JSON.stringify(books)),
                                            bookSales: encodeURI(JSON.stringify(bookSales)),
                                            barChartName: `Top Selling Books (Category)`
                                        })
                                    }
                                })
                            }
                        }
                })
            })
        })
    })
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


//CATEGORIES PAGE ROUTER
router.get('/category/:category', authController.isLoggedIn, (req, res) => {
    const category = req.params.category;

    var sql = "SELECT * FROM books_table WHERE BOOK_CATEGORY = ?";
    db.query(sql, [category], function (err, data, fields) {
        if (err) throw err;
        res.render('category', {
            user: req.user,
            category: category,
            title: category,
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

//LIBRARY
router.get('/library', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        const userID = req.user.USER_ID;

        var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
        db.query(sql, [userID], function (err, data, fields) {
            if (err) throw err;

            var sqlLibrary = `SELECT books_table.BOOK_TITLE AS title, 
            books_table.BOOK_COVER AS cover, books_table.BOOK_FILE AS file, books_table.BOOK_AUTHOR AS author
            FROM books_table JOIN checkout_items_table ON books_table.BOOK_ID = checkout_items_table.BOOK_ID WHERE checkout_items_table.USER_ID = ?`

            db.query(sqlLibrary, [userID], function (err, books, fields) {
                if (err) throw err;

                res.render('library', {
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

module.exports = router;
