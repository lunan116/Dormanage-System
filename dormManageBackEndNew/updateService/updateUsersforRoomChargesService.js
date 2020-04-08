var express = require('express');
var schedule = require('node-schedule');
var moment = require('moment');

var app = {
    a:'111',
    updatRecharges : () => {
        //每个月一日凌晨一点零一分三十秒执行更新上个月的房费
        schedule.scheduleJob('30 47 10 7 * *',()=>{
            //获取每个月的天数
            function mGetDate(year, month){
                var dc = new Date(year, month, 0);
                return dc.getDate();
            }
            /*时间格式化*/
            function a(d){
                if(parseInt(d) < 10){
                    return  "0"+d
                }else{
                    return d
                }
            }
            function timestampToTime(timestamp) {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = a(date.getDate()) + ' ';
                var h = a(date.getHours()) + ':';
                var m = a(date.getMinutes()) + ':';
                var s = a(date.getSeconds());
                return Y + M + D + h + m + s;
            }
            var d = new Date();
            var roomcharges = global.dbHelper.getModel('roomcharges');
            var dormrooms = global.dbHelper.getModel('dormrooms');
            var usersforroomcharges = global.dbHelper.getModel('usersforroomcharges');
            roomcharges.find({},function (err,doc) {
                if (err){
                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUsersforRoomChargesService.js 查询roomcharges数据集合失败" + err)
                } else{
                    dormrooms.find({isDelete:"false"},function (err1,doc1) {
                        if (err1){
                            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUsersforRoomChargesService.js 查询dormrooms数据集合失败" + err)
                        }else{
                            usersforroomcharges.find({isEnd:"false"},function (err2,doc2) {
                                var doc4 = [];
                                /*for (let i=0;i<doc1.length;i++){
                                    var obj = {
                                        roomNo:doc1[i].roomNo,
                                        maxNo:doc1[i].maxNo
                                    };
                                    for (let j=0;j<doc2.length;j++){
                                        if (doc2[j].roomId == doc1[i]._id){
                                            obj.userName = doc2[j].userName;
                                            obj.IDNo = doc2[j].IDNo;
                                            obj.startTime = doc2[j].startTime;
                                            obj.gender = doc2[j].gender;
                                            obj.startNo = doc2[j].startNo;
                                            obj.phoneNo = doc2[j].phoneNo;
                                            obj.belongToCompany = doc2[j].belongToCompany;
                                            obj.rank = doc2[j].rank;
                                            obj.monthFee = doc2[j].monthFee;
                                            obj.endTime = doc2[j].endTime;
                                            obj.isEnd = doc2[j].isEnd;
                                            obj.roomId = doc2[j].roomId;
                                            obj.roomRechargesList = doc2[j].roomRechargesList;
                                        }
                                    }
                                    for (let k= 0;k<doc.length;k++){
                                        if (doc[k].maxNo == doc1[i].maxNo){
                                            obj.charges = doc[k].charges
                                        }
                                    }
                                    doc4.push(obj)
                                }*/

                                for (let j=0;j<doc2.length;j++){
                                    var obj = {};
                                    for (let i=0;i<doc1.length;i++){
                                        if (doc2[j].roomId == doc1[i]._id){
                                            obj.roomNo=doc1[i].roomNo;
                                            obj.maxNo=doc1[i].maxNo
                                            obj.userName = doc2[j].userName;
                                            obj.IDNo = doc2[j].IDNo;
                                            obj.startTime = doc2[j].startTime;
                                            obj.gender = doc2[j].gender;
                                            obj.startNo = doc2[j].startNo;
                                            obj.phoneNo = doc2[j].phoneNo;
                                            obj.belongToCompany = doc2[j].belongToCompany;
                                            obj.rank = doc2[j].rank;
                                            obj.monthFee = doc2[j].monthFee;
                                            obj.endTime = doc2[j].endTime;
                                            obj.isEnd = doc2[j].isEnd;
                                            obj.roomId = doc2[j].roomId;
                                            obj.roomRechargesList = doc2[j].roomRechargesList;
                                            for (let k= 0;k<doc.length;k++){
                                                //console.log("j:"+j+" i:"+i+" k:"+k+" doc[k].maxNo:"+doc[k].maxNo+" doc1[i].maxNo:"+doc1[i].maxNo)
                                                if (doc[k].maxNo == doc1[i].maxNo){
                                                    obj.charges = doc[k].charges
                                                }
                                            }
                                        }

                                    }
                                    if (obj.hasOwnProperty('roomNo') ){
                                        doc4.push(obj)
                                    }
                                }
                                //console.log(doc4)
                                var doc5 = []
                                for (let i=0;i<doc4.length;i++){
                                    var date = timestampToTime(parseInt(doc4[i].startTime));
                                    var year = date.substring(0,4);
                                    var month = date.substring(5,7);
                                    var date1 = date.substring(8,10);
                                    if (parseInt(year)< parseInt(d.getFullYear()) || (parseInt(year)== parseInt(d.getFullYear()) &&
                                        parseInt(month)+1<parseInt(d.getMonth()+1))){
                                        //一个月以上按月结算
                                        var narr = doc4[i].roomRechargesList;
                                        //var dNum = mGetDate(d.getFullYear(),d.getMonth()+1);//当月的天数
                                        //charges = (parseInt(d.getDate())-parseInt(date1))*parseInt(doc4[i].charges)/parseInt(dNum);
                                        //console.log("dnum:"+dNum);
                                        narr.push({
                                            month:d.getFullYear()+"."+(d.getMonth()),
                                            monthlyRecharges:doc4[i].charges
                                        })
                                        doc5.push({
                                            userName:doc4[i].userName,
                                            IDNo:doc4[i].IDNo,
                                            startTime:doc4[i].startTime,
                                            monthFee:doc4[i].monthFee,
                                            gender:doc4[i].gender,
                                            startNo:doc4[i].startNo,
                                            phoneNo:doc4[i].phoneNo,
                                            belongToCompany:doc4[i].belongToCompany,
                                            rank:doc4[i].rank,
                                            endTime:doc4[i].endTime,
                                            isEnd:doc4[i].isEnd,
                                            roomId:doc4[i].roomId,
                                            roomRechargesList:narr
                                        })
                                    }else{
                                        // 未满一个月按天结算
                                        var narr = doc4[i].roomRechargesList;
                                        var dNum = mGetDate(d.getFullYear(),d.getMonth());//上个月的天数
                                        //charges = (parseInt(d.getDate())-parseInt(date1))*parseInt(doc4[i].charges)/parseInt(dNum);
                                        //console.log("dnum:"+dNum);
                                        narr.push({
                                            month:d.getFullYear()+"."+(d.getMonth()),
                                            monthlyRecharges:doc4[i].charges/parseInt(dNum)*(parseInt(dNum)-parseInt(date1))
                                        })
                                        doc5.push({
                                            userName:doc4[i].userName,
                                            IDNo:doc4[i].IDNo,
                                            startTime:doc4[i].startTime,
                                            monthFee:doc4[i].monthFee,
                                            gender:doc4[i].gender,
                                            startNo:doc4[i].startNo,
                                            phoneNo:doc4[i].phoneNo,
                                            belongToCompany:doc4[i].belongToCompany,
                                            rank:doc4[i].rank,
                                            endTime:doc4[i].endTime,
                                            isEnd:doc4[i].isEnd,
                                            roomId:doc4[i].roomId,
                                            roomRechargesList:narr
                                        })
                                    }

                                }
                                //console.log(doc5)
                                function f(num){
                                    if(num<1){
                                        return 1;
                                    }else{
                                        usersforroomcharges.updateMany({userName:doc4[num-1].userName,IDNo:doc4[num-1].IDNo,startTime:doc4[num-1].startTime,startNo:doc4[num-1].startNo,roomId:doc4[num-1].roomId},
                                            doc5[num-1],function (errr,doccc) {
                                                if (errr){
                                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  updateUsersforRoomChargesService.js  更新usersforroomcharges数据集合失败"+errr)
                                                    //console.log(errr)
                                                } else{
                                                    //console.log(doccc)
                                                }
                                            });
                                        return f(num-1);
                                    }
                                }
                                f(doc5.length)
                            })
                        }
                    })
                }
            })
        })
    }
};


module.exports = app;






















