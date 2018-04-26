var stack = [],
    currentTotal = 0,
    temp = '';

$("button").click(function() {
  var val = $(this).text();
  $("#display").html(val);
  console.log('button pressed');
})
