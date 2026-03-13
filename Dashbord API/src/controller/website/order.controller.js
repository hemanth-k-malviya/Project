const env = require('dotenv').config();
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const orderModal = require('../../models/order.js');
const Razorpay = require('razorpay');
const { request, response } = require('express');

var instance = new Razorpay({
    key_id: 'rzp_test_WAft3lA6ly3OBc',
    key_secret: '68E17CNWY8SemCvZ6ylOkuOY',
});


exports.placeOrder = async (request, response) => {

    try {
        const token = request.headers.authorization.split(' ')
        var decoded = jwt.verify(token[1], process.env.secret_key);
        console.log("Decoded:", decoded);
        if (!decoded) {
            const data = {
                _status: false,
                _message: 'Invalid Token Value !',
                _data: ''
            }
            response.send(data);
        }

        var dataSave = request.body;
        // userInfo comes from the JWT payload created in website user.controller
        dataSave.user_id = decoded.userInfo._id;

        var totalOrders = await orderModal.countDocuments();
        totalOrders = 1001 + totalOrders;

        dataSave.order_number = 'MONSTA_' + totalOrders;

        await orderModal(dataSave).save()
            .then(async (result) => {
                const orderCreate = await instance.orders.create({
                    "amount": request.body.final_amount * 100,
                    "currency": 'INR',
                    "receipt": result._id,
                    "partial_payment": false,
                })

                await orderModal.updateOne({
                    _id: result._id
                }, {
                    $set: {
                        order_id: orderCreate.id
                    }
                })

                var orderInfo = await orderModal.findById(result._id);

                const data = {
                    _status: true,
                    _message: 'Order placed succussfully !!',
                    _order_create: orderCreate,
                    _data: orderInfo
                }
                response.send(data);
            })
            .catch((error) => {
                console.log(error);
                var errors = {};
                if (error.errors) {
                    for (var i in error.errors) {
                        errors[i] = error.errors[i].message;
                    }
                }
                const data = {
                    _status: false,
                    _message: 'Something went wrong 1',
                    _error: errors,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        console.log(error)
        const data = {
            _status: false,
            _message: 'Something went wrong 2',
            _error: error,
            _data: null
        }
        response.send(data);
    }



};

exports.orderStatus = async (request, response) => {

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

        var orderInfo = await instance.payments.fetch(request.body.razorpay_payment_id);

        if (orderInfo.status == 'authorized') {
            var dataSave = {
                orderStatus: 1,
                payment_status: 2,
                payment_id: request.body.razorpay_payment_id
            }
        } else {
            var dataSave = {
                orderStatus: 9,
                payment_status: 3,
                payment_id: request.body.razorpay_payment_id
            }
        }
        console.log(orderInfo);

        await orderModal.updateOne({
            order_id: request.body.razorpay_order_id
        }, {
            $set: dataSave
        })
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Status change succussfully !!',
                        _data: result
                    }
                    response.send(data);
                } else {
                    const data = {
                        _status: false,
                        _message: 'No Record found ',
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
        console.log(error)
        const data = {
            _status: false,
            _message: 'Something went wrong !!',
            _error: error,
            _data: null
        }
        response.send(data);
    }
}

exports.view = async (request, response) => {
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

        const addCondition =
        {
            deleted_at: null,
        };

        total_record = await orderModal.find(addCondition).countDocuments()

        await orderModal.find(addCondition).skip(skip).limit(limit).sort({ _id: 'desc' })
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


