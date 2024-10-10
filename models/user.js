const { Schema,model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //To hash the password we need salt, on the go salt generate hoga isiliye hamne required nahi rakha
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/userAvatar.png",
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],//neeche ke dono ko chodkr koi aur value dene se mongoose error throw krta hei
        default: "USER",
    },
},
{timestamps: true});

//we can use something in mongoose like isko save krne se pehle kya kare. pre middleware in mongoose
//Jab bhi ham user ko save krne ka try karenge toh neeche wala function run karega and uske password ko hash kr dega
userSchema.pre('save', function (next) {
     const user = this; //we haven't used arrow function because this will then behave otherwise

     if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();//creating a secret key , har user ka apna apna ek secret key hota hei
    const hashedPassword = createHmac('sha256', salt)//key ko use krke ham password ko salt karenge phr password update kr denge
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();

}); // The meaning of this function is user ko save krne se pehle kya karna hei

userSchema.static("matchPasswordAndGenerateToken", async function (email,password) {
     const user = await this.findOne({ email });
     //console.log(user);
     if(!user) throw new Error('User not found');

     const salt = user.salt;
     const hashedPassword = user.password;
     //console.log(hashedPassword);
     const userProvidedhash = createHmac('sha256', salt)
     .update(password)
     .digest("hex");
     //console.log(userProvidedhash);
     if(hashedPassword !== userProvidedhash) throw new Error('Incorrect Password');
     //console.log("correct till here");
     const token = createTokenForUser(user);
     
     return token;
 
});

const User = model("user", userSchema);

module.exports = User;