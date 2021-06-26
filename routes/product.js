var router = global.router;
const mongoose = require("mongoose");
let Product = require("../models/ProductModel");
const fs = require("fs");


router.get("/getall", function (req, res, next) {
  Product.find({})
    .limit(100)
    .sort({ tenSanPham: 1 })
    .select({
      tenSanPham: 1,
      thongTinThuongHieu: 1,
      congDung: 1,
      loaiDaPhuHop: 1,
      huongDanPhuHop: 1,
      donGiaCu: 1,
      donGiaMoi: 1,
      thanhPhan: 1,
      create_date: 1,
      diemDanhGia: 1,
      categoryId: 1,
      status: 1,
      imageUrl: 1,
    })
    .exec((err, product) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: product,
          count: product.length,
          message: `Successfully`,
        });
      }
    });
});

//get by id
// ex: http://localhost:3000/get_product_by_id?product_id=60caf9bf8a8d4027e40a8e1f
router.get("/get_product_by_id", function (req, res, next) {
  console.log(mongoose.Types.ObjectId(req.query.product_id));

  Product.findById(
    mongoose.Types.ObjectId(req.query.product_id),
    (err, product) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: product,
          message: `Successfully`,
        });
      }
    }
  );
});

//get by category_id
router.get("/get_product_with_category_id", (req, res, next) => {
  // criteria tiêu chuẩn
  // let condition = {};
  // if (mongoose.Types.ObjectId.isValid(req.body.category_id) == true) {
  //   condition.categoryId = mongoose.Types.ObjectId(req.body.category_id);
  // } else {
  //   res.json({
  //     result: "failed",
  //     data: {},
  //     message: `Id không hợp lệ`,
  //   });
  // }

  var condition = {
    categoryId: mongoose.Types.ObjectId(req.query.category_id),
  };

  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;
  console.log(condition.categoryId);
  console.log(req.query.category_id);

  Product.find(condition)
    .limit(limit)
    .sort({ tenSanPham: 1 })
    .select({
      tenSanPham: 1,
      thongTinThuongHieu: 1,
      congDung: 1,
      loaiDaPhuHop: 1,
      huongDanPhuHop: 1,
      donGiaCu: 1,
      donGiaMoi: 1,
      thanhPhan: 1,
      diemDanhGia: 1,
      categoryId: 1,
      create_date: 1,
      status: 1,
      binhLuan: 1,
      imageUrl: 1,
    })
    .exec((err, product) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: product,
          count: product.length,
          message: `Successfully`,
        });
      }
    });
});

//get by tenSanPham
router.get("/get_product_with_criteria", function (req, res, next) {
  // criteria tiêu chuẩn
  let criteria = {
    tenSanPham: new RegExp(req.query.tenSanPham, "i"), // <=> giống %abc% trong sql
  };
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;

  Product.find(criteria)
    .limit(limit)
    .sort({ tenSanPham: 1 })
    .select({
      tenSanPham: 1,
      thongTinThuongHieu: 1,
      congDung: 1,
      loaiDaPhuHop: 1,
      huongDanPhuHop: 1,
      donGiaCu: 1,
      donGiaMoi: 1,
      thanhPhan: 1,
      diemDanhGia: 1,
      categoryId: 1,
      create_date: 1,
      status: 1,
      binhLuan: 1,
      imageUrl: 1,
    })
    .exec((err, product) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: product,
          count: product.length,
          message: `Successfully`,
        });
      }
    });
});

