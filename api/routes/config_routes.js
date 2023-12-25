const indexRouter = require("./index");
const usersRouter = require("./users");
const cakesRouter = require("./cakes");
const bakerRouter = require("./bakers");

exports.routesInit = (app) => {
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/cakes",cakesRouter);
    app.use("/baker",bakerRouter);
}