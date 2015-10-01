var projID = 0;
function loadData (elem) {
  //console.log(JSON.parse(elem.value));

  if (elem.value == 0) {
    clearData();
  } else if (elem.value == 1) {
    clearData();
    $('input#update').attr('value','Add Project');
  } else {
    var value = JSON.stringify({id:elem.value});

    $.ajax( {
        url: '/getproject',
        type: 'POST',
        contentType: 'application/json',
        data: value,
        success: function(result) {
          //console.log(result);
          fillData(result)
        }
     });
  }
}

function fillData (project) {
  clearData();
  projID = project._id;
  //console.log(projID);
  $('input#delete').removeClass('hidden');
  $('input[name="title"').val(project.title);

  var tagText="";
  for (var i=0, l=project.tags.length; i<l; i++) {
      tagText += project.tags[i];
      if (i != l-1) {
        tagText += ","
      };
  }
  $('input[name="tags"').val(tagText);

  $('input[name="coverImg"').val(project.coverImg);
  $('input[name="thumb"').val(project.thumb);
  $('input[name="shortDescription"').val(project.shortDescription);

  $('textarea[name="longDescription"').val(project.longDescription);
  //console.log(JSON.stringify($('textarea[name="longDescription"').val()));

  setDate(new Date(project.projectDate));

  $('input[name="priority"').val(project.priority);
  $('input[name="linkText"').val(project.linkText);

  if (project.media.length > 1) {
    mediaFill(project,0);
    var mediaBox = $('.mediaEntry').parent();
    for (var i=1, l=project.media.length; i<l; i++) {
      mediaBox.append('<input type="text" name="media'+i+'" class="mediaEntry">')
      mediaFill(project,i);
    }
  } else {
    mediaFill(project,0);
  }
}

function mediaFill (project,index) {
  var mediaItem;
    if (project.media[index].src.length == 2) {
      mediaItem = project.media[index].src[0] + "," + project.media[index].src[0];
    } else {
      mediaItem = project.media[index].src;
    }
    $('.mediaEntry').eq(index).val(mediaItem);
}

function clearData () {
  projID = 0;
  $('input#delete').addClass('hidden');
  $('input[type="text"').val("");
  $('textarea').val("");

  setDate(new Date());
  $('input[type="number"').val(0);

  var mediaBox = $('.mediaEntry').eq(0).parent();
  $('.mediaEntry').remove();
  mediaBox.append('<input type="text" name="media1" class="mediaEntry">')
}

function setDate (date) {
  var now = date;
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $('input[type="date"').val(today);
}


function processButton (elem) {
  //console.log(elem.id);
  if (elem.id === 'delete') {
    var sure = confirm('Are you sure you want to delete the project ' + $('input[name="title"]').val() + '?');
    if (sure) {
      deleteProj(projID);
    }
  } else if (elem.value === 'Update Project') {
    //console.log("will update")
    updateProject(createProjectObject(),projID);
  } else if (elem.value === 'Add Project') {
    //console.log("will add")
    addProject(createProjectObject());
  }
}

function deleteProj (ID) {
  var value = JSON.stringify({id:ID});
  $.ajax( {
    url: '/deleteproject',
    type: 'POST',
    contentType: 'application/json',
    data: value,
    success: function(result) {
      console.log(result);
      $('#projectsList').val(0);
      $("option[value='\"" + ID + "\"']").remove();
      clearData();
    }
  });
}

function updateProject (aProject,ID) {
  if (projObjectComplete(aProject)){
    var value = JSON.stringify({id:ID,project:aProject});
    $.ajax( {
      url: '/updateproject',
      type: 'POST',
      contentType: 'application/json',
      data: value,
      success: function(result) {
        console.log(result);
        $('#projectsList').val(0);
        clearData();
      }
    });
  } else {
    console.error("Project data incomplete!")
  }
}

function addProject (aProject) {
  if (projObjectComplete(aProject)){
    var value = JSON.stringify({project:aProject});
    $.ajax( {
      url: '/addproject',
      type: 'POST',
      contentType: 'application/json',
      data: value,
      success: function(result) {
        console.log(result);
        $('#projectsList').append('<option value="&quot;' + result.project._id + '&quot;">' + result.project.title + '</option>');
        $('#projectsList').val(0);
        clearData();
      }
    });
  } else {
    console.error("Project data incomplete!")
  }
}

function createProjectObject () {
  var aProject = {};

  aProject.title = $('input[name="title"').val();

  var tagText = $('input[name="tags"').val().split(",");
  aProject.tags = tagText;

  aProject.coverImg = $('input[name="coverImg"').val();
  aProject.thumb = $('input[name="thumb"').val();
  aProject.shortDescription = $('input[name="shortDescription"').val();
  //aProject.longDescription = JSON.stringify($('textarea[name="longDescription"').val());
  aProject.longDescription = $('textarea[name="longDescription"').val().replace(/(?:\r\n|\r|\n)/g, '\n');

  aProject.date = new Date($('input[type="date"').val());
  aProject.priority = $('input[name="priority"').val();
  aProject.linkText = $('input[name="linkText"').val();

  var mediaEntries = [];

  for (var i=0, l=$('.mediaEntry').length; i<l; i++) {
      var urls = $('.mediaEntry').eq(i).val().split(",");
      if (urls.length == 2) {
        mediaEntries.push({'src':[urls[0],urls[1]]})
      } else {
        mediaEntries.push({'src':urls[0]})
      }
  }

  aProject.media = mediaEntries;
  return aProject;
}

function projObjectComplete (project) {
  var errors = ""
  for (var key in project) {
    if (project.hasOwnProperty(key)) {
      if (key == 'media') {
        for (var i=0, l=project[key].length; i<l; i++) {
            if (project[key][i].src == "") {
              errors += 'media[' + i +  "] is empty\n\n"
            }
        }
      } else if (key == 'tags') {
        for (var j=0, k=project[key].length; j<k; j++) {
            if (project[key][j] == "") {
              errors += 'tags[' + j +  "] is empty\n\n"
            }
        }
      } else if (key == 'date') {
        if ( Object.prototype.toString.call(project[key]) === "[object Date]" ) {
          if ( isNaN( project[key].getTime() ) ) {
            errors += key + " is not a vaild date\n\n";
          }
        }
        else {
          errors += key + " is not a vaild date\n\n";
        }
      } else if (project[key] == undefined) {
        errors += key + " is undefined\n\n";
      } else if (project[key] == "") {
        errors += key + " is empty\n\n"
      }
    }
  }
  if (errors === "") {
    return true;
  } else {
    alert(errors);
    return false;
  }
}



$(".mediaModify").click(function(e){
    e.preventDefault();
    var action = $(this).attr('href');

    if (action == "#plus") {
      var mediaBox = $('.mediaEntry').eq(0).parent();
      mediaBox.append('<input type="text" name="media' + $('.mediaEntry').length + '" class="mediaEntry">')
    } else if (action == "#minus") {
        if ($('.mediaEntry').length == 1) {
          $('.mediaEntry').val("");
        } else {
          $('.mediaEntry').last().remove();
        }
    }
});


