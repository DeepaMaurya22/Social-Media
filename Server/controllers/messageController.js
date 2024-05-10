import Message from "../models/MessageModel.js";

const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  // console.log("--------------------------");
  // console.log(chatId);
  // console.log(senderId);
  // console.log(text);
  // console.log("--------------------------");

  const message = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addMessage, getMessages };
