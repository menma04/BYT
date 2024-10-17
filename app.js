require('dotenv').config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const Blog = require('./models/blog');


const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthentication } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;


mongoose.connect(process.env.MONGO_URL)
        .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve('./public')));
//app.use(express.json());


app.get("/", async (req,res) => {
    const allBlogs = await Blog.find({});
    let objU = null;

    if (req.user) {
        objU = await User.findById(req.user._id);
    }

    res.render("home",
       {user: req.user,
        blogs: allBlogs,
        objU,
       } 
    );
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));