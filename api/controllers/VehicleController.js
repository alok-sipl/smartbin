/**
 * DriverController
 *
 * @description :: Server-side logic for managing vehicles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var db = sails.config.globals.firebasedb();
 var firebaseAuth = sails.config.globals.firebaseAuth();

 module.exports = {

   /**
     * `VehicleController.create()`
     */
     create: function (req, res) {
       var ref = db.ref("vehicles");

       var _newVehicle = {
        name: 'Vehicle 1',
        number: 123456,
        type: '-L2VibyIELrnS2I71fz6',
        assign_to: '-L1uoI76jYmZxUnfyyJv',
        is_deleted: false
      };
      ref.push(_newVehicle).then(function (_vehicle) {
       console.log("Vehicle created: " + JSON.stringify(_vehicle));
       //return res.redirect("country");
     }, function (error) {
      console.error("Error on createVehicle");
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
      return res.view('vehicle-listing', {
        'title' : sails.config.title.vehicle_list
      });
    },


   /*
   * Name: vehiclelist
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: shpw grid with data
   * @param  req
   */
   vehiclelist:function(req, res){
    /* vehicle listing*/
    vehicles = [];

    var ref = db.ref("types");
    ref.once('value', function (typeSnapshot) {
      types = typeSnapshot.val();
      /* ward listing*/
      var ref = db.ref("drivers");
      ref.once("value", function (driverSnapshot) {
        var drivers = driverSnapshot.val();

        var ref = db.ref("vehicles");
        ref.once('value', function (snap) {
          var userJson     = (Object.keys(snap).length) ? getDriverList(snap,types,drivers) : {};
          return res.json({'rows':userJson});
        });
      });
    });
  },

  /*
     * Name: add
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new vehicle
     * @param  req
     */
     add: function (req, res) {
      console.log("call add method");
      var isFormError = false;
      var errors = {};
      var vehicle = {};
      var types = {};
      var drivers = {};

      /* Checking validation if form post */
      if (req.method == "POST") {
       // return false;
       console.log("call add post method");
       errors = ValidationService.validate(req);
       if (Object.keys(errors).length) {
        console.log("call add post method error");

        /* types listing*/
        var ref = db.ref("types");
        ref.once("value", function (snapshot) {
          var types = snapshot.val();

          var driversRef = db.ref("drivers");
          driversRef.once("value", function (driversRefSnapshot) {
            var drivers = driversRefSnapshot.val();

            return res.view('add-update-vehicle', {
              'title': sails.config.title.add_vehicle,
              'vehicle': vehicle,
              'types': types,
              'drivers': drivers,
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
        console.log("call add post method 129 line no");
        var ref = db.ref("/vehicles");
        ref.orderByChild("number").equalTo(req.param('number')).once('value')
        .then(function (snapshot) {
          console.log("call add post method 134 line no");

          requestData = snapshot.val();
          if (requestData) {
            console.log("call add post method 138 line no");

            req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('number') + sails.config.flash.vehicle_number_already_exist + '</div>');
            return res.redirect(sails.config.base_url + 'vehicle/add');
          } else {

            console.log("call add post method 142 line no");

            var ref = db.ref("vehicles");
            var data = {
              name: req.param('name'),
              number: req.param('number'),
              type: req.param('type'),
              assign_to: req.param('assign_to'),
              is_deleted: false,
              created_date: Date.now(),
              modified_date: Date.now()
            }

            console.log(data);
            ref.push(data).then(function (ref) {
              console.log("vehicle added Successfully");
              req.flash('flashMessage', '<div class="alert alert-success">Vehicle Added Successfully.</div>');
              return res.redirect(sails.config.base_url + 'vehicle');
            }, function (error) {
              console.log("vehicle added un Successfully");
              req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Vehicle.</div>');
              return res.redirect(sails.config.base_url + 'vehicle');
            });
          }              
        }).catch(function (err) {
          req.flash('flashMessage', '<div class="alert alert-danger">' + sails.config.flash.something_went_wronge + '</div>');
          return res.redirect(sails.config.base_url + 'vehicle');
        });
      }
    } else {

      var ref = db.ref("types");
      ref.once("value", function (typesSnapshot) {
        var types = typesSnapshot.val();

        /* wards listing*/
        var ref = db.ref("drivers");
        ref.once("value", function (snapshot) {
          var drivers = snapshot.val();

          return res.view('add-update-vehicle', {
            'title': sails.config.title.add_vehicle,
            'types': types,
            'drivers': drivers,
            'vehicle': vehicle,
            'errors': errors,
            'req': req
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
     * Name: edit
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new vehicle
     * @param  req
     */
     edit: function (req, res) {
      var types = {};
      var drivers = {};
      var isFormError = false;
      var errors = {};
      if (req.method == "POST") {
        errors = ValidationService.validate(req);
        if (Object.keys(errors).length) {
          /* type listing*/
          var ref = db.ref("types");
          ref.once("value", function (snapshot) {
            var types = snapshot.val();

            /* driver listing*/
            var ref = db.ref("driver");
            ref.once("value", function (driverSnapshot) {
              var driver = driverSnapshot.val();

              /* driver detail */
              var ref = db.ref("vehicles/" + req.params.id);
              ref.once("value", function (snapshot) {
                var vehicle = snapshot.val();

                /* city name */
                return res.view('add-update-vehicle', {
                  title: sails.config.title.edit_supplier,
                  'vehicle': vehicle,
                  "types": types,
                  "drivers": drivers,
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
}else{
  var ref = db.ref();
  console.log("update data");
  console.log({'name': req.param('name'),
    'number': req.param('number'),
    'type': req.param('type'),
    'assign_to': req.param('assign_to'),
    modified_date: Date.now()

  });

  db.ref('vehicles/' + req.params.id)
  .update({'name': req.param('name'),
    'number': req.param('number'),
    'type': req.param('type'),
    'assign_to': req.param('assign_to'),
    modified_date: Date.now()
  })

  .then(function (res) {
    req.flash('flashMessage', '<div class="alert alert-success">' + sails.config.flash.vehicle_updated_success + '</div>');
    return res.redirect(sails.config.base_url + 'vehicle');
  })
  .catch(function (err) {
    req.flash('flashMessage', '<div class="alert alert-error">' + sails.config.flash.vehicle_add_error + '</div>');
    return res.redirect(sails.config.base_url + 'vehicle/edit/' + req.params.id);
  });

}
}  else {
  /* type listing*/
  console.log("edit page");
  var ref = db.ref("types");
  ref.once("value", function (typeSnapshot) {
    var types = typeSnapshot.val();
 console.log(types);
       
    var ref = db.ref("drivers");
    ref.once("value", function (driversSnapshot) {
      var drivers = driversSnapshot.val();


      /* vehicle detail */
      var ref = db.ref("vehicles/" + req.params.id);
      ref.once("value", function (snapshot) {
        var vehicle = snapshot.val();
        /* city name */
        ref.once("value", function (snapshot) {
          var cities = snapshot.val();
          return res.view('add-update-vehicle', {
            title: sails.config.title.edit_vehicle,
            'vehicle': vehicle,
            "drivers": drivers,
            "types": types,
            "vehicles": vehicle,
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
        db.ref('/vehicles/' + id)
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
   function getDriverList(snap,drivers,types){
    if(Object.keys(snap).length){
      snap.forEach(function (childSnap) {
        vehicle = childSnap.val();
        updateUser = vehicle;
        updateUser.vehicle_key =  childSnap.key;
        updateUser.assign_to_name =  updateUser.assign_to != undefined ? drivers[updateUser.type].name: '';
        updateUser.type_name =  updateUser.type != undefined ? types[updateUser.assign_to].name: '';
        vehicles.push(updateUser);
      });
      return vehicles;
    }else{
      vehicles ={}
      return vehicles;
    }
  }


