var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next){
    var maxNo = req.body.maxNo;
    var charges = req.body.charges;
    var _id = req.body._id;
    var d = new Date();
    var roomcharges = global.dbHelper.getModel('roomcharges');
    condition = {
        maxNo,
        charges
    }
    roomcharges.findOneAndUpdate({_id},condition,function (error,doc) {
        if (error) {
            console.log("updateRoomCharges.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 修改房间收费标准失败"+err);
            res.json({"errorCode": 405,"errorMessage": "修改失败！"});
            //console.log(error);
        }else{
            //console.log(doc);
            res.json({"errorCode": 200,"errorMessage": "修改成功！"});
        }
    })


});
module.exports = router;
