/*
 * Main set common settings of the application
 */

var BASE_URL = 'http://10.10.100.19:1337';
/*
 *  For manage all actions for the admin
 */

$(document).ready(function () {

  /* Hide server side header messages */
  setTimeout(function(){
    $('div').removeClass('has-error');
    $('.form-group').find('.help-block').hide();
  },6000);

  /* Show loader at login */
  form = $('#loginForm');
  form.parsley();

  form.on('submit', function(e) {
    f = $(this);
    f.parsley().validate();
    if (f.parsley().isValid()) {
      helper.showLoader();
    }
  });
})

/* Declare all helper functions here */
var helper = {
  /*
   * @method: showLoader
   * @desc: Show loader
   */
  showLoader: function () {
    $(".splash").show();
  },
  /*
   * @method: hideLoader
   * @desc: hide loader
   */
  hideLoader: function () {
    $(".splash").hide();
  },
}
