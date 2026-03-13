const { default: slugify } = require('slugify');
const productModal = require('../../models/product');
const subSubCategoryModal = require('../../models/subSubCategory');
const materialModal = require('../../models/material');
const colorModal = require('../../models/color');
const env = require('dotenv').config();

const generateUniqueSlug = async (Model, baseSlug) => {
    let slug = baseSlug;
    let count = 0;

    // Loop to find unique slug
    while (await Model.findOne({ slug })) {
        count++;
        slug = `${baseSlug}-${count}`;
    }

    return slug;
};

exports.viewMaterials = async (request, response) => {

    try {

        const addCondition = [
            {
                deleted_at: null,
            }
        ];

        const orCondition = [{
            status: true,
        }];

        if (request.body) {
            if (request.body.id != undefined) {
                if (request.body.id != '') {
                    orCondition.push({ _id: request.body.id })
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

        await materialModal.find(filter).select('_id name').sort({ _id: 'desc' })
            .then((result) => {
                if (result.length > 0) {
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

exports.viewColors = async (request, response) => {

    try {

        const addCondition = [
            {
                deleted_at: null,
            }
        ];

        const orCondition = [{
            status: true,
        }];

        if (request.body) {
            if (request.body.id != undefined) {
                if (request.body.id != '') {
                    orCondition.push({ _id: request.body.id })
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

        await colorModal.find(filter).select('_id name parent_category').sort({ _id: 'desc' })
            .then((result) => {
                if (result.length > 0) {
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

exports.viewSubSubCategory = async (request, response) => {

    try {

        const addCondition = [
            {
                deleted_at: null,
            }
        ];

        const orCondition = [{
            status: true,
        }];

        if (request.body) {
            if (request.body.id != undefined) {
                if (request.body.id != '') {
                    orCondition.push({ _id: request.body.id })
                }
            }
            if (request.body.parent_category != undefined) {
                if (request.body.parent_category != '') {
                    addCondition.push({ parent_category: request.body.parent_category })
                }
            }
            if (request.body.sub_category != undefined) {
                if (request.body.sub_category != '') {
                    addCondition.push({ sub_category: request.body.sub_category })
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

        await subSubCategoryModal.find(filter).select('_id name parent_category sub_category').sort({ _id: 'desc' })
            .then((result) => {
                if (result.length > 0) {
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

exports.create = async (request, response) => {

    if (request.body) {
        var data = request.body;
        if (request.body.name) {
            var slug = slugify(request.body.name, {
                lower: true,      // convert to lower case, defaults to `false`
                strict: true,     // strip special characters except replacement, defaults to `false`
            });
            data.slug = await generateUniqueSlug(productModal, slug)
        }
    } else {
        var data = {};
    }
    // if(data.sub_sub_categories_ids != ''){
    //     data.sub_sub_category_ids = data.sub_sub_category_ids.split(',');
    // }

    if (request.files != undefined) {

        if (request.files.image != undefined) {
            if (request.files.image) {
                data.image = request.files.image[0].filename;
            }
        }

        if (request.files.images != undefined) {
            if (request.files.images) {
                var images = [];
                request.files.images.forEach((v) => {
                    images.push(v.filename)
                })
                data.images = images;
            }
        }
    }

    try {

        var saveData = new productModal(data).save()
            .then(async (result) => {
                const data = {
                    _status: true,
                    _message: 'record created succssfully',
                    _data: result
                }
                response.send(data);
            })
            .catch((error) => {

                // var errors = [];
                // for (var i in error.errors) {
                //     errors.push(error.errors[i].message);
                // }


                var errors = {};
                for (var i in error.errors) {
                    errors[i] = error.errors[i].message;
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
exports.view = async (request, response) => {
    var current_page = 1;
    var total_record = 0;
    var total_page = 0;
    var limit = 12;
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
            }
        ];

        const orCondition = [];

        if (request.body) {
            if (request.body.name != undefined) {
                if (request.body.name != '') {
                    var name = new RegExp(request.body.name, 'i');
                    addCondition.push({ name: name })
                }
            }
            if (request.body.parent_category != undefined) {
                if (request.body.parent_category != '') {
                    addCondition.push({ parent_category: request.body.parent_category })
                }

            }
            if (Array.isArray(request.body.sub_category_ids) && request.body.sub_category_ids.length > 0) {
                addCondition.push({ sub_category: { $in: request.body.sub_category_ids } });
            } else if (request.body.sub_category != undefined && request.body.sub_category != '') {
                addCondition.push({ sub_category: request.body.sub_category });
            }

            // Tab-based filters: featured / new arrival / onsale / best selling
            if (request.body.is_featured != undefined && request.body.is_featured !== '') {
                addCondition.push({ is_featured: parseInt(request.body.is_featured) });
            }
            if (request.body.is_new_arrival != undefined && request.body.is_new_arrival !== '') {
                addCondition.push({ is_new_arrival: parseInt(request.body.is_new_arrival) });
            }
            if (request.body.is_onsale != undefined && request.body.is_onsale !== '') {
                addCondition.push({ is_onsale: parseInt(request.body.is_onsale) });
            }
            if (request.body.is_best_selling != undefined && request.body.is_best_selling !== '') {
                addCondition.push({ is_best_selling: parseInt(request.body.is_best_selling) });
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

        console.log(filter)

        total_record = await productModal.find(filter).countDocuments()

        await productModal.find(filter)
            // .select('name parent_category  image status order').skip(skip).limit(limit).sort({ _id: 'desc' })
            .populate('parent_category', 'name')
            .populate('sub_category', 'name')
            .populate('sub_sub_category_ids', 'name')
            .populate('color_ids', 'name')
            .populate('material_ids', 'name').skip(skip).limit(limit).sort({ _id: 'desc' })
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
                        image_path: process.env.product_image,
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

                console.log(error)

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

        await productModal.findById(request.params.id)
            .populate('parent_category', 'name')
            .populate('color_ids', 'name')
            .populate('material_ids', 'name')
            .then((result) => {
                if (result) {
                    const data = {
                        _status: true,
                        _message: 'Record found succssfully',
                        image_path: process.env.product_image,
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

        var slug = slugify(request.body.name, {
            lower: true,      // convert to lower case, defaults to `false`
            strict: true,     // strip special characters except replacement, defaults to `false`
        });

        data.slug = await generateUniqueSlug(productModal, slug);

        data.updated_at = Date.now();

        if (data.sub_sub_categories_ids != '') {
            data.sub_sub_category_ids = data.sub_sub_category_ids.split(',');
        }

        console.log(data);

        if (request.files != undefined) {

            if (request.files.image != undefined) {
                console.log(request.files)
                if (request.files.image) {
                    data.image = request.files.image[0].filename;
                }
            }

            if (request.files.images != undefined) {
                console.log(request.files.images)
                if (request.files.images) {
                    var images = [];
                    request.files.images.forEach((v) => {
                        images.push(v.filename)
                    })
                    data.images = images;
                }
            }
        }

        await productModal.updateOne({
            _id: request.params.id
        }, {
            $set: data
        })
            .then(async (result) => {
                if (result.matchedCount == 1) {
                    const data = {
                        _status: true,
                        _message: 'Record update succussfully',
                        _data: result
                    }
                    response.send(data);
                    console.log(data)
                } else {
                    const data = {
                        _status: false,
                        _message: 'Record does not exist',
                        _data: result
                    }
                    response.send(data);
                }

            })
            .catch((error) => {
                console.log(error);
                var errors = [];

                for (var i in error.errors) {
                    errors.push(error.errors[i].message);
                }

                const data = {
                    _status: false,
                    _message: 'Something went wrong 2',
                    _error: errors,
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

        await productModal.updateMany({

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
exports.changeStatus = async (request, response) => {
    try {
        await productModal.updateMany({
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