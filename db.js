const mongoose = require("mongoose");

mongoose.connect("file:///C:/Users/HARI%20PRASHATH/OneDrive/Desktop/1.html")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

module.exports = mongoose;