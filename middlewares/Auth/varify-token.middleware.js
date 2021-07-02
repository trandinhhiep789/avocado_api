
const jwt = require("jsonwebtoken")

// kiểm tra người dùng đã đăng nhập hay chưa
const authenticate = (req, res, next) => {
    const token = req.header("token")
    try{
        const secretKey = "eltr"
        const decode = jwt.verify(token, secretKey)
        req.user = decode // req.user để tý bóc tách
        next() // chây tiếp các middleware khác
    }catch(err){
        res.status(401).send("Bạn chưa đăng nhập")
    }
    
}

const authorize = (arrRole) => (req, res, next) => {
    const {user} = req;
    if(arrRole.findIndex((role) => user.role == role) > -1){
        next();
    }else{
        // res.send(user)
        res.status(403).send("Bạn không có quyền")
    }
}

module.exports = {
    authenticate,
    authorize
}