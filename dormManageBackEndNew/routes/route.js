var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res, next) {
    res.send('respond with a resource');

});*/

var loginRouter = require('./login/login');
var addRoomRouter = require('./dormManage/addRoom');
var getDormNoRouter = require('./dormManage/getDormNo');
var deleteRoomRouter = require('./dormManage/deleteRoom');
var updateRoomInfoRouter = require('./dormManage/updateRoomInfo');
var getDormStatusRouter = require('./dormManage/getDormStatus');
var createUerInfoRouter = require('./dormManage/createUserInfo');
var getUserInfoRouter = require('./dormManage/getUserInfo');
var updateUserInfoRouter = require('./dormManage/updateUserInfo');
var getMonthsPowerUseNoRouter = require('./dormManage/getMonthsPowerUseNo');
var monthlySettlementRouter = require('./dormManage/monthlySettlement');
var getMonthUserInfoRouter = require('./dormManage/getMonthUserInfo');
var getDataViewRouter = require('./dormManage/getDataView');
var addRoomChargesRouter = require('./roomCharges/addRoomCharges');
var getRoomChargesRouter = require('./roomCharges/getRoomCharges');
var deleteRoomChargesRouter = require('./roomCharges/deleteRoomCharges');
var updateRoomChargesRouter = require('./roomCharges/updateRoomCharges');
var getMonthPeopleRechargesRouter = require('./roomCharges/getMonthPeopleRecharges');
var getdatasRouter = require('./dataView/getdatas');



router.use('/login',loginRouter);
router.use('/addRoom',addRoomRouter);
router.use('/getDormNo',getDormNoRouter);
router.use('/deleteRoom',deleteRoomRouter);
router.use('/updateRoomInfo',updateRoomInfoRouter);
router.use('/getDormStatus',getDormStatusRouter);
router.use('/createUserInfo',createUerInfoRouter);
router.use('/getUserInfo',getUserInfoRouter);
router.use('/updateUserInfo',updateUserInfoRouter);
router.use('/getMonthsPowerUseNo',getMonthsPowerUseNoRouter);
router.use('/monthlySettlement',monthlySettlementRouter);
router.use('/getMonthUserInfo',getMonthUserInfoRouter);
router.use('/getDataview',getDataViewRouter);
router.use('/addRoomCharges',addRoomChargesRouter);
router.use('/getRoomCharges',getRoomChargesRouter);
router.use('/deleteRoomCharges',deleteRoomChargesRouter);
router.use('/updateRoomCharges',updateRoomChargesRouter);
router.use('/getMonthPeopleRecharges',getMonthPeopleRechargesRouter);
router.use('/getdatas',getdatasRouter);

module.exports = router;