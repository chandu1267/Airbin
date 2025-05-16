const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../Models/listing.js");

main().then(console.log("Connected data.js")).catch(console.log("ERROR Occured...."))
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was inserted Success...")
}
initDB();