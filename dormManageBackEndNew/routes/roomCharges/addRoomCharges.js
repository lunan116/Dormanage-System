var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var param = req.body;
    var charges = param.charges,
        maxNo = param.maxNo;
    var d = new Date();
    var roomcharges = global.dbHelper.getModel('roomcharges');
    roomcharges.find({maxNo},function(err,doc){
        if (err){
            console.log("addRoomCharges.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 添加房间收费标准失败"+err);
            res.json({"errorCode":"404","errorMessage":"添加房间收费标准失败"})
        } else{
            if(doc.length > 0){
                res.json({"errorCode":"302","errorMessage":"该房型收费标准已经存在！"})
            }else{
                roomcharges.create({charges,maxNo},function (err1,doc1) {
                    if (err1){
                        console.log("addRoomCharges.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 添加房间收费标准失败"+err);
                        res.json({"errorCode":"404","errorMessage":"添加房间收费标准失败"})
                    } else{
                        res.json({"errorCode":"200","errorMessage":"添加成功"})
                    }
                })
            }
        }
    })


});
module.exports = router;