router.post("/insert_new_product", function (req, res, next) {
  const newProduct = new Product({
    tenSanPham: req.body.tenSanPham,
    thongTinThuongHieu: req.body.thongTinThuongHieu,
    congDung: req.body.congDung,
    loaiDaPhuHop: req.body.loaiDaPhuHop,
    huongDanSuDung: req.body.huongDanSuDung,
    donGiaCu: req.body.donGiaCu,
    donGiaMoi: req.body.donGiaMoi,
    thanhPhan: req.body.thanhPhan,
    diemDanhGia: req.body.diemDanhGia,
  });

  newProduct.save((err) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is: ${err}`,
      });
    } else {
      res.json({
        result: "ok",
        data: {
          tenSanPham: req.body.tenSanPham,
          thongTinThuongHieu: req.body.thongTinThuongHieu,
          congDung: req.body.congDung,
          loaiDaPhuHop: req.body.loaiDaPhuHop,
          huongDanSuDung: req.body.huongDanSuDung,
          donGiaCu: req.body.donGiaCu,
          donGiaMoi: req.body.donGiaMoi,
          thanhPhan: req.body.thanhPhan,
          diemDanhGia: req.body.diemDanhGia,
          message: `Insert new product succcessfuly`,
        },
      });
    }
  });
});

router.put("/update_product", function (req, res, next) {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.product_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.product_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id san pham`,
    });
  }

  let newValues = {};

  // ten dai hon 2 ky tu moi cap nhat
  if (req.body.tenSanPham && req.body.tenSanPham.length > 2) {
    newValues.tenSanPham = req.body.tenSanPham;
  }

  // thongTinThuongHieu
  if (req.body.thongTinThuongHieu && req.body.thongTinThuongHieu.length > 2) {
    newValues.thongTinThuongHieu = req.body.thongTinThuongHieu;
  }

  // congDung
  if (req.body.congDung && req.body.congDung.length > 2) {
    newValues.congDung = req.body.congDung;
  }

  // loaiDaPhuHop
  if (req.body.loaiDaPhuHop && req.body.loaiDaPhuHop.length > 2) {
    newValues.loaiDaPhuHop = req.body.loaiDaPhuHop;
  }

  // huongDanSuDung
  if (req.body.huongDanSuDung && req.body.huongDanSuDung.length > 2) {
    newValues.huongDanSuDung = req.body.huongDanSuDung;
  }

  // donGiaCu
  if (req.body.donGiaCu) {
    newValues.donGiaCu = req.body.donGiaCu;
  }

  // donGiaMoi
  if (req.body.donGiaMoi) {
    newValues.donGiaMoi = req.body.donGiaMoi;
  }

  // thanhPhan
  if (req.body.thanhPhan && req.body.thanhPhan.length > 2) {
    newValues.thanhPhan = req.body.thanhPhan;
  }

  // diemDanhGia
  if (req.body.diemDanhGia) {
    newValues.diemDanhGia = req.body.diemDanhGia;
  }

  const options = {
    new: true,
    multi: true,
  };

  if (mongoose.Types.ObjectId.isValid(req.body.product_id) == true) {
    newValues.categoryId = mongoose.Types.ObjectId(req.body.categoryId);
  }

  // Update Images
  // if(req.body.image_name && req.body.image_name.length > 0){
  //vd: http://localhost:3000/open_image?image_name=upload_4b4e30641d6ad0bc28254e87c7dc373a.jpg
  // xây dựng đường link để update vào bản ghi Product

  //   const serverName = require("os").hostname();
  //   const serverPort = require("../app").settings.port;

  //   newValues.imageUrl = `${serverName}:${serverPort}/open_image?image_name=${req.body.image_name}`;
  // }

  const serverName = require("os").hostname();
  const serverPort = require("../app").settings.port;

  if (req.body.image_name && req.body.image_name.length > 0) {
    var img = `${serverName}:${serverPort}/open_image?image_name=${req.body.image_name}`;
  }

  Product.findOneAndUpdate(
    condition,
    { $set: newValues, $addToSet: { imageUrl: img } },
    options,
    (err, updateProduct) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `cannot update: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: updateProduct,
          message: `update products Successfully`,
        });
      }
    }
  );
});

router.post("/upload_image", (req, res, next) => {
  // xai thu vien formidable
  let formidable = require("formidable");

  var form = new formidable.IncomingForm();
  // thu muc upload
  form.uploadDir = "./uploads";
  // tên file lấy cả đuôi
  form.keepExtensions = true;
  // dung luong toi da: 10MB
  form.maxFieldsSize = 10 * 1024 * 1024;
  // cho phep upload nhieu anh
  form.multiples = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `cannot update img: ${err}`,
      });
    }
    // key để trống "" nó sẽ ra mảng các cái file
    var arrayOfFiles = files[""];
    // neu mang co ảnh
    if (arrayOfFiles.length > 0) {
      var fileName = [];
      // duyệt mang arrayOfFiles để đẩy đường dẫn vào mảng fileName
      arrayOfFiles.forEach((eachFile) => {
        fileName.push(eachFile.path.split("\\")[1]);
      });
      res.json({
        result: "ok",
        data: fileName,
        numberOfImage: fileName.length,
        message: `upload images Successfully`,
      });
    } else {
      // ko có gì để upload cả
      res.json({
        result: "failed",
        data: {},
        numberOfImage: 0,
        message: `no images to upload, phải chọn ít nhất 2 tấm`,
      });
    }
  });
});

// get images
router.get("/open_image", (req, res, next) => {
  let imageName = "uploads/" + req.query.image_name;
  fs.readFile(imageName, (err, imageData) => {
    if (err) {
      res.json({
        result: "failed",
        message: `khong th doc. Error is: ${err}`,
      });
      return;
    }
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(imageData);
  });
});

router.delete("/delete_product/:id", async (req, res, next) => {
  // let condition = {};
  // if (mongoose.Types.ObjectId.isValid(req.body.product_id) == true) {
  //   condition._id = mongoose.Types.ObjectId(req.body.product_id);
  // } else {
  //   res.json({
  //     result: "failed",
  //     data: {},
  //     message: `Id không hợp lệ`,
  //   });
  // }

  // Product.findOneAndRemove({_id: mongoose.Types.ObjectId(req.body.product_id)},(err) => {
  //   if (err) {
  //     res.json({
  //       result: "failed",
  //       message: `khong the xoa. Error is: ${err}`,
  //     });
  //     return;
  //   }
  //   res.json({
  //     result: "ok",
  //     message: `xoa Successfully`,
  //   });
  // })

  try {
    const product = await Product.findById(req.params.id);
    await product.remove();
    res.send({ data: "Xóa thành công" });
  } catch {
    res.status(404).send({ error: "Product not found!" });
  }
});

// comment
router.post("/do-comment", (req, res, next) => {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.product_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.product_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id san pham`,
    });
  }

  Product.findOneAndUpdate(
    condition,
    {
      $push: {
        binhLuan: { tenUser: req.body.tenUser, comment: req.body.comment },
      },
    },
    (err, comment) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `cannot comment: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: comment,
          message: `comment Successfully`,
        });
      }
    }
  );
});

module.exports = router;
