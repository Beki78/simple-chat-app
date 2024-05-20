import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const App = () => {
  //use state
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  //use effect
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });

    socket.on("typing-from-server", (data) => {
      console.log("typing...");
    });
  }, [socket]);

  // declaration
  const handleForm = (event) => {
    event.preventDefault();
    socket.emit("send-message", { message });
    setChat((prev) => [...prev, { message, received: false }]);
    setMessage("");
  };

  // Ensure the chat box scrolls to the bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <>
      <div className="h-screen flex justify-center items-center flex-col bg-gradient-to-br from-slate-400 via-slate-300 to-slate-100">
        <h1 className="text-4xl font-bold mt-4">SOCKET IO - Chat App</h1>
        <div
          ref={chatBoxRef}
          className="custom-scrollbar border-2 border-slate-500 h-[50vh] w-96 mt-14 overflow-y-auto  rounded-md shadow-xl shadow-slate-300 bg-white"
        >
          {chat.map((data, index) => (
            <div
              key={index}
              className={`p-2 m-2 rounded text-lg font-semibold ${
                data.received ? "text-right" : "text-left"
              }`}
            >
              {data.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleForm}>
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="resize-y w-96 h-14 pr-3 pl-2 py-1 border-2 border-slate-500 outline-none my-1  rounded-md"
          />
          <button
            type="submit" hover:bg-indigo-700
            className="bg-indigo-600 py-3 w-full justify-center items-center flex  rounded-md text-white hover:bg-indigo-700"
          >
            SEND
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
