exports.createSuggestedActions = function(builder, session){
    var msg = new builder.Message(session)
	.text("I can help with the following.Please contact customer service at (xxx)xxx-xxxx for other Issues")
	.suggestedActions(	
		builder.SuggestedActions.create(
				session, [
					builder.CardAction.imBack(session, "Track Order", "Track My Order"),
					builder.CardAction.imBack(session, "Cancellation", "Order Cancellation"),
					builder.CardAction.imBack(session, "Store Locator", "Store Locator")
				]
            ));
    return msg;
}

exports.createReceiptCard = function(session, args, jsonRes, builder){
    var payment = jsonRes.paymentResult[0];
    var commerceItems = jsonRes.result.commerceItems;
    var receiptCard = new builder.ReceiptCard(session)
        .title('Order Cancelled '+jsonRes.result.id)
        .facts([
            builder.Fact.create(session, payment.billingAddress.firstName+" "+payment.billingAddress.lastName , 'Name'),
            builder.Fact.create(session, payment.creditCardType+' '+payment.creditCardNumber+'-****', 'Payment Method')
        ]);
    var receiptItems = [];
    commerceItems.forEach(function(item){
        var ritem = builder.ReceiptItem.create(session, "$"+item.priceInfo.amount, item.productDisplayName)
                .quantity('1')
                .image(builder.CardImage.create(session, 
                    'https://i5.walmartimages.com/asr/a35e12f0-e263-462e-9fab-1c544f029ce1_2.a0513cc09df17ddc76e1240bb44a3090.jpeg?odnHeight=100&odnWidth=100&odnBg=FFFFFF'))
        receiptItems.push(ritem);		
    });
        
    receiptCard.items(receiptItems);

    receiptCard.tax('$' + jsonRes.result.priceInfo.tax);
    receiptCard.total('$' + jsonRes.result.priceInfo.total);

    session.send("Order Cancelled sucesfully. Refund will be issued by 3-5 Business Days");
    var msg = new builder.Message(session).addAttachment(receiptCard);
    return msg;
}

exports.createAdaptiveCard = function (session, args, jsonRes, builder){
	var email = jsonRes.paymentResult[0].billingAddress.email;
	if(email == null){
		email = "";
	}
	var phone = jsonRes.paymentResult[0].billingAddress.phoneNumber;
	if(phone == null){
		phone = "";
	}
	var trackingNum = jsonRes.shippingResult[0].trackingNumber;
	var trackingURL = "";
	if(trackingNum != undefined && trackingNum!= null){
		trackingURL =  "http://www.fedex.com?trackingNum="+trackingNum;
	}else{
		trackingURL =  "http://www.fedex.com?trackingNum="+789876;
	}
	var totalItemCount = (jsonRes.result.totalCommerceItemCount).toString();
	var name = jsonRes.paymentResult[0].billingAddress.firstName + 
		" " + jsonRes.paymentResult[0].billingAddress.lastName;
	var orderId = jsonRes.result.id;
	var items = jsonRes.result.commerceItems;
	var paymentInfo = jsonRes.paymentResult[0].creditCardType +
		" ************" + jsonRes.paymentResult[0].creditCardNumber;
	var tax = jsonRes.result.priceInfo.tax;
	var total = jsonRes.result.priceInfo.total;
	var shipState = jsonRes.shippingResult[0].state;
	var total = (jsonRes.result.priceInfo.total).toString();
	total = total.substring(0, total.indexOf('.')+3);
	var today = new Date();
	var msg;
	if(shipState != undefined && shipState == 104){
		today.setDate(today.getDate() + 1);
		var stringDate = today.toDateString();
		msg = new builder.Message(session).addAttachment({
		contentType: "application/vnd.microsoft.card.adaptive",
		content: {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [
					{
						"type": "Container",
						"items": [
							{
								"type": "TextBlock",
								"text": "Your Order Status",
								"weight": "bolder",
								"size": "medium"
							}
						]
					},
					{
						"type": "Container",
						"items": [
							{
								"type": "FactSet",
								"separator": true,
								"facts": [
									{
										"title": "Order Number",
										"value": orderId
									},
									{
										"title": "Full Name",
										"value": name
									},
									{
										"title": "Payment Type",
										"value": paymentInfo
									},
									{
										"title": "Order Total",
										"value": total
									},
									{
										"title": "Items",
										"value": totalItemCount
									},
									{
										"title": "Status",
										"value": "Shipped, On your way!"
									},
									{
										"title": "Tracking",
										"value": trackingURL
									},
									{
										"title": "Estimated Arrival",
										"value": stringDate
									},
									{
										"title": "Contact",
										"value": email + "/" + phone
									}
								]
							}
						]
					}
				]
			}
		});		
	}else{
		today.setDate(today.getDate() + 3);
		var stringDate = today.toDateString();
		console.log(stringDate);
		msg = new builder.Message(session).addAttachment({
		contentType: "application/vnd.microsoft.card.adaptive",
		content: {
			"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
			"type": "AdaptiveCard",
			"version": "1.0",
			"body": [
					{
						"type": "Container",
						"items": [
							{
								"type": "TextBlock",
								"text": "Your Order Status",
								"weight": "bolder",
								"size": "medium"
							}
						]
					},
					{
						"type": "Container",
						"items": [
							{
								"type": "FactSet",
								"separator": true,
								"facts": [
									{
										"title": "Order Number",
										"value": orderId
									},
									{
										"title": "Full Name",
										"value": name
									},
									{
										"title": "Payment Type",
										"value": paymentInfo
									},
									{
										"title": "Order Total",
										"value": total
									},
									{
										"title": "Items",
										"value": totalItemCount
									},
									{
										"title": "Status",
										"value": "Your Order is currently being processed!"
									},
									{
										"title": "Estimated Arrival",
										"value": stringDate
									},
									{
										"title": "Contact",
										"value": email + "/" + phone
									}
								]
							}
						]
					}
				]
			}
		});
    }
    return msg;
}