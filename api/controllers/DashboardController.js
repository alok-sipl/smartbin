/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();
var validator = require('validator');

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: dashboard of the user
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('dashboard', {});
  },

  /*
     * Name: profile
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: update profile
     * @param  req
     */
  profile: function (req, res) {
    var errors = {};
    var user = {};
    var countries = {};
    var cities = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        /* user detail */
        var ref = db.ref("users/" + req.session.userid);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          /* country listing*/
          var ref = db.ref("countries");
          ref.once("value", function (snapshot) {
            var countries = snapshot.val();
            /* city listing*/
            var ref = db.ref("cities");
            ref.once("value", function (snapshot) {
              var cities = snapshot.val();
              return res.view('profile', {
                'title': sails.config.title.edit_profile,
                'user': user, "countries": countries,
                'cities': cities,
                'errors': errors
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var ref = db.ref();
        db.ref('users/' + req.session.userid)
          .update({
            'name': req.param('name'),
            'account_number': req.param('account_number'),
            'country_id': req.param('country'),
            'country_name': req.param('country_name'),
            'city_id': req.param('city'),
            'city_name': req.param('city_name'),
            'area': req.param('area'),
            'latitude': req.param('latitude'),
            'longitude': req.param('longitude')
            }).then(function () {
              user = firebaseAuth.auth().currentUser;
            }).then(function (){
              user.updateProfile({
                displayName: req.param('name'),
                photoURL: sails.config.base_url+'images/profile.png'
              });
              req.session.user.displayName = req.param('name');
              req.session.user.photoURL = sails.config.base_url+"images/profile.png";
            })
          .then(function (res) {
            req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.profile_update_success + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/profile');
          })
          .catch(function (err) {
            console.log("In error-->",err);
            req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.profile_update_error + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/profile');
          });
      }
    }else{
      /* user detail */
      if (req.session.userid !== undefined && req.session.userid) {
        var ref = db.ref("users/" + req.session.userid);
        ref.once("value", function (snapshot) {
          var user = snapshot.val();
          /* country listing*/
          var ref = db.ref("countries");
          ref.once("value", function (snapshot) {
            var countries = snapshot.val();
            /* city listing*/
            var ref = db.ref("cities");
            ref.once("value", function (snapshot) {
              var cities = snapshot.val();
              return res.view('profile', {
                'title': sails.config.title.edit_profile,
                'user': user, "countries": countries,
                'cities': cities,
                'errors': errors
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }else {
        return res.redirect(sails.config.base_url + 'login');
      }
    }

  },


  /*
   * Name: changePassword
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: chnage password of admin
   * @param  req
   */
  changePassword: function (req, res) {
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        return res.view('profile', {
          'title': sails.config.title.change_password,
          'user': user,
          'errors': errors
        });
      } else {
        var user = firebaseAuth.auth().currentUser;
        if (user) {
          var credentials = firebaseAuth.auth.EmailAuthProvider.credential(
            user.email,
            req.param('current_password')
          );
          user.reauthenticateWithCredential(credentials).then(function () {
            user.updatePassword(req.param('new_password')).then(function () {
              req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.password_change_success + '</div>');
              return res.redirect(sails.config.base_url + 'dashboard/changePassword');
            }).catch(function (error) {
              req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.password_change_error + '</div>');
              return res.redirect(sails.config.base_url + 'dashboard/changePassword');
            });
          }).catch(function (error) {
            console.log("Error:- ", error);
            req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.old_password_unmatch + '</div>');
            return res.redirect(sails.config.base_url + 'dashboard/changePassword');
          });
        } else {
          return res.redirect(sails.config.base_url + 'login');
        }
      }
    } else {
      return res.view('change-password', {title: sails.config.title.change_password, "errors": errors});
    }
  },


  /*
     * Name: logout
     * Created By: A-SIPL
     * Created Date: 13-dec-2017
     * Purpose: for  logout the admin
     * @param  req
     */
  logout: function (req, res) {
    // firebaseAuth.auth().signOut()
    //   .then(function () {
    //     return res.redirect(sails.config.base_url + 'login');
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    req.session.user = {};
    req.session.authenticated = false;
    req.session.destroy(function (err) {
      return res.redirect('/');
    });
  },

  /*
     * Name: sendMail
     * Created By: A-SIPL
     * Created Date: 26-dec-2017
     * Purpose: send mail
     * @param  req
     */
  sendMail: function (req, res) {
    MailerService.sendWelcomeMail({
      name: "Alok",
      email: "alok.bichhwe@systematixindia.com",
      subject: "User is deactiveated by admin"
    });
  },

  /*
     * Name: setting
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: for  notification setting of admin
     * @param  req
     */
  setting: function (req, res) {
    if (req.session.userid !== undefined && req.session.userid) {
      /* admin detail */
      var ref = db.ref("users/" + req.session.userid);
      ref.once("value", function (snapshot) {
        var userDetail = snapshot.val();
        if (userDetail) {
          return res.view('notification-setting', {
            title: sails.config.title.notification_setting,
            userDetail: userDetail
          });
        } else {
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'dashboard/setting');
        }
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    } else {
      return res.redirect(sails.config.base_url + 'login');
    }
  },


  /*
     * Name: updateSetting
     * Created By: A-SIPL
     * Created Date: 20-dec-2017
     * Purpose: for  notification setting of admin
     * @param  req
     */
  updateSetting: function (req, res) {
    if (req.body.type == 'is_device_notification') {
      var ref = db.ref();
      db.ref('/users/' + req.session.userid)
        .update({
          'is_device_notification_enable': req.body.value
        })
        .then(function () {
          return res.json({'status': true, message: sails.config.flash.update_successfully});
        })
        .catch(function (err) {
          return res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    } else {
      var ref = db.ref();
      db.ref('/users/' + req.session.userid)
        .update({
          'is_user_notification_enable': req.body.value
        })
        .then(function () {
          return res.json({'status': true, message: sails.config.flash.update_successfully});
        })
        .catch(function (err) {
          return res.json({'status': false, message: sails.config.flash.something_went_wronge});
        });
    }
  }
};

