var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var param = req.body;
    var roomNo = param.roomNo,
        maxNo = param.maxNo,
        addTime = Date.now();
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var historicalpowerconsumptions = global.dbHelper.getModel('historicalpowerconsumptions');
    var roomcharges = global.dbHelper.getModel('roomcharges');
    var d = new Date();
    //console.log(dormNo)
    if (maxNo == undefined || maxNo == null || maxNo == ""){
        maxNo = 2;
    }
    roomcharges.find({maxNo},function (err9,doc9) {
        if (err9){
            console.log("addRoom.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 查询数据集合roomcharges失败"+err9);
        } else{
            if (doc9.length  == 0){
                res.json({"errorCode":"506","errorMessage":"添加失败,请先添加该房间的房间收费标准！"});
            } else{
                dormrooms.findOne({roomNo,isDelete:"false"},function (doc,error) {
                    if (error){
                        //console.log(error);
                        console.log("addRoom.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 添加房间信息失败"+error);
                        res.json({"errorCode":"404","errorMessage":"添加失败！"});
                    } else if(doc) {
                        //console.log(doc);
                        res.json({"errorCode":"405","errorMessage":"该房间号已存在！"});
                    }else{
                        dormrooms.create({
                            roomNo,
                            maxNo,
                            isDelete:"false",
                            addTime
                        }, function (error1, doc1) {
                            if (error1) {
                                //console.log(error);
                                console.log("addRoom.js"+d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" 添加房间信息失败"+error1);
                                res.json({"errorCode":"406","errorMessage":"添加失败！"});
                            } else {
                                dormrooms.find({roomNo,isDelete:"false"},function(err2,doc2){
                                    //console.log(doc2+"78996")
                                    dynamicdormrooms.create({
                                        roomId:doc2[0]._id,
                                        newNo:"0",
                                        isDelete:"false",
                                        isComputed:"false",
                                        userInfoList:[]
                                    })
                                    var data = {
                                        roomId:doc2[0]._id,
                                        isDelete:"false",
                                        powerNoList:[]
                                    }
                                    //console.log(data)
                                    historicalpowerconsumptions.create(data)
                                })

                                res.json({"errorCode":"200","errorMessage":"添加房间信息成功"});
                            }
                        });
                    }
                })
            }
        }

    })


});
module.exports = router;
