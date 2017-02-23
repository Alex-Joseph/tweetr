$(document).ready(function () {
  $('#tweet').keyup(function () {
    const max = 140;
    let len = $(this).val().length;
    let charLeft = max - len;
    if (charLeft < 0) {
      $(".counter").addClass("red-text");
    } else {
      $(".counter").removeClass("red-text");
    }
    $('.counter').text(charLeft);
  });
});
