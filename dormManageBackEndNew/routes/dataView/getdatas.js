var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var d=new Date();
    dynamicdormrooms.find({isDelete:"false"}/*,{dormNo:1}*/,function (error,doc) {
        var roomNum = 0;     //定义房间数
        var bedNum = 0;      //定义床位总数
        var usersNum = 0;    //定义用户数
        var vacantRoomNum = 0;//定义空房间数
        var roomNumRate = 0;
        var bedNumRate = 0;
        var usersNumRate = 0;
        var vacantRoomNumRate = 0;
        var refleshTimeroomNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
        var refleshTimebedNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
        var refleshTimeusersNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
        var refleshTimevacantRoomNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
        if (error){
            //console.log(error);
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getdatas.js  查询数据库失败"+error)
            res.json({"errorCode":"404","errorMessage":"查询数据库失败"});
        } else if(doc) {
            //console.log(doc);
            if (doc.length == 0){
                res.json({"errorCode":"405","errorMessage":"暂无房间，请添加房间！"});
            } else{
                roomNum = doc.length;
                for (let i=0;i<roomNum;i++){
                    var msg = true;
                    for(let j=0;j<doc[i].userInfoList.length;j++){
                        if (doc[i].userInfoList[j].isEnd == "false") {
                            usersNum++;
                            msg = false;
                        }
                    }
                    if (msg == true){
                        vacantRoomNum++;
                    }
                }
                dormrooms.find({isDelete:"false"},function (err1,doc1) {
                    if (err1){
                        console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getdatas.js  查询dormrooms数据集合失败"+err1)
                    } else{
                        doc1.forEach(function (item,index) {
                            bedNum += Number(item.maxNo)
                        })
                        roomNumRate = global.roomNum>0?(roomNum-global.roomNum)/roomNum:0;
                        bedNumRate = global.bedNum>0?(bedNum-global.bedNum)/bedNum:0;
                        usersNumRate = global.usersNum>0?(usersNum-global.usersNum)/usersNum:0;
                        vacantRoomNumRate = global.vacantRoomNum>0?(vacantRoomNum-global.vacantRoomNum)/vacantRoomNum:0;
                        var aa = global.refleshTimeroomNum;
                        var bb = global.refleshTimebedNum;
                        var cc = global.refleshTimeusersNum;
                        var dd = global.refleshTimevacantRoomNum;
                        var aaa = global.roomNumRate;
                        var bbb = global.bedNumRate;
                        var ccc = global.usersNumRate;
                        var ddd = global.vacantRoomNumRate;

                        if (global.roomNum != roomNum){
                            global.roomNum = roomNum;
                            global.roomNumRate = roomNumRate
                            global.refleshTimeroomNum = refleshTimeroomNum
                        }
                        if (global.bedNum != bedNum){
                            global.bedNum = bedNum;
                            global.bedNumRate = bedNumRate;
                            global.refleshTimebedNum = refleshTimebedNum
                        }
                        if (global.usersNum != usersNum){
                            global.usersNum = usersNum;
                            global.usersNumRate = usersNumRate;
                            global.refleshTimeusersNum = refleshTimeusersNum
                        }
                        if (global.vacantRoomNum != vacantRoomNum){
                            global.vacantRoomNum = vacantRoomNum;
                            global.vacantRoomNumRate = vacantRoomNumRate;
                            global.refleshTimevacantRoomNum = refleshTimevacantRoomNum
                        }
                            res.json({"errorCode":"200","errorMessage":{
                                    roomNum,
                                    bedNum,
                                    usersNum,
                                    vacantRoomNum,
                                    roomNumRate:aaa,
                                    bedNumRate:bbb,
                                    usersNumRate:ccc,
                                    vacantRoomNumRate:ddd,
                                    refleshTimeroomNum:aa,
                                    refleshTimebedNum:bb,
                                    refleshTimeusersNum:cc,
                                    refleshTimevacantRoomNum:dd
                                }
                            })

                    }
                })
            }
        }
    })

});
module.exports = router;
