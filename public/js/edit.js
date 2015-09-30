function loadData (elem) {
  //console.log(JSON.parse(elem.value));

  if (elem.value == 0) {
    clearData();
  } else if (elem.value == 1) {

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
  console.log(elem.id);
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


