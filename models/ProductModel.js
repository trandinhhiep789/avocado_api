
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductSchema = new Schema({
    tenSanPham:{
        type: String,
        required: true
    },
    thongTinThuongHieu:{
        type: String,
        default: ""
    },
    congDung:{
        type: String,
        default: ""
    },
    loaiDaPhuHop:{
        type: String,
        default: ""
    },
    huongDanSuDung:{
        type: String,
        default: ""
    },
    donGiaCu:{
        type: Number,
        default: 0
    },
    donGiaMoi:{
        type: Number,
        default: 0
    },
    thanhPhan:{
        type: String,
        default: ""
    },
    create_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['available', 'unavailable']
        }],
        default: ['available']
    },
    diemDanhGia: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    binhLuan: [],
    categoryId: Schema.ObjectId,
    imageUrl: []
})

// a setter
ProductSchema.path('tenSanPham').set((inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1)
})

module.exports = mongoose.model('Product', ProductSchema)