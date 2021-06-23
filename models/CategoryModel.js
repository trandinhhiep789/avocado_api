var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategoryModel = new Schema({
    tenLoai: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    create_data: {
        type: Date,
        default: Date.now
    }
})

CategoryModel.path('tenLoai').set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1)
})

module.exports = mongoose.model('Category', CategoryModel)