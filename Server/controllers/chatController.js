import Chat from "../models/ChatModel.js";

const createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res
        .status(400)
        .json({ message: "Sender ID and Receiver ID are required" });
    }

    const newChat = new Chat({
      members: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(201).json(result); // Use 201 for resource creation
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const userChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    if (chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user" });
    }
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;

    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { createChat, userChats, findChat };
