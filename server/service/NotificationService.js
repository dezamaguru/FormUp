const admin = require("../firebaseUtils/firebase");

class NotificationService{

    static async sendNotification(deviceToken, title, body){
        const message = {
            notification: {
                title, body
            },
            token: deviceToken
        };

        try{
            const response = await admin.messaging().send(message);
            return response;
        } catch(Err){
            throw Err;
        }
    }
}

module.exports = NotificationService;