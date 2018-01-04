/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var db = sails.config.globals.firebasedb();

module.exports = {
  /*
     * Name: index
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: show listing of the device
     * @param  int  $id
     */
  index: function (req, res) {
    return res.view('device-listing', {title: sails.config.title.device_list,});
  },

  /*
   * Name: devicelist
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: show grid with data
   * @param  req
   */
  devicelist: function (req, res) {
    /* device listing*/
    devices = [];
    var ref = db.ref("devices");
    ref.once('value', function (snap) {
      var deviceJson = (Object.keys(snap).length) ? getDeviceList(snap) : {};
      return res.json({'rows': deviceJson});
    });
  },


  /*
     * Name: add
     * Created By: A-SIPL
     * Created Date: 8-dec-2017
     * Purpose: add new device
     * @param  req
     */
  add: function (req, res) {
    var device = {};
    var errors = {};
    if (req.method == "POST") {
      errors = ValidationService.validate(req);
      if (Object.keys(errors).length) {
        isFormError = true;
        return res.view('add-update-device', {title: sails.config.title.device_list,'device': device, "errors": errors, req: req});
      } else {
        var ref = db.ref("/devices");
        ref.orderByChild("device_id").equalTo(req.param('device_id'))
        ref.once("value", function (snapshot) {
            if (snapshot.val()) {
              req.flash('flashMessage', '<div class="alert alert-danger">' + req.param('device_id') + sails.config.flash.email_already_exist + '</div>');
              return res.redirect(sails.config.base_url + 'device/addDevice');
            } else {
              var ref = db.ref().child("devices");
              var data = {
                device_id: req.param('device_id'),
                is_deleted: false,
                created_date: Date.now(),
                modified_date: Date.now(),
              }
              ref.push(data).then(function () {
                req.flash('flashMessage', '<div class="alert alert-success">Device Added Successfully.</div>');
                return res.redirect(sails.config.base_url + 'device');
              }, function (error) {
                req.flash('flashMessage', '<div class="alert alert-danger">Error In Adding Device.</div>');
                return res.redirect(sails.config.base_url + 'device');
              });
            }
          })
          .catch(function (error) {
            console.log('In error', error)
          })
      }
    } else {
      return res.view('add-update-device', {title: sails.config.title.edit_device,'device': device, errors: errors});
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
    var device = {};
    var isFormError = false;
    var errors = {};
    if (req.method == "POST") {
      db.ref('devices/' + req.params.id)
        .update({
          device_id: req.param('device_id'),
          modified_date: Date.now(),
        }).then(function () {
        console.log('Success');
      }, function (error) {
        console.log('error');
      });
    }
    if (req.method == "GET") {
      /* supplier detail */
      var ref = db.ref("devices/" + req.params.id);
      ref.once("value", function (snapshot) {
        var device = snapshot.val();
        return res.view('view-edit-device', {
          title: sails.config.title.edit_device,'device': device, errors: errors, isEdit: true,
        });
      }, function (errorObject) {
        return res.serverError(errorObject.code);
      });
    }
  },

  /*
   * Name: view
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: show device detail
   * @param  req
   */
  view: function (req, res) {
    /* device detail */
    var errors = {};
    var ref = db.ref("devices/" + req.params.id);
    ref.once("value", function (snapshot) {
      var device = snapshot.val();
      return res.view('view-edit-device', {
        title: sails.config.title.view_device,'device': device, errors: errors, isEdit: false,
      });
    }, function (errorObject) {
      return res.serverError(errorObject.code);
    });
  },

  /*
 * Name: updateStatus
 * Created By: A-SIPL
 * Created Date: 26-dec-2017
 * Purpose: Update status of device
 * @param  req
 */
  updateStatus:function(req, res){
    var id = req.body.id;
    var status = req.body.is_active;
    var ref = db.ref('/users/'+ id);
    ref.once("value", function (snapshot) {
      if(snapshot.val()){
        db.ref('/devices/'+ id)
          .update({
            'is_deleted': status
          })
          .then(function () {
            userinfo = snapshot.val();
            MailerService.sendWelcomeMail({
              name: userinfo.name,
              email: userinfo.email,
              subject: (status) ? sails.config.email_message.device_activated : sails.config.email_message.device_deactivated
            });
            return true;
          })
          .catch(function (err) {
            return false;
          });
      }else{
        return false;
      }
    }, function (errorObject) {
      return false;
    });
  },
};


/*
   * Name: getDeviceList
   * Created By: A-SIPL
   * Created Date: 21-dec-2017
   * Purpose: get the device grid data
   * @param  req
   */
function getDeviceList(snap) {
  if (Object.keys(snap).length) {
    snap.forEach(function (childSnap) {
      device = childSnap.val();
      updateDevice = device;
      updateDevice.device_unique_id = childSnap.key;
      devices.push(updateDevice);
    });
    return devices;
  } else {
    devices = {}
    return devices;
  }
}
