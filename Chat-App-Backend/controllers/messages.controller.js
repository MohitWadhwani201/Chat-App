import {User} from "../models/user.model.js";
import Message from "../models/messages.model.js";
export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId
        const user2 = req.body.id

        if (!user1|| !user2) {
            return res.status(405).send("Both user ids are required ");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({timestamp:1})
        return res.status(200).json({ messages });
 
    } catch (error) {
        throw new ApiError(500, "Something went wrong during logout");
    }
};
