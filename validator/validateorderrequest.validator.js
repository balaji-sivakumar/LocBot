exports.performVerification = function(builder, session, args){
	var orderId = builder.EntityRecognizer.findEntity(args.intent.entities, 'Order Id');
	var isTrack = builder.EntityRecognizer.findEntity(args.intent.entities, 'Operation::Status');
	var isCancel = builder.EntityRecognizer.findEntity(args.intent.entities, 'Operation::Cancel');
	
	if(isCancel){
		session.userData.userInfo.isCancel=true;
	}

	if(isTrack){
		session.userData.userInfo.isTrack=true;
		session.userData.userInfo.isCancel=false;
	}
	
	var email = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.email');
	var phoneNumber = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.phonenumber');
	var performInfoExists = false;
	console.log("Args Intent:"+JSON.stringify(args.intent));
	console.log("Args Intent Entities:"+JSON.stringify(args.intent.entities));
	console.log("Session Email:"+email);
	if(orderId){
		console.log("Order Id", orderId.entity);
	}
	if(email){
		console.log("Email", email.entity);
	}
	if(phoneNumber){
		console.log("Phone Number", phoneNumber.entity);
	}
	
	if(orderId && orderId.entity ){
		session.userData.userInfo.orderInfo.orderId=orderId.entity;
	}
	if(email && email.entity){
		session.userData.userInfo.email=email.entity;
	}
	if(phoneNumber && phoneNumber.entity){
		session.userData.userInfo.phoneNumber=phoneNumber.entity;
	}

	if(!session.userData.userInfo){
		session.send('Can you proivde your email or phone number for verification');
	}

	if(session.userData.userInfo.orderInfo.orderId){
		session.send('Your Order Id  %s!', session.userData.userInfo.orderInfo.orderId);
		if(!session.userData.userInfo.email && !session.userData.userInfo.phoneNumber){
			session.send('Can you provide your email or phone number for verification');
		}else if(session.userData.userInfo.email){
			session.send('Thanks, I am verifying your details with your order');
			performInfoExists = true;
		}else if(session.userData.userInfo.phoneNumber){
			session.send('Thanks, I am verifying your details with your order');
			performInfoExists = true;
		}
	} else {
		session.send('Can you please provide your order number');
	}
	if(performInfoExists && session.userData.userInfo.orderInfo.orderId){
		return true;
	}else{
		return false;
	}
}