
var cors = require('cors')

var router = global.router;
let Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

// enable CORS()
app.use(cors())
app.options('*', cors())

router.get("/getall-category", function (req, res, next) {
  Category.find({})
    .limit(100)
    .sort({ tenSanPham: 1 })
    .select({
      tenLoai: 1,
      description: 1,
      create_date: 1,
    })
    .exec((err, category) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: category,
          count: category.length,
          message: `Successfully`,
        });
      }
    });
});

//get category by id
router.get("/get_category_by_id", function (req, res, next) {
  console.log(mongoose.Types.ObjectId(req.query.category_id));

  Category.findById(
    mongoose.Types.ObjectId(req.query.category_id),
    (err, category) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: category,
          message: `Successfully`,
        });
      }
    }
  );
});

router.post("/insert_new_category", (req, res, next) => {
  const criteria = {
    tenLoai: new RegExp("^" + req.body.tenLoai.trim() + "$", "i"),
  };
  Category.find(criteria)
    .limit(1)
    .exec((err, categories) => {
      // ton tai, khong cho them
      if (err) {
        res.json({
            result: "failed",
            data: [],
            message: `Error is: ${err}`,
          });
      } else {
        if (categories.length > 0) {
            res.json({
                result: "failed",
                data: [],
                message: `Loai san pham da ton tai!`,
              });
        } else {
          const newCategory = new Category({
            tenLoai: req.body.tenLoai,
            description: req.body.description,
          });

          newCategory.save((err, addCategory) => {
            if (err) {
              res.json({
                result: "failed",
                data: {},
                message: `Error is: ${err}`,
              });
            } else {
              res.json({
                result: "ok",
                data: addCategory,
                message: `Insert new category succcessfuly`,
              });
            }
          });
        }
      }
    });
});

router.delete("/delete_category",  (req, res, next) => {

  Category.findOneAndRemove({_id: mongoose.Types.ObjectId(req.body.category_id)},(err) => {
    if (err) {
      res.json({
        result: "failed",
        message: `khong the xoa. Error is: ${err}`,
      });
      return;
    } 
    res.json({
      result: "ok",
      message: `xoa Successfully`,
    });
  })
});

module.exports = router;
