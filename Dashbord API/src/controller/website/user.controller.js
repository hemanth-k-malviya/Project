const userModal = require('../../models/user.js');
const env = require('dotenv').config();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { response, request } = require('express');
const saltRounds = 10;
const nodemailer = require("nodemailer");

exports.register = async (request, response) => {
    try {
        var dataSave = request.body;
        dataSave.role_type = "users";
        dataSave.password = await bcrypt.hash(request.body.password, saltRounds)

        new userModal(dataSave).save()
            .then((result) => {
                var token = jwt.sign({ userInfo: result }, process.env.secret_key);

                const data = {
                    _status: true,
                    _message: "Register succussfully!!",
                    _token: token,
                    _data: result
                }
                response.send(data)
            })
            .catch((error) => {
                console.log(error);
                var errors = {};
                for (var i in error.errors) {
                    errors[i] = error.errors[i].message;
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong !!',
                    _error: errors,
                    _data: null
                }
                response.send(data)
            })
    } catch (error) {
        console.log(error);
        const data = {
            _status: false,
            _message: 'Something went wrong !!',
            _error: error,
            _data: null
        }

        response.send(data);
    }
}

exports.login = async (request, response) => {

    const checkEmail = await userModal.findOne({ email: request.body.email });

    if (!checkEmail) {
        const data = {
            _status: false,
            _message: 'Invalid Email Address !',
            _data: ''
        }
        response.send(data);
    }

    const checkPassword = await bcrypt.compare(request.body.password, checkEmail.password);

    if (!checkPassword) {
        const data = {
            _status: false,
            _message: 'Password is incorrect !',
            _data: ''
        }

        response.send(data);
    }
    if (checkEmail.status == false) {
        const data = {
            _status: false,
            _message: 'Acoount is inactive. Please contact admin !',
            _data: ''
        }

        response.send(data);
    }

    // var token = jwt.sign({ userInfo: checkEmail }, process.env.secret_key, { expiresIn: 60 * 1 });

    var token = jwt.sign({ userInfo: checkEmail }, process.env.secret_key);

    const data = {
        _status: true,
        _message: 'Login succussfully !',
        _token: token,
        _data: checkEmail
    }

    response.send(data);
}

