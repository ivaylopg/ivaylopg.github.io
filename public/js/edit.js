function loadData (elem) {
  //console.log(JSON.parse(elem.value));

  $.ajax( {
      url: '/getproject',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({id:elem.value}),
      success: function(result) {
        console.log(result);
      }
   });

}
