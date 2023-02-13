import mongoose from 'mongoose'

interface IUser {
    username: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        min: 5
    },
    blogs: [
        { 
            type: mongoose.Types.ObjectId, 
            ref: 'Blog' 
        }
    ]
},{ timestamps: true })

const User = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default User