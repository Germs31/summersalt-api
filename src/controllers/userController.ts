import { Request, Response } from "express"
import User from '../models/User'
import bcryptjs from 'bcryptjs'


export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body
        const hashedPassword =  bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
        const createUser = await User.create({ username , password: hashedPassword , email })
        res.status(201).json({ data: createUser})
    } catch (error) {
        res.status(500).json({error})
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const foundUser = await User.findOne({username: req.body.username})
        if(foundUser) {
            if(bcryptjs.compareSync(req.body.password, foundUser.password)){
                req.session.userId = foundUser._id
                req.session.username = foundUser.username
                req.session.logged = true
                res.status(200).json({ data: foundUser, message: 'Login successful'})
            } else {
                res.status(401).json({message: "Username or password is incorrect"})
            }
        } else {
            res.status(401).json({message: "Username or password is incorrect"})
        }
    } catch (error) {
        res.status(500).json({error})
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        req.session.destroy((error) => {
            if(error) {
                return res.status(500).json({message: "There has been am error logging out"})
            }

            // res.clearCookie('connect.sid')
            res.status(200).json({message: "Log out has been successful"})
            console.log(req.session)
        })
    } catch (error) {
        res.status(500).json({error})
    }
}