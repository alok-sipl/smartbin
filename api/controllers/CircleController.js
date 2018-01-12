/**
 * DriverController
 *
 * @description :: Server-side logic for managing circles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var db = sails.config.globals.firebasedb();
 var firebaseAuth = sails.config.globals.firebaseAuth();

 module.exports = {

   /**
     * `VehicleController.create()`
     */
     create: function (req, res) {
       var ref = db.ref("circles");
        var ward = [];
        ward.push('-L2KIB-k19hAD5ZQtPIx');
        ward.push('-L2KJ0fCuEMiUkKcRCmv');
        var _newVehicle = {
            name: 'Circle 1',
            ward: ward,
            is_deleted: false
        };
        ref.push(_newVehicle).then(function (_circle) {
           console.log("Circle created: " + JSON.stringify(_circle));
           return res.redirect("circle");
       }, function (error) {
        console.error("Error on createCircle");
        console.error(JSON.stringify(err));
    });
    }
  }