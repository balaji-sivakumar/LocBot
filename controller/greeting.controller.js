var richCardUtils = require('../utils/richCard.utils.js');

exports.greetCustomer = function(builder, session, args){
    if(session.userData){
		var orderInfo = {
			orderId : ''
		};
		var userInfo = {
			isCancel : false,
			isTrack : false,
			orderInfo : orderInfo,
			email : '',
			phoneNumber : '',
			trackingNumber: '',
			totalItemCount: '',
			estimatedArrival: ''
		};
		session.userData.userInfo = userInfo;
	}
    session.send('Welcome to the CSC Bot');
    if(args && args.intent){
        var name = builder.EntityRecognizer.findEntity(args.intent.entities, 'Name');
        if(name != null){
            session.send('Hello  %s!', name.entity);
            session.send('I am a Bot. How can I help you?');
        } else {
            session.send('Hi, I am a Bot. How can I help you?');
        }
    }else{
        session.send('Hi, I am a Bot. How can I help you?');
	}
	var msg = richCardUtils.createSuggestedActions(builder, session);
    session.send(msg);
}

exports.defaultGreet = function(builder, session, args){
    if(session.userData){
		var orderInfo = {
			orderId : ''
		};
		var userInfo = {
			isCancel : false,
			isTrack : false,
			orderInfo : orderInfo,
			email : '',
			phoneNumber : '',
			trackingNumber: '',
			totalItemCount: '',
			estimatedArrival: ''
		};
		session.userData.userInfo = userInfo;
    }
    var msg = richCardUtils.createSuggestedActions(builder, session);
    session.send(msg);
}