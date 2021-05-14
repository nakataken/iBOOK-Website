const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {promisify} = require('util');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const fileUpload = require('express-fileupload');


//DATABASE CONNECTION
const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//EMAIL CONNECTION
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ibook.scrummybears@gmail.com',
        pass: 'scrummybears'
    }
});

//ACCOUNT LOGOUT
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    }); //Overwrite current cookie

    res.status(200).redirect('/');
}

//ADMIN ACCOUNT CONTROLLERS

//ADMIN LOGIN
exports.adminLoginPage = async (req, res) => {
    try {
        const {
            adminUsername,
            adminPassword
        } = req.body;

        if (!adminUsername || !adminPassword) {
            return res.status(400).render('adminLoginPage', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM admin_table WHERE ADMIN_NAME = ?', [adminUsername], (error, results) => {
            // console.log(results);
            if (results.length < 1) {
                return res.status(401).render('adminLoginPage', {
                    message: 'Enter valid email or password'
                });
            } else if (adminPassword !== (results[0].ADMIN_PASS)) {

                return res.status(401).render('adminLoginPage', {
                    message: 'Enter valid email or password'

                })

            } else {

                const adminID = results[0].ADMIN_ID;

                const token = jwt.sign({
                    adminID
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); //unique token
                console.log("token is" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/adminPage');

            }
        });

    } catch (error) {
        console.log(error);
    }
}

//CHECK IF ADMIN IS LOGGED IN
exports.adminIsLoggedIn = async (req, res, next) => {
    console.log(req.cookies); //check cookies
    if (req.cookies.jwt) {
        try {
            //verify token/ which user
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            ); 
            //decode all token to grab the id of the user
            console.log(decoded);
            //Check if user still exists
            db.query('SELECT * FROM admin_table WHERE ADMIN_ID = ?', [decoded.adminID], (error, result) => {
                console.log(result);

                if (!result) { //if no result
                    return next();
                }

                req.admin = result[0]
                return next();
            });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }

}

//ADMIN CHANGE PERSONAL INFORMATION
exports.adminChangeInfo = async (req, res, next) => {
    const adminUsername = req.body.adminUsername;
    const adminEmail = req.body.adminEmail;
    const adminContact = req.body.adminContact;
    const adminAddress = req.body.adminAddress;

    var datetime = new Date();
    console.log(datetime);
    var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

        if (pattern.test(adminUsername)) {
            var sql = 'SELECT * FROM admin_table';
            db.query(sql, function (err, data, fields) {
                res.render('adminProfile', {
                    message: 'Username must not contain special characters!',
                    adminData: data
                });
            })
        }
        if ((!adminContact.match(/^(09)/)) || (isNaN(adminContact))) {
            var sql = 'SELECT * FROM admin_table';
            db.query(sql, function (err, data, fields) {
                res.render('adminProfile', {
                    message: 'Invalid contact number.',
                    adminData: data
                });
            })
            //Update on admin database
        } else {
            db.query('UPDATE admin_table SET ?', {
                ADMIN_NAME: adminUsername,
                ADMIN_EMAIL: adminEmail,
                ADMIN_CONTACT: adminContact,
                ADMIN_ADDRESS: adminAddress,
                ADMIN_MODIFIED_DATE: datetime
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    var sql = 'SELECT * FROM admin_table';
                    db.query(sql, function (err, data, fields) {
                        return res.render('adminProfile', {
                            messageSuccess: 'You successfully changed your information!',
                            adminData: data
                        })
                    })
                }

            })
        }
}

//ADMIN CHANGE PASSWORD
exports.adminChangePass = async (req, res, next) => {
    const adminCurrent = req.body.adminCurrentPassword;
    const adminPassword = req.body.adminPassword;
    const adminConfirm = req.body.adminConfirm;

    db.query('SELECT ADMIN_PASS FROM admin_table', async (error, results) => {
        console.log(error);
        console.log(results);

        //Compare entered password and the password in database
        if (adminCurrent !== results[0].ADMIN_PASS) {
            var sql = 'SELECT * FROM admin_table';
            db.query(sql, function (err, data, fields) {
                res.render('adminProfile', {
                    message: 'Incorrect password, please try again.',
                    adminData: data
                });
            })
        }

        //Compare entered passwords
        if (adminPassword !== adminConfirm) {
            var sql = 'SELECT * FROM admin_table';
            db.query(sql, function (err, data, fields) {
                res.render('adminProfile', {
                    message: 'Passwords do not match!',
                    adminData: data
                });
            })
        } else {

            var datetime = new Date();
            
            //Update the admin table
            db.query('UPDATE admin_table SET ?', {
                ADMIN_PASS: adminPassword,
                ADMIN_MODIFIED_DATE: datetime
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    var sql = 'SELECT * FROM admin_table';
                    db.query(sql, function (err, data, fields) {
                        res.render('adminProfile', {
                            messageSuccess: 'You successfully changed your password!',
                            adminData: data
                        });
                    })
                }
            })

        }
    })
}

