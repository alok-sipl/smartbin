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
    /* ward listing*/
    var ref = db.ref("wards");
    ref.once("value", function (wardSnapshot) {
      var wards = wardSnapshot.val();
       var ref = db.ref("drivers");
      ref.once('value', function (snap) {
        var userJson     = (Object.keys(snap).length) ? getDriverList(snap,wards) : {};
        return res.json({'rows':userJson});
      });
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
      console.log("call add method");
      var isFormError = false;
      var errors = {};
      var driver = {};
      var wards = {};
      /* Checking validation if form post */
      if (req.method == "POST") {
        console.log(req.param('ward'));
       // return false;
       console.log("call add post method");
       errors = ValidationService.validate(req);
       if (Object.keys(errors).length) {
        console.log("call add post method error");

        /* wards listing*/
        var ref = db.ref("wards");
        ref.once("value", function (snapshot) {
          var wards = snapshot.val();
          return res.view('add-update-driver', {
            'title': sails.config.title.add_driver,
            'driver': driver,
            'wards': wards,
            'errors': errors,
            'req': req
          });
        }, function (errorObject) {
          return res.serverError(errorObject.code);
        });
      } else {
        console.log("call add post method 129 line no");
        var ref = db.ref("/drivers");
        ref.orderByChild("mobile_number").equalTo(req.param('mobile_number')).once('value')
        .then(function (snapshot) {
          console.log("call add post method 134 line no");

          requestData = snapshot.val();
          if (requestData) {
            console.log("call add post method 138 line no");

            req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('mobile_number') + sails.config.flash.mobile_number_already_exist + '</div>');
            return res.redirect(sails.config.base_url + 'driver/add');
          } else {

            console.log("call add post method 142 line no");
            
            var ward = '';
            if(req.param('ward')){
            if(req.param('ward') && typeof req.param('ward') == 'string'){
             ward = [];
             ward.push(req.param('ward')); 
           }else{
             ward = req.param('ward');
           }
         }

           var ref = db.ref("drivers");
           var data = {
            name: req.param('name'),
            mobile_number: req.param('mobile_number'),
            address: req.param('address'),
            ward: ward,
            is_deleted: false,
            created_date: Date.now(),
            modified_date: Date.now()
          }

          console.log(data);
          ref.push(data).then(function (ref) {
            console.log("driver added Successfully");
            req.flash('flashMessage', '<div class="alert alert-success">Driver Added Successfully.</div>');
            return res.redirect(sails.config.base_url + 'driver');
          }, function (error) {
            console.log("driver added un Successfully");
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
    /* wards listing*/
    var ref = db.ref("wards");
    ref.once("value", function (snapshot) {
      var wards = snapshot.val();
      return res.view('add-update-driver', {
        'title': sails.config.title.add_driver,
        'driver': driver,
        'wards': wards,
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
     * Purpose: add new driver
     * @param  req
     */
     edit: function (req, res) {
      var driver = {};
      var countries = {};
      var isFormError = false;
      var errors = {};
      if (req.method == "POST") {
        errors = ValidationService.validate(req);
        if (Object.keys(errors).length) {
          /* city listing*/
          var ref = db.ref("wards");
          ref.once("value", function (snapshot) {
            var wards = snapshot.val();
            /* driver detail */
            var ref = db.ref("drivers/" + req.params.id);
            ref.once("value", function (snapshot) {
              var driver = snapshot.val();
              /* city name */
              return res.view('add-update-driver', {
                title: sails.config.title.edit_supplier,
                'driver': driver,
                "wards": wards,
                "errors": errors
              });
            }, function (errorObject) {
              return res.serverError(errorObject.code);
            });
          }, function (errorObject) {
            return res.serverError(errorObject.code);
          });
        } else {
          var ref = db.ref();
          console.log("update data");
          console.log({'name': req.param('name'),
            'mobile_number': req.param('mobile_number'),
            'address': req.param('address'),
            'ward': req.param('ward'),
            modified_date: Date.now()

          });
          
          var ward = '';
          if(req.param('ward')){
          if(req.param('ward') && typeof req.param('ward') == 'string'){
           ward = [];
           ward.push(req.param('ward')); 
         }else{
           ward = req.param('ward');
         }
       }

         db.ref('drivers/' + req.params.id)
         .update({'name': req.param('name'),
          'mobile_number': req.param('mobile_number'),
          'address': req.param('address'),
          'ward': ward,
          modified_date: Date.now()

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
     } else {
      /* country listing*/
      var ref = db.ref("wards");
      ref.once("value", function (snapshot) {
        var wards = snapshot.val();
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
              "wards": wards,
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
   function getDriverList(snap,wards){
    if(Object.keys(snap).length){
      snap.forEach(function (childSnap) {
        driver = childSnap.val();
        updateUser = childSnap.val();
        ward_name = '';
        if(driver.ward){
          for(var i = 0; i< driver.ward.length; i ++){
            if(ward_name == '')
             ward_name =  wards[driver.ward[i]].name;
           else
             ward_name =  ward_name+', '+wards[driver.ward[i]].name;

            if(driver.ward.length-1 == i){
             updateUser.ward_name = ward_name;
         }
         }
       }
       updateUser.user_id =  childSnap.key;
       drivers.push(updateUser);
     });
     return drivers;
   }else{
    drivers ={}
    return drivers;
  }
}

