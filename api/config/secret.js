require("dotenv").config();

exports.config={
    port:process.env.PORT,
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_SECRET
}