//ADMIN CHANGE ICON
exports.adminChangeIcon = async (req, res, next) => {
    var file = req.files.adminIcon;
    var adminIcon = file.name
    var datetime = new Date();

    //Save icon on the adminIcons folder
    file.mv('public/adminIcons/' + file.name, function (err) {

        if (err)
            return res.status(500).send(err);

            //Update admin_table
            db.query('UPDATE admin_table SET ?', {
                ADMIN_ICON: adminIcon,
                ADMIN_MODIFIED_DATE: datetime
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/adminProfile");
                }
            })

    });
}

//USER ACCOUNT CONTROLLERS

//USER LOGIN
exports.userLoginPage = async (req, res) => {
    try {
        const {
            userUsername,
            userPassword
        } = req.body;

        if (!userUsername || !userPassword) {
            return res.status(400).render('userLoginPage', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users_table WHERE USER_NAME = ?', [userUsername], async (error, results) => {
            console.log(results);
            if (results.length < 1) {
                return res.status(401).render('userLoginPage', {
                    message: 'Enter valid email or password'
                });
            } else if (!(await bcrypt.compare(userPassword, results[0].USER_PASS))) {

                return res.status(401).render('userLoginPage', {
                    message: 'Enter valid email or password'

                })

            } else {


                const userID = results[0].USER_ID;

                const token = jwt.sign({
                    userID
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); //unique token
                console.log("token is" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
                this.props.navigation.reset([NavigationActions.navigate({
                    routeName: 'DevicesList'
                })], 0);

            }
        });

    } catch (error) {
        console.log(error);
    }
}

//USER REGISTER
exports.userRegisterPage = (req, res) => {
    console.log(req.body);

    const userUsername = req.body.userUsername;
    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;
    const userPasswordConfirm = req.body.userPasswordConfirm;

    var datetime = new Date();
    console.log(datetime);
    var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    db.query('SELECT USER_NAME FROM users_table WHERE USER_NAME = ?', [userUsername], async (usernameError, usernameResults) => {

        db.query('SELECT USER_EMAIL FROM users_table WHERE USER_EMAIL = ?', [userEmail], async (emailError, emailResults) => {

            if (usernameError) {
                console.log(usernameError);
            }
            if (emailError) {
                console.log(emailError);
            }
            if (usernameResults.length > 0) {
                return res.render('userRegisterPage', {
                    usernameMessage: 'That username is already in use'
                })
            }
            if (pattern.test(userUsername)) {
                return res.render('userRegisterPage', {
                    usernameMessage: 'Username cannot contain ' + pattern
                });
            }
            if (emailResults.length > 0) {
                return res.render('userRegisterPage', {
                    emailMessage: 'That email is already in use'
                })
            }
            if (userPassword !== userPasswordConfirm) {
                return res.render('userRegisterPage', {
                    passwordMessage: 'Passwords do not match'
                });
            }

            let hashedPassword = await bcrypt.hash(userPassword, 8); //rounds of encryption
            console.log(hashedPassword);

            db.query('INSERT INTO users_table SET ?', {
                USER_NAME: userUsername,
                USER_EMAIL: userEmail,
                USER_PASS: hashedPassword,
                USER_CREATED_DATE: datetime,
                USER_MODIFIED_DATE: datetime
            }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.render('userRegisterPage', {
                        message: 'Registration completed successfuly! You can now login.'
                    });
                }
            })
        });
    });

}

