/**
 * BinController
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
    return res.view('bin-listing', {
      'title' : sails.config.title.bin_list
    });
   },


   /*
   * Name: binlist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
  binlist:function(req, res){
    bins = [];
    areas = [];
    cities = [];
    countries = [];
    states = [];
    var ref = db.ref('countries');
    ref.once("value", function (countrySnapshot) {
      countries = countrySnapshot.val();
      var ref = db.ref("states");
      ref.once('value', function (stateSnapshot) {
        states = stateSnapshot.val();
        var ref = db.ref("cities");
        ref.once('value', function (citySnapshot) {
          cities = citySnapshot.val();
          var ref = db.ref("areas");
          ref.once('value', function (areaSnapshot) {
            areas = areaSnapshot.val();
            var ref = db.ref("bins");
            ref.once('value', function (snap) {
              var cityJson     = (Object.keys(snap).length) ? getBinsList(snap, countries, states, cities, areas) : {};
              return res.json({'rows':cityJson});
            });
          });
        });
      });
    });
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
    var bin = {};
    var countries = {};
    var states = {};
    var cities = {};
    /* Checking validation if form post */
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {

        /* country listing*/
        var ref = db.ref("countries");
        ref.once("value", function (snapshot) {
          var countries = snapshot.val();
          return res.view('add-update-bin', {
            'title': sails.config.title.add_bin,
            'bin': bin,
            'countries': countries,
            'states': states,
            'cities': cities,
            'errors': errors,
            'req': req
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        var allowExts = ['image/png', 'image/jpg', 'image/jpeg'];
        var ref = db.ref("/bins");
        ref.orderByChild("id").equalTo(req.param('id')).once('value')
          .then(function (snapshot) {
            bindata = snapshot.val();
            req.file('image').upload({
              // don't allow the total upload size to exceed ~4MB
              maxBytes: sails.config.length.max_file_upload
            }, function whenDone(err, uploadedFiles) {
              if (err) {
                errors['image'] = {message: err}
                /* country listing*/
                var ref = db.ref("countries");
                ref.once("value", function (snapshot) {
                  var countries = snapshot.val();
                  return res.view('add-update-bin', {
                    'title': sails.config.title.add_bin,
                    'bin': bin,
                    'countries': countries,
                    'states': states,
                    'cities': cities,
                    'errors': errors,
                    'req': req
                  });
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
              } else {
                if (uploadedFiles.length === 0) {
                  errors['image'] = {message: Bin.message.bin_image_required}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.once("value", function (snapshot) {
                    var countries = snapshot.val();
                    return res.view('add-update-bin', {
                      'title': sails.config.title.add_supplier,
                      'bin': bin,
                      'countries': countries,
                      'states': states,
                      'cities': cities,
                      'errors': errors,
                      'req': req
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  errors['image'] = {message: Bin.message.invalid_file}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.once("value", function (snapshot) {
                    var countries = snapshot.val();
                    return res.view('add-update-bin', {
                      'title': sails.config.title.add_bin,
                      'bin': bin,
                      'countries': countries,
                      'states': states,
                      'cities': cities,
                      'errors': errors,
                      'req': req
                    });
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
                } else if (bindata) {
                  req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('id') + sails.config.flash.bin_id_already_exist + '</div>');
                  return res.redirect(sails.config.base_url + 'bin/add');
                } else {
                  var ref = db.ref("bins");
                  var data = {
                    alert_level: req.param('alert_level'),
                    area_id: req.param('area'),
                    city_id: req.param('city'),
                    country_id: req.param('country'),
                    created_date: Date.now(),
                    id: req.param('id'),
                    is_deleted: true,
                    latitude: req.param('latitude'),
                    location: req.param('location'),
                    longitude: req.param('longitude'),
                    modified_date: Date.now(),
                    name: req.param('name'),
                    state_id: req.param('state'),
                  }
                  ref.push(data).then(function (ref) {
                    req.flash('flashMessage', '<div class="alert alert-success">Bin Added Successfully.</div>');
                    return res.redirect(sails.config.base_url + 'bin');
                  }, function (error) {
                    req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Bin.</div>');
                    return res.redirect(sails.config.base_url + 'bin');
                  });
                }
              }
            });
          }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'bin');
        });
      }
    } else {
      /* country listing*/
      var ref = db.ref("countries");
      ref.once("value", function (snapshot) {
        var countries = snapshot.val();
        return res.view('add-update-bin', {
          'title': sails.config.title.add_supplier,
          'bin': bin,
          'countries': countries,
          'states': states,
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
    var bin = {};
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
        /* bin detail */
        var ref = db.ref("bins/" + req.params.id);
        ref.once("value", function (snapshot) {
          var bin = snapshot.val();
          /* city name */
          ref.once("value", function (snapshot) {

            /* Get States */
            var refstates = db.ref('states');
            refstates.orderByChild('country_id')
              .equalTo(bin.country_id)
              .once("value",function (snapshot) {
                  var states = snapshot.val();

                  /* Get Cities */
                  var refcities = db.ref('cities');
                  refcities.orderByChild('state_id')
                    .equalTo(bin.state_id)
                    .once("value",function (snapshot) {
                        var cities = snapshot.val();

                        /* Get Areas */
                        var refareas = db.ref('areas');
                        refareas.orderByChild('city_id')
                          .equalTo(bin.city_id)
                          .once("value",function (snapshot) {
                              var areas = snapshot.val();
                              return res.view('add-update-bin', {
                                title: sails.config.title.edit_bin,
                                'bin': bin,
                                "countries": countries,
                                "states": states,
                                "cities": cities,
                                "areas": areas,
                                "errors": errors
                              });
                          });
                        /* Get Areas */
                    });
                  /* Get Cities */
              });
            /* Get States */
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
        req.file('image').upload({
          // don't allow the total upload size to exceed ~4MB
          maxBytes: sails.config.length.max_file_upload
        }, function whenDone(err, uploadedFiles) {
          if (err) {
            errors['image'] = {message: err}
            /* country listing*/
            var ref = db.ref("countries");
            ref.once("value", function (snapshot) {

              var countries = snapshot.val();
              /* bin detail */
              var ref = db.ref("bins/" + req.params.id);
              ref.once("value", function (snapshot) {
                var bin = snapshot.val();
                /* city name */
                ref.once("value", function (snapshot) {

                  /* Get States */
                  var refstates = db.ref('states');
                  refstates.orderByChild('country_id')
                    .equalTo(bin.country_id)
                    .once("value",function (snapshot) {
                        var states = snapshot.val();

                        /* Get Cities */
                        var refcities = db.ref('cities');
                        refcities.orderByChild('state_id')
                          .equalTo(bin.state_id)
                          .once("value",function (snapshot) {
                              var cities = snapshot.val();

                              /* Get Areas */
                              var refareas = db.ref('areas');
                              refareas.orderByChild('city_id')
                                .equalTo(bin.city_id)
                                .once("value",function (snapshot) {
                                    var areas = snapshot.val();
                                    return res.view('add-update-bin', {
                                      title: sails.config.title.edit_bin,
                                      'bin': bin,
                                      "countries": countries,
                                      "states": states,
                                      "cities": cities,
                                      "areas": areas,
                                      "errors": errors
                                    });
                                });
                              /* Get Areas */

                          });
                        /* Get Cities */
                    });
                      /* Get States */
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
              errors['image'] = {message: Bin.message.invalid_file}
              /* country listing*/
              var ref = db.ref("countries");
              ref.once("value", function (snapshot) {
              var countries = snapshot.val();
              /* bin detail */
              var ref = db.ref("bins/" + req.params.id);
              ref.once("value", function (snapshot) {
                var bin = snapshot.val();
                /* city name */
                ref.once("value", function (snapshot) {

                  /* Get States */
                  var refstates = db.ref('states');
                  refstates.orderByChild('country_id')
                    .equalTo(bin.country_id)
                    .once("value",function (snapshot) {
                        var states = snapshot.val();

                        /* Get Cities */
                        var refcities = db.ref('cities');
                        refcities.orderByChild('state_id')
                          .equalTo(bin.state_id)
                          .once("value",function (snapshot) {
                              var cities = snapshot.val();

                              /* Get Areas */
                              var refareas = db.ref('areas');
                              refareas.orderByChild('city_id')
                                .equalTo(bin.city_id)
                                .once("value",function (snapshot) {
                                    var areas = snapshot.val();
                                    return res.view('add-update-bin', {
                                      title: sails.config.title.edit_bin,
                                      'bin': bin,
                                      "countries": countries,
                                      "states": states,
                                      "cities": cities,
                                      "areas": areas,
                                      "errors": errors
                                    });
                                });
                              /* Get Areas */
                          });
                        /* Get Cities */
                    });
            /* Get States */
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
              db.ref('bins/' + req.params.id)
                .update({
                    alert_level: req.param('alert_level'),
                    area_id: req.param('area'),
                    city_id: req.param('city'),
                    country_id: req.param('country'),
                    is_deleted: true,
                    latitude: req.param('latitude'),
                    location: req.param('location'),
                    longitude: req.param('longitude'),
                    modified_date: Date.now(),
                    name: req.param('name'),
                    state_id: req.param('state'),
                })
                .then(function (res) {
                  req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.bin_updated_success + '</div>');
                  return res.redirect(sails.config.base_url + 'bin');
                })
                .catch(function (err) {
                  req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.bin_add_error + '</div>');
                  return res.redirect(sails.config.base_url + 'bin/edit/' + req.params.id);
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
        /* bin detail */
        var ref = db.ref("bins/" + req.params.id);
        ref.once("value", function (snapshot) {
          var bin = snapshot.val();
          /* city name */
          ref.once("value", function (snapshot) {

            /* Get States */
            var refstates = db.ref('states');
            refstates.orderByChild('country_id')
              .equalTo(bin.country_id)
              .once("value",function (snapshot) {
                  var states = snapshot.val();

                  /* Get Cities */
                  var refcities = db.ref('cities');
                  refcities.orderByChild('state_id')
                    .equalTo(bin.state_id)
                    .once("value",function (snapshot) {
                        var cities = snapshot.val();

                        /* Get Areas */
                        var refareas = db.ref('areas');
                        refareas.orderByChild('city_id')
                          .equalTo(bin.city_id)
                          .once("value",function (snapshot) {
                              var areas = snapshot.val();
                              return res.view('add-update-bin', {
                                title: sails.config.title.edit_bin,
                                'bin': bin,
                                "countries": countries,
                                "states": states,
                                "cities": cities,
                                "areas": areas,
                                "errors": errors
                              });
                          });
                        /* Get Areas */

                    });
                  /* Get Cities */

              });
            /* Get States */
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
      db.ref('/bins/' + id)
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
  },

  /*
     * Name: search
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  search: function (req, res) {
    var ref = db.ref('areas');
    ref.once("value", function (countrySnapshot) {
      areas = countrySnapshot.val();
      db.ref('/bins')
      .once('value')
      .then(function (snapshot) {
          var bins = snapshot.val();
          return res.view('search-bin', {
            title: sails.config.title.supplier_list,
            bins: bins,
            areas: areas,
          });
      }).catch(function (err) {
        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('bin/search');
    });
    }).catch(function (err) {
        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('bin/search');
    });    
  },


  /*
     * Name: filterbins
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: show listing of the supplier
     * @param  int  $id
     */
  filterbins: function (req, res) {
    var selected_area = req.body.selected_area;
    var ref = db.ref('areas');
    ref.once("value", function (countrySnapshot) {
      areas = countrySnapshot.val();
      if(selected_area=='')
      {
        db.ref('/bins')
        .once('value')
        .then(function (snapshot) {
            var bins = snapshot.val();
            return res.json({'bins':bins});
        }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect('bin/search');
        });
      }
      else
      {
        console.log(selected_area);
        db.ref('bins').orderByChild("area_id").equalTo(selected_area).once('value')
        .then(function (snapshot) {

            var bins = snapshot.val();
            return res.json({'bins':bins});
        }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect('bin/search');
        });
      }
      
    }).catch(function (err) {
        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('bin/search');
    });    
  

  },
};

/*
   * Name: getBinList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getBinsList(snap, countries, states, cities, areas){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      bindetails = childSnap.val();
      updateBin = bindetails;
      updateBin.country_name =  countries[bindetails.country_id].name;
      updateBin.state_name =  states[bindetails.state_id].name;
      updateBin.city_name =  cities[bindetails.city_id].name;
      updateBin.area_name =  areas[bindetails.area_id].name;
      updateBin.bin_key =  childSnap.key;
      bins.push(updateBin);
    });
    return bins;
  }else{
    bins ={};
    return bins;
  }
}

