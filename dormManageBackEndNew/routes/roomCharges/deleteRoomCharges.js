var express = require('express');
var router = express.Router();



router.post('/', function (req, res, next){
    var param = req.body;
    var _id = param._id;
    var condition = {_id : _id};
    var roomcharges = global.dbHelper.getModel('roomcharges');
    var d = new Date();
    roomcharges.remove(condition,function (err,doc) {
        if (err){
            console.log("deleteRoomCharges.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 删除房间收费标准失败"+err);
            res.json({"errorCode":"404","errorMessage":"删除房间收费标准失败"})
        } else{
            res.json({"errorCode":"200","errorMessage":"删除房间收费标准成功"})
        }
    })
});
module.exports = router;
