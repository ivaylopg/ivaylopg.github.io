/*eslint-disable */

var mongoose = require('mongoose');
var marked = require('marked');
var Project = require('./dbModels/project')

var renderer = new marked.Renderer();
renderer.link = function(href,title,text) {
    return '<a href="' + href + '" class="linkAnim" target="_blank">' + text + '</a>';
}
marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: true
});

var key = process.env.KEY;
var mdbOptions = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }}
mongoose.connect('mongodb://ivaylopg:'+ key + '@localhost/ivaylogetovsite',mdbOptions);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('disconnected', function () {
  console.log('Mongoose connection has disconnected');
});

db.once('open', function (callback) {
  console.log("Connected to MongoDB");
});


/*
var projectData = new Project({
    title: 'Electric Sheep',
    tags: ['Prints','Video','Code'],
    coverImg: 'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/main.jpg',
    thumb: 'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/sheep.jpg',
    shortDescription: 'A digital cloud built from an algorithm. The daydreams of an android lying in a virtual field of grass.',
    longDescription: 'I developed a recursive algorithm that grows each cloud based on two inputs: the number of recursions and the shape of each "droplet." As the program recurses, it mutates, resulting in a unique cloud formation each time.\n\nThe final products are a series of high-resolution prints and a video installation in which a computer infinitely loops through the algorithm, producing an endless stream of unique clouds as if passing its time by seeing shapes in the sky.\n\nPrints can be purchased [here](http://society6.com/ivaylogetov/prints?show=new).\n\nFeatured on: [designboom](http://www.designboom.com/art/ivaylo-getov-electric-sheep-digital-clouds-openframeworks-08-20-2014/) // [trendhunter](http://www.trendhunter.com/trends/ivaylo-getov)',
    media: [
        {src:'https://player.vimeo.com/video/103482209'},
        {src:'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/05.png'},
        {src:['http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/04.png','http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/07.png']},
        {src:'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/sheep/02.png'},
    ],
    projectDate: new Date('August 20, 2014'),
    priority: 0,
    linkText: 'electricsheep'
});

projectData.save(function (err, projectData) {
  if (err) return console.error(err);
  console.log("success");
});
//*/

/*
var projectData = new Project({
    title: 'Untitled(Triptych)',
    tags: ['Video','Installation'],
    coverImg: 'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/03.jpg',
    thumb: 'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/triptych.jpg',
    shortDescription: 'Computer visualizations of romantic connection.',
    longDescription: 'Three-channel video installation.\n\nFive couples come together in a kiss, recorded by a 3D Scanner and custom software. Because of the limitations of the low-resolution technology, the computer has trouble separating each member of the pair when they come close to each other and thus frequently renders a physical connection between their two faces where one does not exist, presenting the two individuals as one connected mass.\n\nDue to this "mistake" the machine has actually visualized a connection that does exist, creating a visual representation of the desire for two people to come together or become one. The viewer, seeing the couples only through the machine\'s point of view in fact gets an actual sense of the closeness of the partners, enabling the viewer to understand and maybe feel the sense of emotional connection.\n\nThree videos show different modes of rendering the data, looping indefinitely and creating an infinite amount of relationships among the three displayed scenes.\n\nA hacked Xbox Kinect was used as the scanner, and the 3D data is combined with color data from a digital cinema camera using RGBD Toolkit.',
    media: [
        {src:'https://player.vimeo.com/video/58791794'},
        {src:'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/06.jpg'},
        {src:['http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/01.jpg','http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/02.jpg']},
        {src:'http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/07.png'},
        {src:['http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/04.jpg','http://ivaylogetov.bucket.s3.amazonaws.com/ivaylogetov.com/projects/triptych/05.jpg']}
    ],
    projectDate: new Date('November 11, 2012'),
    priority: 0,
    linkText: 'triptych'
});

projectData.save(function (err, projectData) {
  if (err) return console.error(err);
  console.log("success");
});
//*/


/*
Project.findOneAndUpdate({ title: 'Electric Sheep' }, { linkText: 'electricsheep' }, function(err, project) {
  if (err) throw err;

  // we have the updated user returned to us
  console.log(project);
});
//*/

/*
Project.find(function (err, projects) {
  if (err) return console.error(err);
  //console.log(projects);
  //console.log(projects[0].longDescription);
  console.log(marked(projects[0].longDescription));
  //console.log(projects.length);
})
//*/





var gracefulExit = function() {
  db.close(function () {
    console.log('Mongoose connection has been disconnected through app termination');
    process.exit(0);
  });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
