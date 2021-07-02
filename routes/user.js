var router = global.router;
const jwt = require("jsonwebtoken");
let User = require("../models/UserModel");
const mongoose = require("mongoose");

// password handle
const bcrypt = require("bcrypt");
const { authenticate, authorize } = require("../middlewares/Auth/varify-token.middleware");

//get all user
router.get("/getall_user",authenticate, authorize(['admin', 'superadmin']), (req, res, next) => {
  User.find({})
    .limit(100)
    .sort({ tenUser: 1 })
    .select({
      tenUser: 1,
      loaiUser: 1,
      email: 1,
      passWord: 1,
      create_date: 1,
      imageUrl: 1,
    })
    .exec((err, user) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: user,
          count: user.length,
          message: `Successfully`,
        });
      }
    });
});

//get user by id
router.get("/get_user_by_id",authenticate, authorize(['admin', 'superadmin']), (req, res, next) => {
  console.log(mongoose.Types.ObjectId(req.query.user_id));

  User.findById(mongoose.Types.ObjectId(req.query.user_id), (err, user) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is: ${err}`,
      });
    } else {
      res.json({
        result: "ok",
        data: user,
        message: `Successfully`,
      });
    }
  });
});

// get user by tenUser
router.get("/get_user_with_tenUser",authenticate, authorize(['admin', 'superadmin']), (req, res, next) => {
  // criteria tiêu chuẩn
  let criteria = {
    tenUser: new RegExp(req.query.tenUser, "i"), // <=> giống %abc% trong sql
  };
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;

  User.find(criteria)
    .limit(limit)
    .sort({ tenUser: 1 })
    .select({
      tenUser: 1,
      loaiUser: 1,
      email: 1,
      passWord: 1,
      create_date: 1,
      imageUrl: 1,
    })
    .exec((err, user) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: user,
          count: user.length,
          message: `Successfully`,
        });
      }
    });
});

// sign up
router.post("/signup", (req, res) => {
  let { tenUser, email, passWord, loaiUser } = req.body;
  tenUser.trim();
  email.trim();
  passWord.trim();

  if (tenUser == "" || email == "" || passWord == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(tenUser)) {
    res.json({
      status: "FAILED",
      message: "Ten khong chua ki tu so",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "email Err",
    });
  } else if (passWord.length < 3) {
    res.json({
      status: "FAILED",
      message: "passWord it nhat 3 kí tự",
    });
  } else {
    // kt xem user có tồn tại chưa
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "account đã tồn tại",
          });
        } else {
          // thu tao account moi

          // password handling
          const saltRounds = 10;
          bcrypt.hash(passWord, saltRounds).then((hashedPassword) => {
            const newUser = new User({
              tenUser,
              email,
              passWord: hashedPassword,
              loaiUser,
            });

            newUser
              .save()
              .then((result) => {
                res.json({
                  status: "SUCCESS",
                  message: "Signup successful",
                  data: result,
                });
              })
              .catch((err) => {
                {
                  res.json({
                    status: "FAILED",
                    message: `có lỗi xay ra trong khi tao user! err: ${err}`,
                  });
                }
              });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "có lỗi xay ra trong khi kiem tra ton tai user!",
        });
      });
  }
});

// signin
router.post("/signin", (req, res) => {
  let { email, passWord } = req.body;
  email = email.trim();
  passWord = passWord.trim();

  if (email == "" || passWord == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields",
    });
  } else {
    // kiem tra xem có tồn tại
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // User tồn tại

          const hashedPassword = data[0].passWord;
          bcrypt
            .compare(passWord, hashedPassword)
            .then((result) => {
              if (result) {
                // trùng password

                // tạo token

                const payload = {
                  id: data[0].id,
                  email: data[0].email,
                  role: data[0].loaiUser[0],
                };

                const secretKey = "eltr";

                const token = jwt.sign(payload, secretKey, {
                  expiresIn: 60 * 60 * 24 * 30,
                });
                res.json({
                  status: "SUCCESS",
                  message: "Signin Successful",
                  data: data,
                  token: token
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "mat khau khong hop le!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Có lõi xảy ra trong quá trình so sánh password",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Thong tin dang nhap khong lệ",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "Có lỗi xảy ra trong quá trình kiểm tra sự tồn tại của user",
        });
      });
  }
});

// update user
router.put("/update_user",authenticate, authorize(['admin', 'superadmin']), function (req, res, next) {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.user_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.user_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id user`,
    });
  }

  let newValues = {};

  // ten dai hon 2 ky tu moi cap nhat
  if (req.body.tenUser && req.body.tenUser.length > 2) {
    newValues.tenUser = req.body.tenUser;
  }

  // không được cập nhật email!

  // Update Images
  if (req.body.image_name && req.body.image_name.length > 0) {
    //vd: http://localhost:3000/open_image?image_name=upload_4b4e30641d6ad0bc28254e87c7dc373a.jpg
    // xây dựng đường link để update vào bản ghi User

    const serverName = require("os").hostname();
    const serverPort = require("../app").settings.port;

    newValues.imageUrl = `${serverName}:${serverPort}/open_image?image_name=${req.body.image_name}`;
  }

  // update len admin
  if (req.body.loaiUser) {
    newValues.loaiUser = req.body.loaiUser;
  }

  const options = {
    new: true,
    multi: true,
  };

  User.findOneAndUpdate(
    condition,
    { $set: newValues },
    options,
    (err, updateUser) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `cannot update: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: updateUser,
          message: `update user Successfully`,
        });
      }
    }
  );
});

// xoa user
router.delete("/delete_user/:id",authenticate, authorize(['admin', 'superadmin']), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    await user.remove();
    res.send({ data: "Xóa thành công" });
  } catch {
    res.status(404).send({ error: "User not found!" });
  }
});

// tong hoa don
router.post("/tong_hoadon", (req, res, next) => {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.user_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.user_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id san pham`,
    });
  }
  if (req.body.tongTien > 0) {
    console.log(req.body.tongTien);
    var tongTien = req.body.tongTien;
  }

  User.findOneAndUpdate(
    condition,
    { $push: { tongHoaDon: tongTien } },
    (err, hoadon) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `cannot hoadon: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: hoadon,
          message: `hoadon Successfully`,
        });
      }
    }
  );
});

module.exports = router;
