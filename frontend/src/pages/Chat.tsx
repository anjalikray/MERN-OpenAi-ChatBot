import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "../context/authContext";
import ChatItem from "../components/chat/ChatItem";
import { useLayoutEffect, useRef, useState } from "react";
import { getUserChats, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";

//static chats
// const chatMessages = [
//     {
//         role: "user",
//         content:
//             "Hello! Can you help me with some information on DevOps practices?",
//     },
//     {
//         role: "assistant",
//         content: "Of course! What specific information are you looking for?",
//     },
//     {
//         role: "user",
//         content: "I need to understand the key concepts of CI/CD.",
//     },
//     {
//         role: "assistant",
//         content:
//             "CI/CD stands for Continuous Integration and Continuous Deployment. Continuous Integration is a practice where developers regularly merge their code changes into a central repository, followed by automated builds and tests. Continuous Deployment is the process of automatically deploying the code changes to production after passing the CI phase.",
//     },
//     {
//         role: "user",
//         content: "What tools are commonly used for CI/CD?",
//     },
//     {
//         role: "assistant",
//         content:
//             "Common CI/CD tools include Jenkins, GitLab CI/CD, GitHub Actions, CircleCI, and Travis CI. Each tool offers different features and integrations to help streamline the build, test, and deployment processes.",
//     },
//     {
//         role: "user",
//         content: "Can you explain the role of Docker in a DevOps pipeline?",
//     },
//     {
//         role: "assistant",
//         content:
//             "Docker is used to create, deploy, and run applications in containers. In a DevOps pipeline, Docker helps ensure consistency across multiple development, testing, and production environments by packaging the application and its dependencies into a single container. This makes the deployment process more reliable and scalable.",
//     },
//     {
//         role: "user",
//         content: "What is Kubernetes and how does it relate to Docker?",
//     },
//     {
//         role: "assistant",
//         content:
//             "Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It works in conjunction with Docker by managing Docker containers, providing features like load balancing, scaling, and automated rollouts and rollbacks.",
//     },
//     {
//         role: "user",
//         content: "Thank you! This has been very helpful.",
//     },
//     {
//         role: "assistant",
//         content:
//             "You're welcome! If you have any more questions, feel free to ask.",
//     },
// ];

type Messages = {
    role: "user" | "assistant";
    content: string;
};

const Chat = () => {
    const [chatMessages, setChatMessages] = useState<Messages[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async () => {
        // console.log(inputRef.current?.value);
        const content = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: Messages = { role: "user", content };
        setChatMessages((prev) => [...prev, newMessage]);

        const chatData = await sendChatRequest(content);
        setChatMessages([...chatData.chats]);
    };

    const auth = useAuth();

    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            toast.loading("Loading Chats", { id: "loadchats" });
            getUserChats()
                .then((data) => {
                    setChatMessages([...data.chats]);
                    toast.success("Successfully loaded chats", {
                        id: "loadchats",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Loading chats failed", { id: "loadchats" });
                });
        }
    }, [auth]);

    return (
        <Box
            sx={{
                display: "flex",
                flex: 1,
                width: "100%",
                height: "100%",
                mt: 3,
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: { md: "flex", xs: "none", sm: "none" },
                    flex: 0.2,
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: "60vh",
                        bgcolor: "rgb(17,29,39)",
                        borderRadius: 5,
                        flexDirection: "column",
                        mx: 3,
                    }}
                >
                    <Avatar
                        sx={{
                            mx: "auto",
                            my: 2,
                            bgcolor: "white",
                            color: "black",
                            fontWeight: 700,
                        }}
                    >
                        {auth?.user?.name[0]}
                        {auth?.user?.name.split(" ")[1][0]}
                    </Avatar>
                    <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
                        You are talking to a ChatBot
                    </Typography>
                    <Typography
                        sx={{
                            my: 4,
                            p: 3,
                            mx: "auto",
                            fontFamily: "work sans",
                        }}
                    >
                        You can ask some questions related to Knowledge,
                        Bussiness, Advices, Education, etc. But avoide personal
                        information
                    </Typography>
                    <Button
                        sx={{
                            width: "200px",
                            my: "auto",
                            color: "white",
                            fontWeight: 700,
                            borderRadius: 3,
                            mx: "auto",
                            bgcolor: red[300],
                            ":hover": {
                                bgcolor: red.A400,
                            },
                        }}
                    >
                        Clear Conversation
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flex: { md: 0.8, xs: 1, sm: 1 },
                    flexDirection: "column",
                    px: 3,
                }}
            >
                <Typography
                    sx={{
                        textAlign: "center",
                        fontSize: "40px",
                        color: "white",
                        mb: 2,
                        mx: "auto",
                        fontWeight: 600,
                    }}
                >
                    Model- GPT 3.5 Turbo
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        borderRadius: 3,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "scroll",
                        overflowX: "hidden",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                    }}
                >
                    {chatMessages.map((chat, index) => (
                        <ChatItem
                            //@ts-ignore
                            content={chat.content}
                            role={chat.role}
                            key={index}
                        />
                    ))}
                </Box>

                <div
                    style={{
                        width: "100%",
                        padding: "20px",
                        borderRadius: 8,
                        backgroundColor: "rgb(17,27,39)",
                        display: "flex",
                        marginRight: "auto",
                    }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        style={{
                            width: "100%",
                            backgroundColor: "transparent",
                            padding: "10px",
                            border: "none",
                            outline: "none",
                            color: "white",
                            fontSize: "20px",
                        }}
                    />
                    <IconButton
                        onClick={handleSubmit}
                        sx={{ ml: "auto", color: "white" }}
                    >
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
};

export default Chat;
