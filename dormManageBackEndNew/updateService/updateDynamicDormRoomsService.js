var express = require('express');
var schedule = require('node-schedule');
var moment = require('moment');

var app = {
    a:'111',
    updateInfo : () => {
        //每分钟的第30秒定时执行一次:
        schedule.scheduleJob('30 27 1 8 * *',()=>{
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth();
            var day = d.getDay()+1;
            var mm = y+"."+m;
            if (m<10){
                m = "0"+m;
            }
            if (day<10){
                day = "0"+day;
            }
            var dt = y+"-"+m+"-"+day;

            //console.log(dt)
            //console.log(moment(dt).valueOf());
            var peopleNumbers = 0;//定义每个月的在住人数
            var roomNumbers= 0;//定义每个月的房间床位数
            var powerTotal = 0;//定义每个房间的用电总电量
            var newPeopleNum = 0;//定义每个月的新入住人数
            var checkOutPeopleNum = 0;//定义每个月的当月退房人数
            //console.log('scheduleCronstyle:' + new Date());
            var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
            var databackups = global.dbHelper.getModel('databackups');
            var users = global.dbHelper.getModel('users');
            var dormrooms = global.dbHelper.getModel('dormrooms');
            var historicalpowerconsumptions = global.dbHelper.getModel('historicalpowerconsumptions');
            var dataviews = global.dbHelper.getModel('dataviews');
            users.find({},function(err,doc){
                if (err){
                    console.log("定时更新失败"+err)
                } else{
                    for (var i =0;i<doc.length;i++){
                        if (doc[i].isEnd != "true"){
                            peopleNumbers = peopleNumbers+1
                        }
                        if (doc[i].isEnd != "true" && doc[i].startTime > moment(dt).valueOf()) {
                            newPeopleNum = newPeopleNum+1
                        }
                        if (doc[i].isEnd == "true" && doc[i].endTime > moment(dt).valueOf()) {
                            checkOutPeopleNum = checkOutPeopleNum+1
                        }
                    }
                    dormrooms.find({isDelete:"false"},function (err1,doc1) {
                        if (err1){
                            console.log("定时更新失败"+err1)
                        } else{
                            for (var i =0;i<doc1.length;i++){
                                roomNumbers = roomNumbers+Number(doc1[i].maxNo);
                            }
                            historicalpowerconsumptions.find({"powerNoList.month":mm},function (err2,doc2) {
                                if (err2){
                                    console.log("定时更新失败"+err2)
                                } else{
                                    //console.log(doc2)
                                    for (var i =0;i<doc2.length;i++){
                                        for (var j=0;j<doc2[i].powerNoList.length;j++){
                                            if (doc2[i].powerNoList[j].month == mm){
                                                powerTotal = powerTotal+Number(doc2[i].powerNoList[j].useNo);
                                            }
                                        }
                                    }
                                    dataviews.create({
                                        month:mm,
                                        peopleNumbers,
                                        roomNumbers,
                                        powerTotal,
                                        newPeopleNum,
                                        checkOutPeopleNum,
                                        occupancyRate:(Number(peopleNumbers)/Number(roomNumbers)).toFixed(2)
                                    })
                                    //console.log( peopleNumbers)
                                    //console.log( roomNumbers)
                                    //console.log( powerTotal)
                                    //console.log( newPeopleNum)
                                    //console.log( checkOutPeopleNum)
                                }
                            })
                        }
                    })
                }
            })





            dynamicdormrooms.find({},function (err,doc) {
                if (err){
                    console.log("updateDynamicDormRoomsService.js 查询数据库失败！")
                } else{
                    var doc1= [];
                    for (var i=0;i<doc.length;i++){
                        if (doc[i].isComputed == "true" && doc[i].isDelete == "false"){
                            var doc2 ;
                            doc2 = {
                                roomId:doc[i].roomId,
                                newNo:doc[i].newNo,
                                isDelete:doc[i].isDelete,
                                isComputed:"false",
                                userInfoList:[]
                            }
                            for (var j =0;j<doc[i].userInfoList.length;j++){
                                if (doc[i].userInfoList[j].isEnd != "true") {
                                    doc2.userInfoList.push({
                                        userName:doc[i].userInfoList[j].userName,
                                        IDNo:doc[i].userInfoList[j].IDNo,
                                        startTime:doc[i].userInfoList[j].startTime,
                                        usedNo:0,
                                        isEnd:"false",
                                        endTime:doc[i].userInfoList[j].endTime
                                    })
                                }
                            }
                            doc1.push(doc2)

                        }else if (doc[i].isComputed == "false"&& doc[i].isDelete == "false") {
                            //暂时不处理
                            doc1.push({
                                roomId:doc[i].roomId,
                                newNo:doc[i].newNo,
                                isDelete:doc[i].isDelete,
                                isComputed:"false",
                                userInfoList:doc[i].userInfoList
                            })
                        }
                    }
                    //console.log(doc1)

                    doc1.forEach(function (item) {
                        //console.log(item)
                        dynamicdormrooms.updateOne({"roomId":item.roomId},item,function (err1,doc1) {
                            if (err1) {
                                //console.log("定时更新失败"+err1)
                            }else{
                                //console.log("定时更新成功"+doc1)
                            }
                        })
                        var data1 = {
                            month:d.getFullYear()+"."+(d.getMonth()),
                            roomInfo:[]
                        }
                        databackups.find({month:d.getFullYear()+"."+(d.getMonth())},function (err6,doc6) {
                            if (err6){
                                //console.log(err6)
                            } else if (doc6.length == 0){
                                //console.log("shujuweikong")
                                databackups.create(data1)
                            } else{
                                databackups.findOneAndUpdate({month:d.getFullYear()+"."+(d.getMonth())},{$push:{roomInfo:item}},function (errr,doccc) {
                                    if (errr){
                                        //console.log("更新databackups数据失败"+errr)
                                    } else{
                                        //console.log("更新databackups数据成功"+doccc)
                                    }
                                })
                                //console.log("oiwregjeorihjreoohj"+doc6)
                            }
                        })
                    })

                    dynamicdormrooms.deleteMany({"isDelete":"true"},function (err2,doc2) {
                        if (err2) {
                            //console.log("定时更新(删除无关数据)失败"+err2)
                        }else{
                            //console.log("定时更新(删除无关数据)成功"+doc2)
                        }
                    })



                }
            })

        });
    },
    update:() =>{
        schedule.scheduleJob('30 47 8 6 6 *',()=>{
            process.exit()
        })
    }
};


module.exports = app;