var restify = require('restify');
var builder = require('botbuilder');
var locationDialog = require('botbuilder-location');
require('dotenv').config();
var orderTrackController = require('./controller/ordertrack.controller.js');
var orderCancelController = require('./controller/ordercancel.controller.js');
var richCardUtils = require('./utils/richcard.utils.js');
var greetingController = require('./controller/greeting.controller.js');
var orderValidator = require('./validator/validateorderrequest.validator.js');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
var MICROSOFT_APP_ID = '61a5b5f7-7633-41b0-b28c-0558da4c6175';//process.env.MICROSOFT_APP_ID;
var MICROSOFT_APP_PASSWORD = 'pYykopp8pTVQToKppDXwYZQ';//process.env.MICROSOFT_APP_PASSWORD;
var LUIS_MODEL_URL='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/381e1f22-8676-4228-bd17-e94917120526?subscription-key=fbd6c82bc4f149eeba4a1ae5d5ffde60&timezoneOffset=0&verbose=true&q=';//process.env.LUIS_MODEL_URL;

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: MICROSOFT_APP_ID,
    appPassword: MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);//, function (session, args) {
//	greetingController.defaultGreet(builder, session, args);
//});
var recognizer = new builder.LuisRecognizer(LUIS_MODEL_URL);
bot.recognizer(recognizer);

/**
bot.dialog('Greeting', function (session, args, next) {
	greetingController.greetCustomer(builder, session, args);
}).triggerAction({
	matches: 'Greet'
});

bot.dialog('Order Status', function (session, args, next) {
	console.log(session.userData.userInfo);
	var verified = orderValidator.performVerification(builder, session, args);
	if(verified){
		console.log("Cancel:"+session.userData.userInfo.isCancel);
		console.log("Track:"+session.userData.userInfo.isTrack);
		if(session.userData.userInfo.isTrack){
			orderTrackController.trackOrder(session, args, builder);	
		}
		if(session.userData.userInfo.isCancel){
			orderCancelController.cancelOrder(session, args, builder);
		}	
	}
}).triggerAction({
	matches: 'Order Status'
});
 */
bot.library(locationDialog.createLibrary('ApaAKG_HhEQA-PeVENSPSK2Mnw8lfeqwINtl-Y23EzTKCymvyj0HdLTR2wzS9izs'));

bot.dialog("/", [
    function (session) {
        var options = {
            prompt: "Enter your delivery location",
            useNativeControl: true,
            reverseGeocode: true,
			skipFavorites: false,
			skipConfirmationAsk: true,
            requiredFields:
                locationDialog.LocationRequiredFields.streetAddress |
                locationDialog.LocationRequiredFields.locality |
                locationDialog.LocationRequiredFields.region |
                locationDialog.LocationRequiredFields.postalCode |
                locationDialog.LocationRequiredFields.country
        };

        locationDialog.getLocation(session, options);
    },
    function (session, results) {
        if (results.response) {
            var place = results.response;
			var formattedAddress = 
            session.send("Thanks, I will ship to " + getFormattedAddressFromPlace(place, ", "));
        }
    }
]);

function getFormattedAddressFromPlace(place, separator) {
    var addressParts = [place.streetAddress, place.locality, place.region, place.postalCode, place.country];
    return addressParts.filter(i => i).join(separator);
}
