/**
 * SupplierController
 *
 * @description :: Server-side logic for managing suppliers
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
    db.ref('/suppliers')
      .once('value')
      .then(function (snapshot) {
        console.log('First');
        supplierCount = snapshot.numChildren();
        var ref = db.ref("/suppliers");
        ref.orderByChild('company_name').limitToFirst(sails.config.per_page_data).once("value", function (snapshot) {
          var suppliers = snapshot.val();
          return res.view('supplier-listing', {
            title: sails.config.title.supplier_list,
            suppliers: suppliers,
            count: supplierCount
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      }).catch(function (err) {
                console.log('Secob');

        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('supplier');
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
    var ref = db.ref("/suppliers");
    if (text != '' && text != undefined) {
      ref.orderByChild('name')
        .limitToFirst(limit)
        .startAt(text)
        .endAt(text + "\uf8ff")
        .once('value')
        .then(function (snapshot) {
          var suppliers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          }).catch(function (err) {
            var suppliers = snapshot.val();
            res.locals.layout = false;
            return res.view('show-supplier', {
              suppliers: {}
            });
          });
        });
    } else {
      ref.orderByChild('name')
        .limitToFirst(limit)
        .once("value", function (snapshot) {
          var suppliers = snapshot.val();
          res.locals.layout = false;
          return res.view('show-supplier', {
            suppliers: suppliers
          });
        }).catch(function (err) {
        var suppliers = snapshot.val();
        res.locals.layout = false;
        return res.view('show-supplier', {
          suppliers: {}
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
    var supplier = {};
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
          return res.view('add-update-supplier', {
            'title': sails.config.title.add_supplier,
            'supplier': supplier,
            'countries': countries,
            'cities': cities,
            'errors': errors,
            'req': req
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        var ref = db.ref("/suppliers");
        ref.orderByChild("email").equalTo(req.param('email')).once('value')
          .then(function (snapshot) {
            supplierdata = snapshot.val();
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
                  return res.view('add-update-supplier', {
                    'title': sails.config.title.add_supplier,
                    'supplier': supplier,
                    'countries': countries,
                    'cities': cities,
                    'errors': errors,
                    'req': req
                  });
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
              } else {
                if (uploadedFiles.length === 0) {
                  errors['company_image'] = {message: WaterSupplier.message.company_image_required}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.once("value", function (snapshot) {
                    var countries = snapshot.val();
                    return res.view('add-update-supplier', {
                      'title': sails.config.title.add_supplier,
                      'supplier': supplier,
                      'countries': countries,
                      'cities': cities,
                      'errors': errors,
                      'req': req
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  errors['company_image'] = {message: WaterSupplier.message.invalid_file}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.once("value", function (snapshot) {
                    var countries = snapshot.val();
                    return res.view('add-update-supplier', {
                      'title': sails.config.title.add_supplier,
                      'supplier': supplier,
                      'countries': countries,
                      'cities': cities,
                      'errors': errors,
                      'req': req
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
                } else if (supplierdata) {
                  req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('email') + sails.config.flash.email_already_exist + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier/add');
                } else {
                  var ref = db.ref("suppliers");
                  var data = {
                    company_name: req.param('company_name'),
                    name: req.param('name'),
                    email: req.param('email'),
                    mobile_number: req.param('mobile_number'),
                    account_number: req.param('account_number'),
                    tank_size: req.param('tank_size'),
                    country_id: req.param('country'),
                    country_name: req.param('country_name'),
                    city_id: req.param('city'),
                    city_name: req.param('city_name'),
                    area: req.param('area'),
                    latitude: req.param('latitude'),
                    longitude: req.param('longitude'),
                    is_deleted: false,
                    created_date: Date.now(),
                    modified_date: Date.now(),
                    /*compnay_image: req.param('company_image'),*/
                  }
                  ref.push(data).then(function (ref) {
                    req.flash('flashMessage', '<div class="alert alert-success">Supplier Added Successfully.</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  }, function (error) {
                    req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Supplier.</div>');
                    return res.redirect(sails.config.base_url + 'supplier');
                  });
                }
              }
            });
          }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'supplier');
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('add-update-supplier', {
          'title': sails.config.title.add_supplier,
          'supplier': supplier,
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
    var supplier = {};
    var countries = {};
    var isFormError = false;
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        /* country listing*/
        var ref = db.ref("countries");
        ref.once("value", function (snapshot) {
          var countries = snapshot.val();
          /* supplier detail */
          var ref = db.ref("suppliers/" + req.params.id);
          ref.once("value", function (snapshot) {
            var supplier = snapshot.val();
            /* city name */
            var cityId = (supplier.city_id) ? supplier.city_id : 0;
            var ref = db.ref("cities").orderByChild('country_id').equalTo(supplier.country_id);
            ref.once("value", function (snapshot) {
              var cities = snapshot.val();
              return res.view('add-update-supplier', {
                title: sails.config.title.edit_supplier,
                'supplier': supplier,
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
              /* supplier detail */
              var ref = db.ref("suppliers/" + req.params.id);
              ref.once("value", function (snapshot) {
                var supplier = snapshot.val();
                /* city name */
                var cityId = (supplier.city_id) ? supplier.city_id : 0;
                var ref = db.ref("cities").orderByChild('country_id').equalTo(supplier.country_id);
                ref.once("value", function (snapshot) {
                  var cities = snapshot.val();
                  return res.view('add-update-supplier', {
                    title: sails.config.title.edit_supplier,
                    'supplier': supplier,
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
                /* supplier detail */
                var ref = db.ref("suppliers/" + req.params.id);
                ref.once("value", function (snapshot) {
                  var supplier = snapshot.val();
                  /* city name */
                  var cityId = (supplier.city_id) ? supplier.city_id : 0;
                  var ref = db.ref("cities").orderByChild('country_id').equalTo(supplier.country_id);
                  ref.once("value", function (snapshot) {
                    var cities = snapshot.val();
                    return res.view('add-update-supplier', {
                      title: sails.config.title.edit_supplier,
                      'supplier': supplier,
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
              db.ref('suppliers/' + req.params.id)
                .update({
                  'company_name': req.param('company_name'),
                  'name': req.param('name'),
                  'mobile_number': req.param('mobile_number'),
                  'account_number': req.param('account_number'),
                  'tank_size': req.param('tank_size'),
                  'country_id': req.param('country'),
                  'country_name': req.param('country_name'),
                  'city_id': req.param('city'),
                  'city_name': req.param('city_name'),
                  'area': req.param('area'),
                  'latitude': req.param('latitude'),
                  'longitude': req.param('longitude')
                })
                .then(function (res) {
                  req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.supplier_add_success + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.supplier_add_error + '</div>');
                  return res.redirect(sails.config.base_url + 'supplier/edit/' + req.params.id);
                });
            }
          }
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        /* supplier detail */
        var ref = db.ref("suppliers/" + req.params.id);
        ref.once("value", function (snapshot) {
          var supplier = snapshot.val();
          /* city name */
          var cityId = (supplier.city_id) ? supplier.city_id : 0;
          var ref = db.ref("cities").orderByChild('country_id').equalTo(supplier.country_id);
          ref.once("value", function (snapshot) {
            var cities = snapshot.val();
            return res.view('add-update-supplier', {
              title: sails.config.title.edit_supplier,
              'supplier': supplier,
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
    var status = req.body.is_active;
    if(id != ''){
      db.ref('/supplier/' + id)
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

