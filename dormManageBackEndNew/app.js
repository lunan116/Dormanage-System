var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var updateService = require('./updateService/updateDynamicDormRoomsService');
var updateRoomRechargesService = require('./updateService/updateUsersforRoomChargesService');


var app = express();
var d = new Date();

app.use(bodyParser.urlencoded({ extended: false })); //解析request中body的urlencoded字符

// 跨域设置
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

global.dbHelper = require('./common/dbHelper');
mongoose.set('useFindAndModify', false)
global.db = mongoose.connect("mongodb://127.0.0.1:27017/dorm",{useNewUrlParser: true, useUnifiedTopology: true});
console.log("连接数据库成功");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

var routeRouter = require('./routes/route');
app.use('/', routeRouter);

//console.log(updateService.a)
updateService.updateInfo();
updateService.update();
updateRoomRechargesService.updatRecharges();

global.roomNum = -1;     //定义房间数
global.bedNum = -1;      //定义床位总数
global.usersNum = -1;    //定义用户数
global.vacantRoomNum = -1;//定义空房间数
global.roomNumRate = 0;
global.bedNumRate = 0;
global.usersNumRate = 0;
global.vacantRoomNumRate = 0;
global.refleshTimeroomNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
global.refleshTimebedNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
global.refleshTimeusersNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
global.refleshTimevacantRoomNum = d.toLocaleDateString()+"  "+d.toLocaleTimeString(); //更新时间
//console.log(refleshTime)

app.listen( '5002',function () {
    console.log("server is running on the port:5002");
})