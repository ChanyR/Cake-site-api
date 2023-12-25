const mongoose = require('mongoose');
const { config } = require("../config/secret");

main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);

    // to use with the database locali(localhost-3001)
    // await mongoose.connect('mongodb://localhost:27017/cakes-project');

    await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster1.h6yht2c.mongodb.net/cakes-project`);
    console.log("connect to cakes-project in data-base mongo-atlas ");
}