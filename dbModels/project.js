var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    title: String,
    tags: [String],
    coverImg: String,
    thumb: String,
    shortDescription: String,
    longDescription: String,
    video: [String],
    images: [{src: String, priority: Number}],
    imageGroups: [{src1: String, src2: String, priiority: Number}],
    projectDate: Date,
    updated: Date
});

projectSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated = currentDate;
  next();
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
