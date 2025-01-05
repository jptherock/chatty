const messageModel = require('../Models/messageModels');

module.exports.addMessage = async (req, res,next) => {
    try{
            const {from,to,message} = req.body;
            const data  = await new messageModel({
                message:{
                    text:message,
                },
                users:[from,to],
                sender:from
            }).save();

            if(data) return res.status(201).json({ message: "Message sent successfully"});
            return res.status(400).json({ message: "Failed to add message to the database" ,status:false});
    }
    catch(ex){
        next(ex)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
      const { from, to } = req.query;

      // Query Database
      const messages = await messageModel.find({
        users: { $all: [from, to] },
      }).sort({ updatedAt: 1 });
  
      // Transform messages for the response
      const projectMessage = messages.map((msg) => ({
        fromSelf: msg.sender.toString() === from.toString(),
        message: msg.message.text,
        timestamp: msg.createdAt,
      }));
  
      return res.status(200).json(projectMessage);
    } catch (ex) {
      console.error("Error in getAllMessage:", ex);
      next(ex);
    }
  };
  