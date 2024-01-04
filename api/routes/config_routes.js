const indexRouter = require("./index");
const usersRouter = require("./users");
const cakesRouter = require("./cakes");
const bakerRouter = require("./bakers");
const decorationRouter = require("./decoration");
const baseRouter = require("./bases");

exports.routesInit = (app) => {
    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/cakes",cakesRouter);
    app.use("/bakers",bakerRouter);
    app.use("/decorations",decorationRouter);
    app.use("/bases",baseRouter);
}