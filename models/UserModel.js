var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    tenUser:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    passWord:{
        type: String,
        required: true
    },
    loaiUser:{
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String
    },
    tongHoaDon: []
})

module.exports = mongoose.model('User', UserSchema)