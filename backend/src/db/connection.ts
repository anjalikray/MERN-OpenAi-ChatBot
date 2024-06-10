import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log(error);
        throw new Error("Cannot connect to mongodb");
    }
}

async function disconnectFromDB() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.log(error);
        throw new Error("Cannot disconnect from mongodb");
    }
}

export { connectToDatabase, disconnectFromDB };
