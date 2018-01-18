/**
 * BinController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var async = require('async');
 var db = sails.config.globals.firebasedb();
 var firebaseAuth = sails.config.globals.firebaseAuth();

 module.exports = {

   /**
     * `BinController.create()`
     */
     create: function (req, res) {
      var ref = db.ref("bins");

      var _newBin = {
        alert_level : "85",
        area_id : "-L0xcM9R_zgmOhLsyTUP",
        city_id : "-L0xcM9R_zgmOhLsyOiJ",
        country_id : "-L1pigYbq_ZQl009gBoU",
        created_date : 1515232076118,
        current_level : 44,
        device_id : 865691034146928,
        id : "865691034146928",
        is_deleted : false,
        latitude : 21.8116593,
        location : "ISKCON ,KHARGONE",
        longitude : 75.5834045,
        modified_date : 1515232076118,
        circle_id : "-L2e7fEvmHHh7Pj4R30f",
        name : "ISKCON ,KHARGONE",
        smoke : 0,
        state_id : "-L0xcM9R_zgmOhLsyOiX",
        ward_id : "-L2KJ0fCuEMiUkKcRCmv"
      }


      ref.push(_newBin).then(function (_bin) {
       console.log("Bin created: " + JSON.stringify(_bin));
      // return res.redirect("bins");
    }, function (error) {
      console.error("Error on createBin");
      console.error(JSON.stringify(err));
    });
    },

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
    console.log("bin list ");
    bins = [];
    var ref = db.ref("bins");
    ref.once('value', function (snap) {
      var tempBinRecords = [];
      _.map(snap.val(),function (val, bin_key){
        val.bin_key = bin_key;
        tempBinRecords.push(val)
      });
      if(Object.keys(snap.val()).length){
        var i = 0;
        async.forEach(tempBinRecords, function (childSnap, callback){
          updateBin = {};  
          var ref = db.ref("areas/" + childSnap.ward_id + "/" + childSnap.area_id);
          ref.once("value", function (snapshot) {
            var area = snapshot.val();
            var ref = db.ref("circlewards/" + childSnap.circle_id + "/" + childSnap.ward_id);
            ref.once("value", function (snapshotWards) {
              var ward = snapshotWards.val();
              bindetails = childSnap;
              updateBin = bindetails; 
              updateBin.latitude = parseFloat(updateBin.latitude);
              updateBin.longitude = parseFloat(updateBin.longitude);
              if(ward){
                updateBin.ward_name = ward.name;
              }
              if(area){
                updateBin.area_name = area.name;
              } 
              bins.push(updateBin);
              i++;
              callback();
              if(i  == Object.keys(snap.val()).length){
               return res.json({'rows':bins});
             }
           });
          });
        });
      }else{
        bins ={};
        return bins;
      }

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
      var wards = {};
      var areas = {};
      var circles = {};
      /* Checking validation if form post */
      if (req.method == "POST") {
        errors = ValidationService.validate(req);
        if (Object.keys(errors).length) {

          /* country listing*/
          var ref = db.ref("countries");
          ref.orderByChild("name")
          once("value", function (snapshot) {
            var countries = snapshot.val();

            /* ward listing*/
            var ref = db.ref("wards");
            ref.once("value", function (wardSnapshot) {
              var wards = wardSnapshot.val();

              return res.view('add-update-bin', {
                'title': sails.config.title.add_bin,
                'bin': bin,
                'countries': countries,
                'states': states,
                'cities': cities,
                'wards': wards,
                'errors': errors,
                'req': req
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
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
                ref.orderByChild("name")
                .once("value", function (snapshot) {
                  var countries = snapshot.val();

                  /* ward listing*/
                  var ref = db.ref("wards");
                /*  ref.once("value", function (wardSnapshot) {
                    var wards = wardSnapshot.val();

                    */  return res.view('add-update-bin', {
                      'title': sails.config.title.add_bin,
                      'bin': bin,
                      'countries': countries,
                      'states': states,
                      'cities': cities,
                      'wards' : wards,
                      'errors': errors,
                      'req': req
                    });
                 /* }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });*/
                }, function (errorObject) {
                  return res.serverError(errorObject.code);
                });
              } else {
                if (uploadedFiles.length === 0) {
                  errors['image'] = {message: Bin.message.bin_image_required}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.orderByChild("name")
                  .once("value", function (snapshot) {
                    var countries = snapshot.val();
/*                    var ref = db.ref("wards");
                    ref.once("value", function (wardSnapshot) {
                      var wards = wardSnapshot.val();
                      */
                      return res.view('add-update-bin', {
                        'title': sails.config.title.add_supplier,
                        'bin': bin,
                        'countries': countries,
                        'states': states,
                        'cities': cities,
                        'wards' : wards,
                        'errors': errors,
                        'req': req
                      });
                  /*  }, function (errorObject) {
                      return res.serverError(errorObject.code);
                    });*/
                  }, function (errorObject) {
                    return res.serverError(errorObject.code);
                  });
                } else if (allowExts.indexOf(uploadedFiles[0].type) == -1) {
                  errors['image'] = {message: Bin.message.invalid_file}
                  /* country listing*/
                  var ref = db.ref("countries");
                  ref.orderByChild("name")
                  .once("value", function (snapshot) {
                    var countries = snapshot.val();

                  /*  var ref = db.ref("wards");
                    ref.once("value", function (wardSnapshot) {
                      var wards = wardSnapshot.val();
                      */
                      return res.view('add-update-bin', {
                        'title': sails.config.title.add_bin,
                        'bin': bin,
                        'countries': countries,
                        'states': states,
                        'cities': cities,
                        'wards': wards,
                        'errors': errors,
                        'req': req
                      });
                /*    }, function (errorObject) {
                      return res.serverError(errorObject.code);
                    });*/
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
                    ward_id: req.param('ward'),
                    city_id: req.param('city'),
                    country_id: req.param('country'),
                    created_date: Date.now(),
                    id: req.param('id'),
                    is_deleted: false,
                    latitude: req.param('latitude'),
                    location: req.param('location'),
                    longitude: req.param('longitude'),
                    modified_date: Date.now(),
                    circle_id : req.param('circle'),
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
  ref.orderByChild("name")
  .once("value", function (snapshot) {
    var countries = CountryService.snapshotToArray(snapshot);
    countries = countries.sort(function(a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    /* ward listing*/
  /*  var ref = db.ref("wards");
    ref.once("value", function (wardSnapshot) {
      var wards = wardSnapshot.val();*/

      return res.view('add-update-bin', {
        'title': sails.config.title.add_supplier,
        'bin': bin,
        'countries': countries,
        'states': states,
        'cities': cities,
        'wards' : wards,
        'circles' : circles,
        'areas': areas,
        'errors': errors,
        'req': req
      });
   /* }, function (errorObject) {
      return res.serverError(errorObject.code);
    });*/
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
      var states = {};
      var isFormError = false;
      var errors = {};
      var wards = {};
      var circles = {};
      var areas = {};
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

                var refState = db.ref("states/" + bin.country_id);
                refState.once("value", function (snapshotState) {
                  var states = snapshotState.val();

                  var refCity = db.ref("cities/" + bin.state_id);
                  refCity.once("value", function (snapshotCity) {
                    var cities = snapshotCity.val();

                    var refCircle = db.ref("circles/" + bin.city_id);
                    refCircle.once("value", function (snapshotCircle) {
                      var circles = snapshotCircle.val();

                      var refWards = db.ref("circlewards/" + bin.circle_id);
                      refWards.once("value", function (snapshotWards) {
                        var wards = snapshotWards.val();

                        var refAreas = db.ref("areas/" + bin.ward_id);
                        refAreas.once("value", function (snapshotAreas) {
                          var areas = snapshotAreas.val();

                          return res.view('add-update-bin', {
                            title: sails.config.title.edit_bin,
                            'bin': bin,
                            "countries": countries,
                            "states": states,
                            "cities": cities,
                            'wards' : wards,
                            'circles' : circles,
                            'areas': areas,
                            "errors": errors
                          });
                        });
                      });
                    });
                    /* Get Areas */
                  });
                  /* Get Cities */
                });
              });
              /* Get States */
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

                  var refState = db.ref("states/" + bin.country_id);
                  refState.once("value", function (snapshotState) {
                    var states = snapshotState.val();

                    var refCity = db.ref("cities/" + bin.state_id);
                    refCity.once("value", function (snapshotCity) {
                      var cities = snapshotCity.val();

                      var refCircle = db.ref("circles/" + bin.city_id);
                      refCircle.once("value", function (snapshotCircle) {
                        var circles = snapshotCircle.val();

                        var refWards = db.ref("circlewards/" + bin.circle_id);
                        refWards.once("value", function (snapshotWards) {
                          var wards = snapshotWards.val();

                          var refAreas = db.ref("areas/" + bin.ward_id);
                          refAreas.once("value", function (snapshotAreas) {
                            var areas = snapshotAreas.val();

                            return res.view('add-update-bin', {
                              title: sails.config.title.edit_bin,
                              'bin': bin,
                              "countries": countries,
                              "states": states,
                              "cities": cities,
                              'wards' : wards,
                              'circles' : circles,
                              'areas': areas,
                              "errors": errors
                            });
                          });
                        });
                      });
                      /* Get Areas */
                    });
                    /* Get Cities */
                  });
                });
                /* Get States */
              }, function (errorObject) {
                return res.serverError(errorObject.code);
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          } else {
            if ((Object.keys(uploadedFiles).length) && (allowExts.indexOf(uploadedFiles[0].type) == -1)) {
              errors['image'] = {message: Bin.message.invalid_file}

              var ref = db.ref("countries");
              ref.once("value", function (snapshot) {

                var countries = snapshot.val();

                /* bin detail */
                var ref = db.ref("bins/" + req.params.id);
                ref.once("value", function (snapshot) {
                  var bin = snapshot.val();
                  /* city name */
                  ref.once("value", function (snapshot) {

                    var refState = db.ref("states/" + bin.country_id);
                    refState.once("value", function (snapshotState) {
                      var states = snapshotState.val();

                      var refCity = db.ref("cities/" + bin.state_id);
                      refCity.once("value", function (snapshotCity) {
                        var cities = snapshotCity.val();

                        var refCircle = db.ref("circles/" + bin.city_id);
                        refCircle.once("value", function (snapshotCircle) {
                          var circles = snapshotCircle.val();

                          var refWards = db.ref("circlewards/" + bin.circle_id);
                          refWards.once("value", function (snapshotWards) {
                            var wards = snapshotWards.val();

                            var refAreas = db.ref("areas/" + bin.ward_id);
                            refAreas.once("value", function (snapshotAreas) {
                              var areas = snapshotAreas.val();

                              return res.view('add-update-bin', {
                                title: sails.config.title.edit_bin,
                                'bin': bin,
                                "countries": countries,
                                "states": states,
                                "cities": cities,
                                'wards' : wards,
                                'circles' : circles,
                                'areas': areas,
                                "errors": errors
                              });
                            });
                          });
                        });
                        /* Get Areas */
                      });
                      /* Get Cities */
                    });
                  });
                  /* Get States */
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
                ward_id : req.param('ward'),
                city_id: req.param('city'),
                country_id: req.param('country'),
                is_deleted: false,
                latitude: req.param('latitude'),
                location: req.param('location'),
                longitude: req.param('longitude'),
                modified_date: Date.now(),
                circle_id : req.param('circle'),
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

        var refState = db.ref("states/" + bin.country_id);
        refState.once("value", function (snapshotState) {
          var states = snapshotState.val();

          var refCity = db.ref("cities/" + bin.state_id);
          refCity.once("value", function (snapshotCity) {
            var cities = snapshotCity.val();

            var refCircle = db.ref("circles/" + bin.city_id);
            refCircle.once("value", function (snapshotCircle) {
              var circles = snapshotCircle.val();

              var refWards = db.ref("circlewards/" + bin.circle_id);
              refWards.once("value", function (snapshotWards) {
                var wards = snapshotWards.val();
                console.log("circle id == ",bin.circle_id);
                console.log("ward===");
                console.log(wards);
                var refAreas = db.ref("areas/" + bin.ward_id);
                refAreas.once("value", function (snapshotAreas) {
                  var areas = snapshotAreas.val();

                  return res.view('add-update-bin', {
                    title: sails.config.title.edit_bin,
                    'bin': bin,
                    "countries": countries,
                    "states": states,
                    "cities": cities,
                    'wards' : wards,
                    'circles' : circles,
                    'areas': areas,
                    "errors": errors
                  });
                });
              });
            });
            /* Get Areas */
          });
          /* Get Cities */
        });
      });
      /* Get States */
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
       var wards = [];
       db.ref('/bins')
       .once('value')
       .then(function (snapshot) {
        var bins = snapshot.val();

        var ref = db.ref("circlewards");
        ref.once("value", function (snapshotWards) {
         _.map(snapshotWards.val(),function (val, bin_key){
          _.map(val,function (val2, ward_key){
            val2.id = ward_key;
            wards.push(val2)
          });
        });
         wards.sort(function (a, b) {
            return a.name - b.name;
        })
         console.log(wards);
         return res.view('search-bin', {
          title: sails.config.title.supplier_list,
          bins: bins,
          wards: wards,
        });
       }).catch(function (err) {
        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('bin/search');
      });
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
      var selected_ward = req.body.selected_ward;
//console.log("selected_ward==",selected_ward);
if(!selected_ward)
{
         // console.log("search without ward11");

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
         // console.log("search with ward");
       //   console.log(selected_ward);
       db.ref('bins').orderByChild("ward_id").equalTo(selected_ward).once('value')
       .then(function (snapshot) {

        var bins = snapshot.val();
        return res.json({'bins':bins});
      }).catch(function (err) {
        req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.something_went_wronge + '</div>');
        return res.redirect('bin/search');
      });
    }


  },
};

/*
   * Name: getBinList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
   function getBinsList(snap){
   // console.log(Object.keys(snap.val()).length);

   if(Object.keys(snap).length){
    var i = 0;
    snap.forEach(function (childSnap) {
      bindetails = childSnap.val();
        updateBin = {};    //    console.log("bindetails.city_id==",bindetails.ward_id);

        updateBin.bin_key =  childSnap.key;
        updateBin = bindetails;    //    console.log("bindetails.city_id==",bindetails.ward_id);

        bins.push(updateBin);


      });
    return bins;
  }else{
    bins ={};
    return bins;
  }
}