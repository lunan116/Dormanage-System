var express = require('express');
var router = express.Router();



router.post('/', function (req, res, next){
    var param = req.body;
    var _id = param._id;
    var condition = {_id : _id};
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var historicalpowerconsumptions = global.dbHelper.getModel('historicalpowerconsumptions');
    var d = new Date();
    dynamicdormrooms.find({roomId:_id,"userInfoList.isEnd":"false"},function(err5,doc5){
        if (err5){
            res.json({"errorCode": 405,"errorMessage": '查询数据库失败'});
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"deleteRoom.js   查询数据库失败"+error)
        }else if (doc5.length >0){
            res.json({"errorCode": 501,"errorMessage": '删除失败，该房间还有租客居住，请结算房费后再删除！'});
        }else{
            dormrooms.findOne({_id: _id}, function (error,doc) {
                if (error){
                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"deleteRoom.js   查询数据库失败"+error)
                    res.json({"errorCode": 405,"errorMessage": '查询数据库失败'});
                } else if(doc){
                    dormrooms.update(condition ,{$set:{'isDelete':'true'}}, function (error1) {
                        if (error1) {
                            res.json({"errorCode": 405,"errorMessage": error1});
                        } else {
                            dynamicdormrooms.update({roomId : _id} ,{$set:{'isDelete':'true'}}, function (error2) {
                                if (error2) {
                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"deleteRoom.js   更新dynamicdormrooms数据集合失败"+error2)
                                    //console.log(error2)
                                } else {
                                }
                            })
                            historicalpowerconsumptions.update({roomId : _id} ,{$set:{'isDelete':'true'}}, function (error2) {
                                if (error2) {
                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"deleteRoom.js   更新dynamicdormrooms数据集合失败"+error2)
                                    //console.log(error2)
                                } else {
                                }
                            })
                            res.json({"errorCode": 200,"errorMessage": "用户删除成功"});
                        }
                    });
                } else {
                    //console.log(doc)
                    res.json({"errorCode": 401, "errorMessage": '用户名不存在'});
                }
            })
        }
    })

    //console.log(param);
    //todo something
    //res.json({"errorCode": 0,"errorMessage": 'save'});
});
module.exports = router;
