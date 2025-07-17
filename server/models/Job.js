const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
jobId: {type: String, unique: true, required: true},
title: String,
company: String,
desription: String,
location: String,
url: String,
datePosted: Date,
tags: [String],
type: String,
source: String,
},{
   timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);
