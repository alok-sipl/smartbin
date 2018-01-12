/**
 * TypesController
 *
 * @description :: Server-side logic for managing types
 */
 var db = sails.config.globals.firebasedb();
 var firebaseAuth = sails.config.globals.firebaseAuth();
 var ref = db.ref("types");

 module.exports = {
    /**
     * `TypesController.create()`
     */
     create: function (req, res) {
       var _newTypes = {
            name: "Type 2",
            is_deleted: false
        };
        ref.push(_newTypes).then(function (_types) {
           console.log("Types created: " + JSON.stringify(_types));
           return res.redirect("types");
       }, function (error) {
        console.error("Error on createTypes");
        console.error(JSON.stringify(err));
        return res.view("types/new", {
            types: _newTypes,
            status: 'Error',
            statusDescription: err,
            title: 'Add a new types'
        });
    });
    }
}
