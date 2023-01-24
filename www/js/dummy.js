//jQuery Simple Modal Example

$('.edit').click(function() {
  $('.cover, .modal').fadeTo(200, 1);
});

$('.close, .cover').click(function() {
  $('.cover, .modal').fadeTo(200, 0).hide();
});

$('#edit2').click(function() {
  $('#cover2, #modal2').fadeTo(200, 1);
});

$('#close2, #cover2').click(function() {
  $('#cover2, #modal2').fadeTo(200, 0).hide();
});