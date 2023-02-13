import dotenv from 'dotenv'

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || ""
const SERVER_PORT = process.env.SERVER_PORT || ""
const SESSION_SECRET = process.env.SESSION_SECRET || ""

export const config = {
    mongo: {
        uri: MONGO_URI
    },
    server: {
        port: SERVER_PORT
    },
    session: {
        pwrd: SESSION_SECRET
    }
}