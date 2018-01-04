/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: sjpw grid page
     * @param  req
     */
   index: function (req, res) {
    return res.view('user-listing', {
      'title' : sails.config.title.user_list
    });
   },

  /*
   * Name: userlist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  userlist:function(req, res){
    /* country listing*/
    users = [];
    var ref = db.ref("users");
    ref.once('value', function (snap) {
      var userJson     = (Object.keys(snap).length) ? getUserList(snap) : {};
      return res.json({'rows':userJson});
    });
  },


  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  view: function (req, res) {
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.once("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'title': sails.config.title.view_user,
          'user': user, errors: errors,
          'countries': countries,
          'isEdit': false,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });

    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
   * Name: edit
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  edit:function(req, res){
    /* user detail */
    var errors = {};
    var ref = db.ref("users/" + req.params.id);
    ref.once("value", function (snapshot) {
      var user = snapshot.val();
      /* city listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('view-edit-user', {
          'title': sails.config.title.edit_user,
          'user': user,
          'errors': errors,
          'countries': countries,
          'isEdit': true,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });

    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
   * Name: updateStatus
   * Created By: A-SIPL
   * Created Date: 26-dec-2017
   * Purpose: UPdate
   * @param  req
   */
  updateStatus:function(req, res){
    var id = req.body.id;
    var status = req.body.is_active;
    var ref = db.ref('/users/'+ id);
    ref.once("value", function (snapshot) {
      if(snapshot.val()){
        db.ref('/users/'+ id)
          .update({
            'is_deleted': status
          })
          .then(function (res) {
            userinfo = snapshot.val();
            MailerService.sendWelcomeMail({
              name: userinfo.name,
              email: userinfo.email,
              subject: (status) ? sails.config.email_message.user_activated : sails.config.email_message.user_deactivated
            });
            return true;
          })
          .catch(function (err) {
            return false;
          });
      }else{
        return false;
      }
    }, function (errorObject) {
      return false;
    });
  },
};

/*
   * Name: getUserList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getUserList(snap){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      user = childSnap.val();
      updateUser = user;
      updateUser.user_id =  childSnap.key;
      users.push(updateUser);
    });
    return users;
  }else{
    users ={}
    return users;
  }
}

