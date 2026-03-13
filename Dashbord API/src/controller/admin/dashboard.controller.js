const orderModal = require("../../models/order");


exports.analytics = async (request, response) => {
    try {
        const addCOndition = {
            delete_at: null,
        };
        var totalOrder = await orderModal.aggregate([
            {
                $match: { payment_status: 1 }
            },
            {
                $count: 'totalRecords'
            }
        ]);

        var minPrice = await orderModal.$where([
            {
                $match: { payment_status: 2 }
            },
            {
                $group:{
                    _id :"",
                    minPrice :{$min : "$final_amount"}
                }
            }
        ])

        var order = await orderModal.aggregate([
          {
                $match: { payment_status: 2 }
            },
            {
                $group:{
                    _id: "",
                    minPrice: { $min: "$final_amount" },
                    maxPrice: { $max: "$final_amount" },
                    avgPrice: { $avg: "$final_amount" },
                    sumPrice: { $sum: "$final_amount" }
                }
            }
        ])

        const data ={
            _status : true,
            _message :'Record found succussfully !!',
            totalOrder : totalOrder[0].totalRecords,
            _data : orders
        }
    } catch (error) {
        const data ={
            _status : false ,
            _message : "Something went wrong !!",
            _error : error,
            _data :[]
        }
        response.send(data)
    }
}