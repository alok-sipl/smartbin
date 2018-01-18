/**
 * AreaController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var db = sails.config.globals.firebasedb();
 var firebaseAuth = sails.config.globals.firebaseAuth();

 module.exports = {

   /**
     * `AreaController.create()`
     */
     // circle 1 and ward 18
     create: function (req, res) {
    //   var ref = db.ref();
    //   var circle = ref.child("areas/-L2ub8xoecEPjg-nDxNr");
    //   var _newArea = {
    //     city_id : "-L0xcM9R_zgmOhLsyOiJ",
    //     country_id : "-L1pigYbq_ZQl009gBoU",
    //     created_date : 1515232076118,
    //     modified_date : 1515232076118,
    //     name : "Radha Vallabh Market",
    //     state_id : "-L0xcM9R_zgmOhLsyOiX",
    //     ward_id : "-L2ub8xoecEPjg-nDxNr",
    //     circle_id: "-L2e81tPlcPPuyxGpNdP"
    //   }
    //   circle.push(_newArea).then(function (_area) {

    //     var ref = db.ref();
    //     var circle = ref.child("areas/-L2ub8xoecEPjg-nDxNr");
    //     var _newArea = {
    //       city_id : "-L0xcM9R_zgmOhLsyOiJ",
    //       country_id : "-L1pigYbq_ZQl009gBoU",
    //       created_date : 1515232076118,
    //       modified_date : 1515232076118,
    //       name : "New Radha Vallabh Market",
    //       state_id : "-L0xcM9R_zgmOhLsyOiX",
    //       ward_id : "-L2ub8xoecEPjg-nDxNr",
    //       circle_id: "-L2e81tPlcPPuyxGpNdP"
    //     }
    //     circle.push(_newArea).then(function (_area) {

    //   // return res.redirect("area");
    // }, function (error) {
    //   console.error("Error on createArea");
    //   console.error(JSON.stringify(err));
    // });
    //   }, function (error) {
    //     console.error("Error on createArea");
    //     console.error(JSON.stringify(err));
    //   });
    },


      /*
  * Name: getAreaByWard
  * Created By: A-SIPL
  * Created Date: 15-jan-2018
  * Purpose: get area of the selected ward
  * @param  type
  */
  getAreaByWard: function (req, res) {
    if(req.body.id) {
      var ref = db.ref("areas/" + req.body.id);
      ref.once("value", function (snapshot) {
        var wards = CountryService.snapshotToArray(snapshot);
        wards = wards.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        return res.json(wards);
      });
    }else{
      return res.json({});
    }
  },

}