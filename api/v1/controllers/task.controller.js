const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination.helper");

//[GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const find = {
        $or: [
            { createdBy: userId },
            { listUser: userId }
          ],
        deleted : false
    };
    // fiter status
    if (req.query.status) {
        find.status = req.query.status;
    }
    //end filter status
    //sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //end sort
    //pagination
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(2, req.query, countTasks);
    //end pagination
    //search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    //end search
    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.json(tasks);
};

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const id = req.params.id;
        const task = await Task.findOne({
            _id : id,
            deleted : false
        });

        res.json(task);
    }
    catch(error) {
        res.json({
            code:400,
            message : "error with id"
        })
    }
};

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try{
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id : id
        }, {
            status : status
        });

        res.json({
            code : 200,
            message : "Cập nhật trạng thái thành công"
        })
    }catch(error) {
        res.json({
            code : 400,
            message : "Cập nhật trạng thái thất bại"
        })
    }
};

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try{
        const {ids, key, value} = req.body;

        switch (key) {
            case "status" :
                await Task.updateMany({
                    _id : {$in : ids}
                }, {
                    status : value
                });

                res.json({
                    code : 200,
                    message : "Cập nhật trạng thái thành công"
                });
                break;
            case "delete" :
                await Task.updateMany({
                    _id : {$in : ids}
                }, {
                    deleted : true,
                    deletedAt : new Date()
                });
                break;

            default:
                res.json({
                    code:400,
                    message:"Không tồn tại!"
                });
                break;
        }
    }catch (error) {
        res.json({
            code : 400,
            message:"không tồn tại!"
        });
    }
};

//[POST] /api/v1/tasks/create
module.exports.create = async (req,res) => {
    try{
        req.body.createdBy = res.locals.user.id;
        const task = new Task(req.body)
        const data = await task.save();
        
        res.json({
            code:200,
            message:"Tạo thành công!",
            data: data
        });
    }catch (error) {
        res.json({
            code:400,
            message: "Lỗi!"
        });
    }
};

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        await Task.updateOne({
            _id : id
        },req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công!"
        })
    }catch(error) {
        res.json({
            code:400,
            message:"Cập nhật trạng thái thất bại!"
        })
    }
};

//[DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try{
        const id = req.params.id;
        await Task.updateOne({
            _id : id
        },{
            deleted : true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Xóa thành công!"
        });
    }catch(error) {
        res.json({
            code:400,
            message:"Lỗi!"
        })
    }
}
