const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    try{
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            
            const user = await User.findOne({
                token : token,
                deleted : false
            }).select("-password -token");

            console.log(user);
            if(!user) {
                res.json({
                    code:400,
                    message:"Không có quyền truy cập!"
                });
            }else{
                res.locals.user = user;
                next();
            }
        }else {
            res.json({
                code: 400,
                message : "Vui lòng gửi kèm theo token!"
            });
        }

    }catch(error) {
        res.json({
            code : 400,
            message : "Không có quyền truy cập!"
        });
    }
}