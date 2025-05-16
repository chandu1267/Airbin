const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./Models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const WrapAsync = require("./utils/WrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main().then(console.log("DataBase is Connected..."))

app.get("/",(req,res)=>{
    res.send("Hi im root nice to see you...")
})


//Index Route
app.get("/listings",WrapAsync (async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings })
}));
//Create New Post Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})
app.post("/listings",WrapAsync (async (req,res,next)=>{
        const newListing = await new Listing(req.body.listing) ;
        newListing.save()
        res.redirect("/listings")   
 
}));

//Show Route
app.get("/listings/:id",WrapAsync (async (req,res)=>{
    let {id} = req.params;
   const ShowData = await Listing.findById(id);
    res.render("./listings/show.ejs",{ShowData})
}));

//Edit Route
app.get("/listings/:id/edit",WrapAsync (async (req,res)=>{
    let {id} = req.params;
    const ShowData = await Listing.findById(id);
    res.render("./listings/edit.ejs",{ShowData})
}));
//Update Route
app.put("/listings/:id",WrapAsync (async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`)
}));

//Delete Route
app.delete("/listings/:id",WrapAsync (async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));    
// app.get("/testlisting",async (req,res)=>{
//     let sample = new Listing({
//         title : "My home",
//         description : "Lived with parents",
//         Price : 1200,
//         location : "suryapet",
//         country : "India"
//     })

// await sample.save();
// console.log("Sucessful...")
// res.send("Sucessfully data inserted...")
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"))
})

app.use((err,res,next)=>{
    let {statusCode=404,message="Something Went Wrong..."}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
})
app.listen(port,(res,req)=>{
    console.log(`The server is started in the port of ${port}`);
})