//CHECK IF USER IS LOGGED IN
exports.isLoggedIn = async (req, res, next) => {
    console.log(req.cookies); //check cookies
    if (req.cookies.jwt) {
        try {
            //Verify user's token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
                process.env.JWT_SECRET
            ); //Decode token to grab the ID of the user
            console.log(decoded);
            //Check if user still exists
            db.query('SELECT * FROM users_table WHERE USER_ID = ?', [decoded.userID], (error, result) => {
                console.log(result);
                if (!result) { //if no result
                    return next();
                }
                req.user = result[0]
                return next();
            });

        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }

}

//SEND EMAIL FOR PASSWORD RESET
exports.userSendEmail = (req, res) => {
    console.log(req.body);

    const userEmail = req.body.userEmail;

    db.query('SELECT USER_EMAIL FROM users_table WHERE USER_EMAIL = ?', [userEmail], async (error, results) => {

        if (error) {
            console.log('sad');
        }

        if (results.length < 1) {
            return res.render('userSendEmail', {
                message: 'That email is not registered'
            })
        }

        //Create a reset token
        const urlTokens = crypto.randomBytes(64).toString('base64');
        console.log(urlTokens);

        //Token's expiration date
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1 / 24);

        //Create Email to be sent
        const message = {
            from: 'ibook@scrummybear.com',
            to: req.body.userEmail,
            subject: "📘 iBOOK PASSWORD RESET",
            html: ` <p>Hey ${req.body.userEmail}!</p>
                <p>We heard that you lost your iBook password. Sorry about that!</p>
                <p>To reset your password, please click the link below.\n\nhttp://localhost:8080/userForgotPassword?token='+${encodeURIComponent(urlTokens)}+'&email='+${req.body.userEmail}</p>
                <p>Don't forget to read anytime and anywhere you want!</p>
                <p>–Scrummy Bears</p>`,
        };

        //Send email
        transport.sendMail(message, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log(info);
                return res.render('userSendEmail', {
                    sentMessage: 'Please check your email for a password reset link'
                })
            }
        });


    });
}

//USER RESET PASSWORD
exports.userForgotPassword = (req, res, next) => {
    console.log(req.body);

    if (urlTokens == null) {
        return res.render('userForgotPassword', {
            message: 'Token has expired. Please try password reset again.',
            showForm: false
        });
    }

    res.render('userForgotPassword', {
        showForm: true,
        urlTokens: urlTokens
    });
}

//USER FORGOT PASSWORD
exports.userForgotPassword = async (req, res, next) => {
    console.log(req.body);

    const userPassword = req.body.userPassword;
    const userPasswordConfirm = req.body.userPasswordConfirm;

    //Compare entered passwords
    if (userPassword !== userPasswordConfirm) {
        return res.render('userForgotPassword', {
            message: 'Passwords do not match'
        });
    }

    var datetime = new Date();

    let hashedPassword = await bcrypt.hash(userPassword, 8); //rounds of encryption
    console.log(hashedPassword);

    db.query('UPDATE users_table SET ?', {
        USER_PASS: hashedPassword,
        USER_MODIFIED_DATE: datetime
    }, (error, results) => {
        if (error) {
            console.log(error);
        } else {

            return res.render('userLoginPage', {
                loginMessage: 'You can now login with your new password.'
            });
        }
    })

}

