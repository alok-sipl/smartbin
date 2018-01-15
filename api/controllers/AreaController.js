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
      var ref = db.ref();
      var circle = ref.child("areas/-L2sgNgUAhpYrq_4r1Ki");

      var _newArea = {
        city_id : "-L0xcM9R_zgmOhLsyOiJ",
        country_id : "-L1pigYbq_ZQl009gBoU",
        created_date : 1515232076118,
        modified_date : 1515232076118,
        name : "ISKCON ,KHARGONE Area",
        state_id : "-L0xcM9R_zgmOhLsyOiX",
        ward_id : "-L2dn3COK_BYy8VkWB4Q",
        circle_id: "-L2e7fEvmHHh7Pj4R30f"
      }

      
      circle.push(_newArea).then(function (_area) {
       console.log("Area created: " + JSON.stringify(_area));
      // return res.redirect("area");
    }, function (error) {
      console.error("Error on createArea");
      console.error(JSON.stringify(err));
    });
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
        return res.json(snapshot.val());
      });
    }else{
      return res.json({});
    }
  },

}