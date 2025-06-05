const NotificationService = require("../service/NotificationService");

const SendFirebaseNotification = async (req, res) => {
    try{
        const { title, body, deviceToken } = req.body;
        const result = await NotificationService.sendNotification(deviceToken,
             title, body);
        res.status(200).json({ message: "Notification sent", result: result});
    } catch (err){
        console.error("Eroare la SendFirebaseNotification:", err);
        res.status(500).json({ message: "Eroare la SendFirebaseNotification", error: err.message });
    }
}

module.exports = { SendFirebaseNotification };