//USER CHANGE PERSONAL INFO
exports.userChangeInfo = async (req, res, next) => {
    console.log(req.body);
    const userID = req.params.userID;
    const userUsername = req.body.userUsername;
    const userEmail = req.body.userEmail;

    var datetime = new Date();
    console.log(datetime);
    var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

    db.query('SELECT USER_NAME FROM users_table WHERE USER_NAME = ?', [userUsername], async (usernameError, usernameResults) => {

        db.query('SELECT USER_EMAIL FROM users_table WHERE USER_EMAIL = ?', [userEmail], async (emailError, emailResults) => {

            if (usernameError) {
                console.log(usernameError);
            }
            if (emailError) {
                console.log(emailError);
            }
            if (usernameResults.length > 0) {
                var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                db.query(sql, [userID], function (err, data, fields) {
                    res.render('userProfile', {
                        message: 'That username already exists!',
                        userData: data
                    });
                })
            }
            if (pattern.test(userUsername)) {
                var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                db.query(sql, [userID], function (err, data, fields) {
                    res.render('userProfile', {
                        message: 'Username must not contain special characters!',
                        userData: data
                    });
                })
            }
            if (emailResults.length > 0) {
                var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                db.query(sql, [userID], function (err, data, fields) {
                    res.render('userProfile', {
                        message: 'That email already exists!',
                        userData: data
                    });
                })
            } else {
                db.query('UPDATE users_table SET ? WHERE USER_ID = ?', [{
                    USER_NAME: userUsername,
                    USER_EMAIL: userEmail,
                    USER_MODIFIED_DATE: datetime
                }, userID], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                        db.query(sql, [userID], function (err, data, fields) {
                            return res.render('userProfile', {
                                messageSuccess: 'You can now use your new username and email!',
                                userData: data
                            })
                        })
                    }

                })
            }
        });
    });

}

//USER CHANGE PASSWORD
exports.userChangePass = async (req, res, next) => {
    console.log(req.body);
    const userID = req.params.userID;
    const userCurrent = req.body.userCurrentPassword;
    const userPassword = req.body.userPassword;
    const userConfirm = req.body.userConfirm;


    db.query('SELECT USER_PASS FROM users_table WHERE USER_ID = ?', [userID], async (error, results) => {
        console.log(error);
        console.log(results);
        //Compare entered password and the encrypted password in Database
        if (!(await bcrypt.compare(userCurrent, results[0].USER_PASS))) {
            var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
            db.query(sql, [userID], function (err, data, fields) {
                res.render('userProfile', {
                    message: 'Incorrect password, please try again.',
                    userData: data
                });
            })
        } else {

            //Compare entered passwords
            if (userPassword !== userConfirm) {
                var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                db.query(sql, [userID], function (err, data, fields) {
                    res.render('userProfile', {
                        message: 'Passwords do not match!',
                        userData: data
                    });
                })
            }

            var datetime = new Date();

            let hashedPassword = await bcrypt.hash(userPassword, 8); //rounds of encryption
            console.log(hashedPassword);

            db.query('UPDATE users_table SET ? WHERE USER_ID = ?', [{
                USER_PASS: hashedPassword,
                USER_MODIFIED_DATE: datetime
            }, userID], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    var sql = 'SELECT * FROM users_table WHERE USER_ID = ?';
                    db.query(sql, [userID], function (err, data, fields) {
                        res.render('userProfile', {
                            messageSuccess: 'You successfully changed your password!',
                            userData: data
                        });
                    })
                }
            })

        }
    })
}

//CHANGE USER ICON
exports.userChangeIcon = async (req, res, next) => {
    const userID = req.params.userID;
    var file = req.files.userIcon;
    var userIcon = file.name
    var datetime = new Date();

    //Save user icon on the UserIcons folder 
    file.mv('public/userIcons/' + file.name, function (err) {

        if (err)
            return res.status(500).send(err);
            //Save user icon on the database
            db.query('UPDATE users_table SET ? WHERE USER_ID = ?', [{

                USER_ICON: userIcon,
                USER_MODIFIED_DATE: datetime
            }, userID], (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/userProfile");
                }
            })

    });
}

