var serviceUtils = require('../utils/service.utils.js');
var richCardUtils = require('../utils/richCard.utils.js');

exports.cancelOrder=function(session, args, builder){
    serviceUtils.invokeATGService(session,args, function(jsonRes){
        var emailInput = session.userData.userInfo.email;
        var phoneInput = session.userData.userInfo.phoneNumber;
        var email = "";
        var phone = "";
        var status = false;
        var paymentJSON = jsonRes.paymentResult[0];
        email = paymentJSON.billingAddress.email;
        phone = paymentJSON.billingAddress.phoneNumber;
        console.log(email + ":"+ phone);
        console.log(emailInput + ":"+ phoneInput);
        if(emailInput != email &&  phoneInput != phone){
            console.log('No match!!');
            status = false;
        }else{
            status = true;
        }
        console.log('Return value..'+status);
        if(status){
            session.send('We have sucessfully verified your details');
            serviceUtils.invokeCancelATGService(session,args);
            this.sendCancelConfirmation(session,args,jsonRes, builder);
        }else{
            session.send('Sorry your details dont match, try again');
        }
    });
}

sendCancelConfirmation = function (session, args, jsonRes, builder){
    var msg = richCardUtils.createReceiptCard(session, args, jsonRes, builder);
	session.send(msg);
}