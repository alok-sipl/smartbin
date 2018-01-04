/**
 * DriverController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();
var firebaseAuth = sails.config.globals.firebaseAuth();

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('driver-listing', {
      'title' : sails.config.title.driver_list
    });
   },


   /*
   * Name: driverlist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  driverlist:function(req, res){
    /* country listing*/
    drivers = [];
    var ref = db.ref("drivers");
    ref.once('value', function (snap) {
      var userJson     = (Object.keys(snap).length) ? getDriverList(snap) : {};
      return res.json({'rows':userJson});
    });
  },


  /*
     * Name: moreSupplier
     * Created By: A-SIPL
     * Created Date: 27-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  moreSupplier: function (req, res) {
    var offset = parseInt(req.body.offset);
    var limit = parseInt(req.body.limit);
    var text = req.body.text;
    var ref = db.ref("/drivers");
    if (text != '' && text != undefined) {
      ref.orderByChild('name')
        .limitToFirst(limit)
        .startAt(text)
        .endAt(text + "\uf8ff")
        .once('value')
        .then(function (snapshot) {
          var drivers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            drivers: drivers
          }).catch(function (err) {
            var drivers = snapshot.val();
            res.locals.layout = false;
            return res.view('show-supplier', {
              drivers: {}
            });
          });
        });
    } else {
      ref.orderByChild('name')
        .limitToFirst(limit)
        .once("value", function (snapshot) {
          var drivers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            drivers: drivers
          });
        }).catch(function (err) {
        var drivers = snapshot.val();
        res.locals.layout = false;
        return res.view('show-supplier', {
          drivers: {}
        });
      });
    }
  },


  /*
     * Name: add
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  add: function (req, res) {
    var isFormError = false;
    var errors = {};
    var driver = {};
    var countries = {};
    var cities = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {

        /* country listing*/
        var ref = db.ref("countries");
        ref.once("value", function (snapshot) {
          var countries = snapshot.val();
          return res.view('add-update-driver', {
            'title': sails.config.title.add_driver,
            'driver': driver,
            'countries': countries,
            'cities': cities,
            'errors': errors,
            'req': req
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var ref = db.ref("/drivers");
        ref.orderByChild("email").equalTo(req.param('email')).once('value')
          .then(function (snapshot) {
            requestData = snapshot.val();
           if (requestData) {
              req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'driver/add');
            } else {
              var ref = db.ref("drivers");
              var data = {
                name: req.param('name'),
                email: req.param('email'),
                mobile_number: req.param('mobile_number'),
                address: req.param('address'),
                latitude: req.param('latitude'),
                longitude: req.param('longitude'),
                is_deleted: false,
                created_date: Date.now(),
                modified_date: Date.now()
              }
              ref.push(data).then(function (ref) {
                req.flash('flashMessage', '<div class="alert alert-success">Driver Added Successfully.</div>');
                return res.redirect(sails.config.base_url + 'driver');
              }, function (error) {
                req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Driver.</div>');
                return res.redirect(sails.config.base_url + 'driver');
              });
            }              
          }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'driver');
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('add-update-driver', {
          'title': sails.config.title.add_driver,
          'driver': driver,
          'countries': countries,
          'cities': cities,
          'errors': errors,
          'req': req
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
     * Name: edit
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new supplier
     * @param  req
     */
  edit: function (req, res) {
    var driver = {};
    var countries = {};
    var cities = {};
    var isFormError = false;
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        /* country listing*/
        var ref = db.ref("countries");
        ref.once("value", function (snapshot) {
          var countries = snapshot.val();
          /* driver detail */
          var ref = db.ref("drivers/" + req.params.id);
          ref.once("value", function (snapshot) {
            var driver = snapshot.val();
            /* city name */
            var cityId = (driver.city_id) ? driver.city_id : 0;
            var ref = db.ref("cities").orderByChild('country_id').equalTo(driver.country_id);
            ref.once("value", function (snapshot) {
              var cities = snapshot.val();
              return res.view('add-update-driver', {
                title: sails.config.title.edit_supplier,
                'driver': driver,
                "countries": countries,
                "cities": cities,
                "errors": errors
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
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        req.file('company_image').upload({
          // don't allow the total upload size to exceed ~4MB
          maxBytes: sails.config.length.max_file_upload
        }, function whenDone(err, uploadedFiles) {
          if (err) {
            errors['company_image'] = {message: err}
            /* country listing*/
            var ref = db.ref("countries");
            ref.once("value", function (snapshot) {
              var countries = snapshot.val();
              /* driver detail */
              var ref = db.ref("drivers/" + req.params.id);
              ref.once("value", function (snapshot) {
                var driver = snapshot.val();
                /* city name */
                var cityId = (driver.city_id) ? driver.city_id : 0;
                var ref = db.ref("cities").orderByChild('country_id').equalTo(driver.country_id);
                ref.once("value", function (snapshot) {
                  var cities = snapshot.val();
                  return res.view('add-update-driver', {
                    title: sails.config.title.edit_supplier,
                    'driver': driver,
                    "countries": countries,
                    "cities": cities,
                    "errors": errors
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
            if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
              errors['company_image'] = {message: WaterSupplier.message.invalid_file}
              /* country listing*/
              var ref = db.ref("countries");
              ref.once("value", function (snapshot) {
                var countries = snapshot.val();
                /* driver detail */
                var ref = db.ref("drivers/" + req.params.id);
                ref.once("value", function (snapshot) {
                  var driver = snapshot.val();
                  /* city name */
                  var cityId = (driver.city_id) ? driver.city_id : 0;
                  var ref = db.ref("cities").orderByChild('country_id').equalTo(driver.country_id);
                  ref.once("value", function (snapshot) {
                    var cities = snapshot.val();
                    return res.view('add-update-driver', {
                      title: sails.config.title.edit_supplier,
                      'driver': driver,
                      "countries": countries,
                      "cities": cities,
                      "errors": errors
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
              db.ref('drivers/' + req.params.id)
                .update({
                  'name': req.param('name'),
                  'mobile_number': req.param('mobile_number'),
                  'address': req.param('address'),
                  'latitude': req.param('latitude'),
                  'longitude': req.param('longitude')
                })
                .then(function (res) {
                  req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.supplier_updated_success + '</div>');
                  return res.redirect(sails.config.base_url + 'driver');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
                  return res.redirect(sails.config.base_url + 'driver/edit/' + req.params.id);
                });
            }
          }
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        /* driver detail */
        var ref = db.ref("drivers/" + req.params.id);
        ref.once("value", function (snapshot) {
          var driver = snapshot.val();
          console.log(driver);
          /* city name */
          ref.once("value", function (snapshot) {
            var cities = snapshot.val();
            return res.view('add-update-driver', {
              title: sails.config.title.edit_driver,
              'driver': driver,
              "countries": countries,
              "cities": cities,
              "errors": errors
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
    }
  },

  /*
    * Name: updateStatus
    * Created By: A-SIPL
    * Created Date: 8-dec-2017
    * Purpose: add new supplier
    * @param  req
    */
  updateStatus: function (req, res) {
    var id = req.body.id;
    console.log(req.body);
    var status = req.body.is_active;
    console.log(status);
    if(id != ''){
      db.ref('/drivers/' + id)
        .update({
          'is_deleted': status
        })
        .then(function () {
          return res.json({'status':true});
        })
        .catch(function (err) {
          res.json({'status':false, 'message': err});
        });
    }else{
      return res.json({'status':false, message: sails.config.flash.something_went_wronge});
    }
  }
};

/*
   * Name: getDriverList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getDriverList(snap){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      driver = childSnap.val();
      updateUser = driver;
      updateUser.user_id =  childSnap.key;
      drivers.push(updateUser);
    });
    return drivers;
  }else{
    drivers ={}
    return drivers;
  }
}

