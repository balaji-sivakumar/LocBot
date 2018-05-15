var http = require('http');

var optionsGet = {
    host : process.env.ATG_SERVICE, // here only the domain name
    // (no http/https !)
    port : process.env.ATG_SERVICE_PORT,
    path : '/rest/model/atg/commerce/order/OrderLookupActor/orderLookupById?orderId=ID',
    method : 'GET'
};

var cancelPost = {
    host : process.env.ATG_SERVICE, // here only the domain name
    // (no http/https !)
    port : process.env.ATG_SERVICE_PORT,
    path : '/rest/model/atg/commerce/order/purchase/CancelOrderActor/cancelOrder?orderIdToCancel=ID',
	method : 'POST',
};

exports.invokeATGService = function (session, args, jsonRes){
	console.log('BEGIN: Invoke ATG Rest API for Status of Order');
	var path = optionsGet.path;
	var status = false;
	path = path.replace('ID', session.userData.userInfo.orderInfo.orderId);
	optionsGet.path = path;
	var reqGet = http.request(optionsGet, function(res) {
	var orderJSON = "";
    console.log("statusCode: ", res.statusCode);
		res.on('data', function(d) {
            if(d){
                console.info('GET result:\n'+d);
			    orderJSON = JSON.parse(d.toString());
            }
		});
		res.on('end', function() {
			jsonRes(orderJSON);
		});
		res.on('error', function(e) {
			console.error(e);
		});
	}).end();
}

exports.invokeCancelATGService = function (session, args){
	console.log('BEGIN: Invoke ATG Rest API for Cancel Order');
	var path = cancelPost.path;
	var status = false;
	path = path.replace('ID', session.userData.userInfo.orderInfo.orderId);
	cancelPost.path = path;
	var reqGet = http.request(cancelPost, function(res) {
	var orderJSON = "";
    console.log("statusCode: ", res.statusCode);
		res.on('data', function(d) {
			console.info('GET result:\n'+d);
		});
		res.on('end', function() {
		});
		res.on('error', function(e) {
			console.error(e);
		});
	}).end();
}