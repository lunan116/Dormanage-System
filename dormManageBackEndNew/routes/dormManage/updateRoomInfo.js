var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next){
    var maxNo = req.body.maxNo;
    var roomNo = req.body.roomNo;
    var _id = req.body._id;
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var d = new Date();
    condition = {
        maxNo,
        roomNo
    }
    dynamicdormrooms.find({roomId:_id,"userInfoList.isEnd":"false"},function(err5,doc5){
        if (err5){
            res.json({"errorCode": 405,"errorMessage": '查询数据库失败'});
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"updateRoomInfo.js   查询数据库失败"+err5)
        }else if (doc5.length >0){
            res.json({"errorCode": 501,"errorMessage": '修改失败，该房间还有租客居住，请结算房费后再修改！'});
        }else{
            dormrooms.findOneAndUpdate({_id},condition,function (error,doc) {
                if (error) {
                    res.json({"errorCode": 405,"errorMessage": "修改失败！"});
                    //console.log(error);
                }else{
                    //console.log(doc);
                    res.json({"errorCode": 200,"errorMessage": "修改成功！"});
                }
            })
        }
    })



});
module.exports = router;
