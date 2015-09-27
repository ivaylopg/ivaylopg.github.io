var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    title: String,
    tags: [String],
    coverImg: String,
    thumb: String,
    shortDescription: String,
    longDescription: String,
    media: [ {src: mongoose.Schema.Types.Mixed } ],
    projectDate: Date,
    updated: Date,
    priority: Number,
    linkText: String
});

projectSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated = currentDate;
  next();
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
