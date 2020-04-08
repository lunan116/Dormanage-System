var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var pageNo = req.body.pageNo;
    var roomStatus = req.body.roomStatus;
    var keyword = req.body.keyword;

    var d = new Date();
    dynamicdormrooms.find({isDelete: "false"},function (error,doc) {
        if (error){
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getDormStatus.js  查询dynamicdormrooms数据集合失败"+error)
            res.json({"errorMessage":"查询失败！","errorCode":"401"});
        } else if(doc) {
            //console.log(doc);
            if (doc.length == 0) {
                res.json({"errorCode": "303", "errMessage": "暂无数据"});
                var arr = []
            } else {

                var arr = []
                dormrooms.find({isDelete: "false"}, function (error1,doc1) {
                    if (error1){
                        //console.log(error1)
                        console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getDormStatus.js  查询dormrooms数据集合失败"+error1)
                    }else{
                        for (var i = 0; i < doc.length; i++ ) {
                            if (doc[i].isDelete == "false") {
                                var peopleNo = 0;
                                var roomNo = "";
                                var maxNo = 0;
                                for (var k = 0;k<doc[i].userInfoList.length;k++) {
                                    if (doc[i].userInfoList[k].isEnd == "false"){
                                        peopleNo++
                                    }
                                }
                                for (var j = 0;j<doc1.length;j++ ) {
                                    if (doc[i].roomId == doc1[j]._id) {
                                        roomNo= doc1[j].roomNo;
                                        maxNo=doc1[j].maxNo;
                                    }
                                }
                                arr.push({roomNo,maxNo,peopleNo,_id:doc[i].roomId})
                            }

                        }
                        //遍历arr，查询与keyword匹配的数据
                        var arrr = []
                        if (keyword && keyword.length>0) {
                            for (let i = 0;i<arr.length;i++){
                                if(arr[i].roomNo.indexOf(keyword)!= -1){
                                    arrr.push(arr[i]);
                                }
                            }
                        }else{
                            arrr = arr;
                        }


                        var arr1 =[]
                        if (roomStatus == -1){
                            if (arrr.length == 0) {
                                res.json({"errorCode": "303", "errMessage": "暂无数据"});
                            } else if (arrr.length - ((pageNo - 2) * 14) <= 14) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": arrr.slice((pageNo - 1) * 14, pageNo * 14)});
                            }
                        }else if(roomStatus == 0){
                            for (let i = 0;i<arrr.length;i++){
                                if (arrr[i].peopleNo == 0){
                                    arr1.push(arrr[i]);
                                }
                            }
                            if (arr1.length == 0) {
                                res.json({"errorCode": "303", "errMessage": "暂无数据"});
                            } else if (arr1.length - ((pageNo - 2) * 14) <= 14) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": arr1.slice((pageNo - 1) * 14, pageNo * 14)});
                            }
                        }else if(roomStatus == 2){
                            for (let i = 0;i<arrr.length;i++){
                                if (arrr[i].peopleNo == arrr[i].maxNo){
                                    arr1.push(arrr[i]);
                                }
                            }
                            if (arr1.length == 0) {
                                res.json({"errorCode": "303", "errMessage": "暂无数据"});
                            } else if (arr1.length - ((pageNo - 2) * 14) <= 14) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": arr1.slice((pageNo - 1) * 14, pageNo * 14)});
                            }
                        }else{
                            for (let i = 0;i<arrr.length;i++){
                                if (arrr[i].peopleNo != arrr[i].maxNo && arrr[i].peopleNo != 0){
                                    arr1.push(arrr[i]);
                                }
                            }
                            if (arr1.length == 0) {
                                res.json({"errorCode": "303", "errMessage": "暂无数据"});
                            } else if (arr1.length - ((pageNo - 2) * 14) <= 14) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": arr1.slice((pageNo - 1) * 14, pageNo * 14)});
                            }
                        }

                    }

                })

            }
        }
    })/*.limit(14).skip((pageNo-1)*14)*/



});
module.exports = router;
