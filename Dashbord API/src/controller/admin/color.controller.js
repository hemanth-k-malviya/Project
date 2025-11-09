const colorModal = require('../../models/color.js');
const env = require('dotenv').config();

exports.create =async (request, response) => {
    var data = request.body;

    try {

        var saveData =await new colorModal(data).save()
            .then((result) => {
                const data = {
                    _status: true,
                    _message: 'record created succssfully',
                    _data: result
                }
                response.send(data);
            })
            .catch((error) => {

                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong1',
                    _error: errors,
                    _data: null
                }
                response.send(data);
            })
    } catch (error) {
        const data = {
            _status: false,
            _message: 'Something went wrong2',
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
                    var code = new RegExp(request.body.code, "i");
                    addCondition.push({ code: code })
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

        total_record = await colorModal.find(filter).countDocuments()

        await colorModal.find(filter).select('name code status order').skip(skip).limit(limit).sort({ _id: 'desc' })
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
exports.details = async (request, response) => {

    try {

        await colorModal.findById(request.params.id)
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Record found succssfully',
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
exports.update = async (request, response) => {
    try {
        var data = request.body;
        data.updated_at = Date.now();

        await colorModal.updateOne({
            _id: request.params.id
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount == 1) {
                    const data = {
                        _status: true,
                        _message: 'record update succssfully',
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

        await colorModal.updateMany({
            _id: request.body.ids
        }, {
            $set: data
        })
            .then((result) => {
                if (result.matchedCount > 0) {
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
exports.changeStatus =async(request, response) => {
    try {
        await colorModal.updateMany({
            _id: request.body.ids
        }, [{
            $set: {
                status :{
                    $not :"$status"
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