exports.viewProfile = async (request, response) => {

    try {
        token = request.headers.authorization.split(' ')
        var decoded = jwt.verify(token[1], process.env.secret_key);

        if (!decoded) {
            const data = {
                _status: false,
                _message: 'Invalid Token Value !',
                _data: ''
            }
            response.send(data);
        }
        await userModal.findById(decoded.userInfo._id)
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Record found succssfully',
                        _image_path: process.env.user_image,
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record not found ',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                const data = {
                    _status: false,
                    _message: 'Something went wrong',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.viewUsers = async (request, response) => {
    var current_page = 1;
    var total_record = 0;
    var total_page = 0;
    var limit = 10;
    var skip = 0;

    if (request.body) {

        if (request.body.limit != '' && request.body.limit != undefined) {
            limit = parseInt(request.body.limit)
        }
        if (request.body.page != '' && request.body.page != undefined) {
            skip = (request.body.page - 1) * limit;
            current_page = parseInt(request.body.page)
        }
    }

    try {

        const addCondition = [
            {
                deleted_at: null,
                name: { $exists: true } // only show the name exisited in db
            }
        ];

        const orCondition = [];

        if (request.body) {
            if (request.body.name != undefined) {
                if (request.body.name != '') {
                    var name = new RegExp(request.body.name, "i");
                    addCondition.push({ name: name })
                }
            }
            if (request.body.code != undefined) {
                if (request.body.code != '') {
                    var code = new RegExp(request.body.email, "i");
                    addCondition.push({ email: email })
                }
            }

        }

        if (addCondition.length > 0) {
            var filter = { $and: addCondition }
        } else {
            var filter = {}
        }

        if (orCondition.length > 0) {
            filter.$or = orCondition;
        }

        total_record = await userModal.find(filter).countDocuments()

        await userModal.find(filter).select('name email status mobile_number').skip(skip).limit(limit).sort({ _id: 'desc' })
            .then((result) => {
                if (result.length > 0) {

                    var paginate = {
                        current_page: current_page,
                        total_record: total_record,
                        total_page: Math.ceil(total_record / limit)
                    }

                    const data = {
                        _status: true,
                        _message: 'Record found succssfully',
                        _paginate: paginate,
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record not found ',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                const data = {
                    _status: false,
                    _message: 'Something went wrong',
                    _error: error,
                    _data: []
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong',
            _error: error,
            _data: []
        }
        response.send(data);
    }
}

exports.updateProfile = async (request, response) => {

    try {
        token = request.headers.authorization.split(' ')
        var decoded = jwt.verify(token[1], process.env.secret_key);

        if (!decoded) {
            const data = {
                _status: false,
                _message: 'Invalid Token Value !',
                _data: ''
            }
            response.send(data);
        }

        var dataSave = request.body;

        if (request.file) {
            dataSave.image = request.file.filename;
        }

        await userModal.updateOne({
            _id: decoded.userInfo._id
        }, {
            $set: dataSave
        })
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Record update succussfully !!',
                        _image_path: process.env.user_image,
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record not found ',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                const data = {
                    _status: false,
                    _message: 'Something went wrong',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.changePassword = async (request, response) => {

    try {
        token = request.headers.authorization.split(' ')
        var decoded = jwt.verify(token[1], process.env.secret_key);

        if (!decoded) {
            const data = {
                _status: false,
                _message: 'Invalid Token Value !',
                _data: ''
            }
            response.send(data);
        }
        console.log(decoded)
        var userInfo = await userModal.findById(decoded.userInfo._id)
        const checkPassword = await bcrypt.compare(request.body.current_password, userInfo.password);

        if (!checkPassword) {
            const data = {
                _status: false,
                _message: 'Password is incorrect !',
                _data: ''
            }

            response.send(data);
        }

        if (request.body.new_password != request.body.confirm_password) {
            const data = {
                _status: false,
                _message: 'New Password and Confirm Password must be match ! ',
                _data: ''
            }

            response.send(data);
        }

        if (request.body.current_password == request.body.confirm_password) {
            const data = {
                _status: false,
                _message: 'Current Password and New Password not be same ! ',
                _data: ''
            }

            response.send(data);
        }

        password = await bcrypt.hash(request.body.new_password, saltRounds)

        await userModal.updateOne({
            _id: decoded.userInfo._id
        }, {
            $set: {
                password: password
            }
        })
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Password change succussfully !!',
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record not found ',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                var errors = {};
                for (var i in error.errors) {
                    errors[i] = error.errors[i].message;
                }
                const data = {
                    _status: false,
                    _message: 'Something went wrong !!',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong !!',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.forgotPassword = async (request, response) => {

    const userCheck = await userModal.findOne({ email: request.body.email });


    if (!userCheck) {
        const data = {
            _status: false,
            _message: 'Email id does not exist!',
            _data: ''
        }

        response.send(data);
    }

    // Generate a short-lived reset token (1 hour)
    try {
        const token = jwt.sign({ id: userCheck._id }, process.env.secret_key, { expiresIn: '1h' });

        // Create transporter (configure environment variables for Email and GMAIL_Password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.Email,
                pass: process.env.GMAIL_Password,
            },
        });

        var resetUrl = `${process.env.resetUrl}${token}`

        const htmlMessage = `
            <div style="font-family: Arial, sans-serif; line-height:1.6; color:#222;">
              <h2 style="color:#333;">Reset your password</h2>
              <p>Hi ${userCheck.name || userCheck.email},</p>
              <p>We received a request to reset the password for your account. Click the button below to choose a new password. This link will expire in 1 hour.</p>
              <p><a href="${resetUrl}" style="background:#1a73e8;color:#ffffff;padding:10px 16px;border-radius:4px;text-decoration:none;display:inline-block;">Reset Password</a></p>
              <p>If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.</p>
              <p>Thanks,<br/>Support Team</p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Monsta" <${process.env.Email}>`,
            to: userCheck.email,
            subject: 'Reset your password',
            html: htmlMessage,
        });

        const data = {
            _status: true,
            _message: 'Reset email sent successfully !',
            _data: ''
        }

        response.send(data);
    } catch (error) {
        console.log('Forgot password error:', error);
        const data = {
            _status: false,
            _message: 'Mail not Send !',
            _error: error,
            _data: ''
        }

        response.send(data);
    }
}

exports.resetPassword = async (request, response) => {
    try {
        token = request.body.token;
        var decoded = jwt.verify(token, process.env.secret_key);

        if (!decoded) {
            const data = {
                _status: false,
                _message: 'Invalid Token Value !',
                _data: ''
            }
            response.send(data);
        }
        console.log(decoded)
        var userInfo = await userModal.findById(decoded.id)

        if (request.body.new_password != request.body.confirm_password) {
            const data = {
                _status: false,
                _message: 'New Password and Confirm Password must be match ! ',
                _data: ''
            }

            response.send(data);
        }

        password = await bcrypt.hash(request.body.new_password, saltRounds)

        await userModal.updateOne({
            _id: decoded.id
        }, {
            $set: {
                password: password
            }
        })
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Password reset succussfully !!',
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record not found ',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                var errors = {};
                for (var i in error.errors) {
                    errors[i] = error.errors[i].message;
                }
                const data = {
                    _status: false,
                    _message: 'Something went wrong !!',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong !!',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.changeStatus = async (request, response) => {
    try {
        await userModal.updateMany({
            _id: request.body.ids
        }, [{
            $set: {
                status: {
                    $not: "$status"
                }
            }
        }])
            .then((result) => {
                if (result.matchedCount > 0) {
                    const data = {
                        _status: true,
                        _message: 'Change status succssfully',
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'record does not exist',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                var errors = [];

                for (var i in error.errors) {
                    console.log(error.errors[i].message);
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.destroy = async (request, response) => {
    try {
        var data = {
            deleted_at: Date.now()
        }

        await userModal.updateMany({
            _id: request.body.ids
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount == 1) {
                    const data = {
                        _status: true,
                        _message: 'record deleted succssfully',
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'record does not exist',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {

                var errors = [];

                for (var i in error.errors) {
                    console.log(error.errors[i].message);
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong',
                    _error: error,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong',
            _error: error,
            _data: null
        }
        response.send(data);
    }

}
