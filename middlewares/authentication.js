const {validateToken} = require("../services/authentication");

//It will check for token in every req and res
function checkForAuthentication(cookieName){
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        //console.log("This is the token cookie value:",tokenCookieValue);
        if(!tokenCookieValue) {
           // console.log("oops error occured!");
            return next();
        }
        try{
            //console.log("Hii from here");
            const userPayload = validateToken(tokenCookieValue);
            //console.log("userpayload is running :",userPayload);
            req.user = userPayload;
            //console.log(req.user);
        }catch(error){}
        return next();
    };
}


module.exports = {
    checkForAuthentication,
};