const indexRouter = require("./index");
const usersRouter = require("./users");
const cakesRouter = require("./cakes");

exports.routesInit = (app) => {
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/cakes",cakesRouter);
}