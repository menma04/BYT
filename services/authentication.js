const JWT = require("jsonwebtoken");

const secret = "$uperMan@123";

function createTokenForUser(user) {
   // console.log("jsonwebtoken");
    const payload = {
        _id : user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    };
    //console.log(payload);
    try {
        const token = JWT.sign(payload, secret, { algorithm: 'HS256' });
        //console.log("Generated Token:", token);
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
}

function validateToken(token){
    try{ 
    //console.log("we reached here");
    const payload = JWT.verify(token,secret,{ algorithm: 'HS256' });
    //console.log(payload);
    return payload;
    }catch(error){
        console.log(error);
        return null;
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};