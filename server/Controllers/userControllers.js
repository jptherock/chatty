const User = require('../Models/userModels');
const bcrypt = require('bcryptjs');

const register = async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ message: "Email already exists" ,status:false});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        }); 
        await user.save();
        res.status(201).json({ message: "User registered successfully",user ,status:true});

    }catch{
        res.status(400).json({ message: "error" ,status:false});
    }
}
const login = async (req, res,next) => {
    
        const {email, password } = req.body;
        const Usercheck = await User.findOne({ email });

        if (!Usercheck) {
            return res.status(400).json({ message: "User doesnt exist" ,status:false});
        }
        const isPasswordCorrect = await bcrypt.compare(password, Usercheck.password);

        if(!isPasswordCorrect){
            return res.status(401).json({ message: "Password is incorrect" ,status:false});
        }
        res.status(201).json({ message: "User Signin successfully",Usercheck ,status:true});
        next()
}

const setavatar = async (req, res,next) => {
    try{
        const {image} = req.body;
        const userid = req.params.id;

        const updateuser = await User.findByIdAndUpdate(userid, {
            avatarImage: image,
            isAvatarImageSet: true
        },{new:true});

        await updateuser.save();
        res.status(201).json({ message: "Avatar set successfully",user:updateuser,isSet:true});
    }
    catch{
        res.status(400).json({ message: "error" ,status:false});
    }
}

const allusers = async(req,res,next) => {
    try{
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);
        return res.json(users);
    }
    catch(e){
        res.status(400).json({ message: "error" ,status:false});
    }
}

module.exports = {register,login,setavatar,allusers};