/*
 * Main set common settings of the application
 */
/* All message will be declared here */
var CONST = {
  MSGTIMEOUT: 4000,
}

$(document).ready(function () {
  /* Hide server side header messages */
  setTimeout(function () {
    $('div').removeClass('has-error');
    $('.form-group').find('.help-block').hide();
  }, 6000);

})


/*
     * Name: timeSince
     * Created By: MP-SIPL
     * Created Date: 17-Jan-2018
     * Purpose: get user friednly time
     * @param  req
     */
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

/* On change country get city list */
function getCity(stateId) {
  if (stateId !== "" || stateId !== undefined) {
    $.ajax({
      url: BASE_URL + '/city/getCityByState',
      data: {id: stateId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#city').empty();
        $('#city').html('<option value="">Select City</option>');
        $('#area').empty();
        $('#area').html('<option value="">Select Area</option>');
        $.each(result, function (i, obj) {
          $('#city').append('<option value="' + obj.key + '">' + obj.name + '</option>');
        });
        $('#state_name').val($("#state option:selected").text());
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}


/* On change City get city list */
function getArea(cityId) {
  if (cityId !== "" || cityId !== undefined) {
    $.ajax({
      url: BASE_URL + '/city/getAreaByCity',
      data: {id: cityId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#area').empty();
        $('#area').html('<option value="">Select Area</option>');
        $.each(result, function (i, obj) {
          $('#area').append('<option value="' + i + '">' + obj.name + '</option>');
        });
        $('#city_name').val($("#city option:selected").text());
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}


/* On change circle get ward list */
function getWardByCircle(circleId) {
  if (circleId !== "" || circleId !== undefined) {
    $.ajax({
      url: BASE_URL + '/ward/getWardByCircle',
      data: {id: circleId},
      type: 'POST',
      success: function (result) {
        console.log('Response getWardByCircle', result);
        $('#ward').html('<option value="">Select Ward</option>');
        $.each(result, function (i, obj) {
          $('#ward').append('<option value="' + obj.key + '">' + obj.name + '</option>');
        });
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}

/* On change ward get area list */
function getAreaByWard(wardId) {
  if (wardId !== "" || wardId !== undefined) {
    $.ajax({
      url: BASE_URL + '/area/getAreaByWard',
      data: {id: wardId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#area').html('<option value="">Select Area</option>');
        $.each(result, function (i, obj) {
          $('#area').append('<option value="' + obj.key + '">' + obj.name + '</option>');
        });
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}


/* On change city get circle list */
function getCircle(cityId) {
  if (cityId !== "" || cityId !== undefined) {
    $.ajax({
      url: BASE_URL + '/circle/getCircleByCity',
      data: {id: cityId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#circle').html('<option value="">Select Circle</option>');
        $.each(result, function (i, obj) {
          $('#circle').append('<option value="' + obj.key + '">' + obj.name + '</option>');
        });
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}

/* On change country get states list */
function getState(coutryId) {
  if (coutryId !== "" || coutryId !== undefined) {
    $.ajax({
      url: BASE_URL + '/state/getStateByCountry',
      data: {id: coutryId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#state').empty();
        $('#state').html('<option value="">Select State</option>');
        $('#city').empty();
        $('#city').html('<option value="">Select City</option>');
        $('#area').empty();
        $('#area').html('<option value="">Select Area</option>');
        $.each(result, function (i, obj) {
          $('#state').append('<option value="' + obj.key + '">' + obj.name + '</option>');
        });
        $('#country_name').val($("#country option:selected").text());
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}


/* On change country get city list */
function getSubCity(cityId) {
  if (cityId !== "" || cityId !== undefined) {
    $('#city_name').val($("#city option:selected").text());
  }
}

/* On change country get city list */
function getArea(areaid) {
  if (areaid !== "" || areaid !== undefined) {
    $('#area_name').val($("#area option:selected").text());
  }
}



var autocomplete;

/* For google address API */
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('address')),
    {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
}

/* Fill lat and long i*/
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  console.log("place", place.geometry.location.lat(), place.geometry.location.lng());
  $("#latitude").val(place.geometry.location.lat());
  $("#longitude").val(place.geometry.location.lng());
}

/* Bias the autocomplete object to the user's geographical location,
as supplied by the browser's 'navigator.geolocation' object. */
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

/* parsley file upload velidation */
window.Parsley.addValidator('maxFileSize', {
  validateString: function (_value, maxSize, parsleyInstance) {
    if (!window.FormData) {
      alert('You are making all developpers in the world cringe. Upgrade your browser!');
      return true;
    }
    var files = parsleyInstance.$element[0].files;
    return files.length != 1 || files[0].size <= maxSize * 1024;
  },
  requirementType: 'integer',
  messages: {
    en: 'Company logo should not be larger than 4 Mb',
  }
});


/* Declare all helper functions here */
var helper = {
  /*
   * @method: checkResponse
   * @desc: CHeck error messages in response
   */
  checkResponse: function (response) {
    if (response.status == false && typeof response.errors != 'undefined' && response.errors.length > 0) {
      var message = '';
      response.errors.forEach(function (val) {
        message += val + '\n';
      })
      $.notify(message, "error");
    }
    return response;
  },
  /*
   * @method: showLoader
   * @desc: Show loader
   */
  showLoader: function () {
    $(".splash").show();
  },
  /*
   * @method: hideLoader
   * @desc: hide loader
   */
  hideLoader: function () {
    $(".splash").hide();
  },
  /*
   * @method: deleteConfirmation
   * @desc: Delete confirmation dialog
   * @param fn: function execute after the cofirm
   */
  deleteConfirmation: function (fn) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No, cancel please!",
        closeOnCancel: true
      },
      function (isConfirm) {
        if (isConfirm) {
          fn();
        }
      });
  }
}


/* Make activate/deactivate a record */
$("body").on("click", ".status-action", function () {
  $(".alert-danger").css("display", "none");
  $(".alert-success").css("display", "none");
  helper.showLoader();
  var id = $(this).attr('data-id');
  var isSupplier = $(this).attr('data-supplier');
  if ($(this).attr('data-status') == 'true') {
    var status = false;
  } else if ($(this).attr('data-status') == 'false') {
    var status = true;
  }
  var url = $(this).attr('data-url');
  if (id != '' && url != '') {
    var formData = {
      id: id,
      is_active: status
    };
    $.ajax({
      type: "POST",
      url: url,
      data: formData,
      success: function (result) {
        if (isSupplier == 'true') {
          location.reload();
        } else {
          jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').jqGrid('clearGridData');
          jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').jqGrid('setGridParam', {datatype: 'json'});
          jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').trigger('reloadGrid');
          helper.hideLoader();
          $(".alert-success").css("display", "block");
          $(".alert-success").html(result.message);
        }
      },
      error: function (textStatus, errorThrown) {
        helper.hideLoader();
        $(".alert-danger").css("display", "block");
        $(".alert-danger").html(textStatus);
      }
    });
    setTimeout(function () {
      $('div.alert').css('display', "none");
    }, 6000);
  }
})

/* Show grid */
$(document).ready(function () {
  /* Driver listing grid */
  $("#driver-grid").jqGrid({
    url: BASE_URL + '/driver/driverlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 250, search: true},
      {label: 'Area', name: 'area_name', width: 320, search: true},
      {label: 'Contact Number', name: 'mobile_number', width: 250},
      {label: 'Address', name: 'address', width: 300},
      {
        label: 'Status', name: 'is_deleted', width: 200, search: false,
        formatter: function (cellvalue) {
          status = cellvalue;
          console.log(cellvalue);
          return (cellvalue == false || cellvalue == 'false') ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'user_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '';
          action += '<a title="Edit Driver Detail" href="' + BASE_URL + '/driver/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status) {
            action += '<a data-tooltip="" title="Active" data-status="true" data-url="' + BASE_URL + '/driver/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="In Active" data-status="false" data-url="' + BASE_URL + '/driver/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    ////width: null,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#driver-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#driver-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});


  /* Bin listing grid */
  var bin_id = '';
  $("#bin-grid").jqGrid({
    url: BASE_URL + '/bin/binlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Bin ID', name: 'id', width: 180, search: true},
      {label: 'Name', name: 'name', width: 220, search: true, classes: 'text-break'},
      {label: 'Ward', name: 'ward_name', width: 80, search: true},
      {label: 'Area', name: 'area_name', width: 220, search: true, classes: 'text-break'},
      {label: 'Location', name: 'location', width: 220, search: true, classes: 'text-break'},
      {
        name: 'bin_key', hidden: true,
        formatter: function (cellvalue) {
          bin_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 70, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/bin/updateStatus" class="button status-action active" data-id="' + bin_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/bin/updateStatus" class="button status-action active" data-id="' + bin_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'bin_key', search: false, width: 80, align: "center",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Bin Detail" href="' + BASE_URL + '/bin/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Bin Detail" href="' + BASE_URL + '/bin/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    //width: 1110,
    height: 480,
    rowNum: 10,
    rowList: [10, 20, 50],
    loadonce: true,
    gridview: true,
    pager: "#bin-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#bin-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /* Bin listing grid */
  $("#bin-grid-searchpage").jqGrid({
    url: BASE_URL + '/bin/binlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 220, search: true, classes: 'text-break'},
      {label: 'Ward', name: 'ward_name', width: 80, search: true },
      {
        label: 'Filling Status', name: 'latest_dust_level', width: 140, search: true,
        formatter: function (cellvalue) {
          status = cellvalue;
          var level = '';
          if (cellvalue) {

          } else {
            cellvalue = '';
          }
          if (cellvalue < 40) {
            level = '<span>' + cellvalue + '</span>';
          } else if (cellvalue >= 40 && cellvalue < 70) {
            level = '<span style="color:orange">' + cellvalue + '</span>';
          } else {
            level = '<span style="color:red">' + cellvalue + '</span>';
          }
          return level;
        }
      },
      {
        name: 'bin_key', hidden: true,
        formatter: function (cellvalue) {
          bin_id = cellvalue;
        }
      },
      {
        label: 'Updated Time', name: 'modified_date', width: 140, search: false,
        formatter: function (cellvalue) {
          return timeSince(cellvalue);

        }
      },
      {label: 'Area', name: 'area_name', width: 220, search: true, classes: 'text-break'},
      {label: 'Location', name: 'location', width: 220, search: true, classes: 'text-break'},
      {
        label: 'Status', name: 'is_deleted', width: 70, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/bin/updateStatus" class="button status-action active" data-id="' + bin_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/bin/updateStatus" class="button status-action active" data-id="' + bin_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'bin_key', search: false, width: 80, align: "center",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Bin Detail" href="' + BASE_URL + '/bin/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Bin Detail" href="' + BASE_URL + '/bin/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
//width: null,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#bin-grid-pager-searchpage",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#bin-grid-searchpage").jqGrid('filterToolbar', {
    searchOperators: true,
    stringResult: true,
    searchOnEnter: false
  });


  /* Vehicle listing grid */
  $("#vehicle-grid").jqGrid({
    url: BASE_URL + '/vehicle/vehiclelist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 200, search: true},
      {label: 'Number', name: 'number', width: 200, search: true},

      {label: 'Assign To', name: 'assign_to_name', width: 200, search: true},
      {label: 'Type', name: 'type_name', width: 200, search: true},
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false,
        formatter: function (cellvalue) {
          console.log(cellvalue);
          status = cellvalue;
          return (cellvalue == false) ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'vehicle_key', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '';
          action += '<a title="Edit Bin Detail" href="' + BASE_URL + '/vehicle/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status) {
            action += '<a data-tooltip="" title="Active" data-status="true" data-url="' + BASE_URL + '/vehicle/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="In Active" data-status="false" data-url="' + BASE_URL + '/vehicle/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    //width: null,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#vehicle-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#vehicle-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});
});

/* Search bin js */
var addresses = '';
var message = '';
var delay = 100;
var nextAddress = 0;
var infowindow = new google.maps.InfoWindow();
var geo = new google.maps.Geocoder();
var bounds = new google.maps.LatLngBounds();
var markers = [];
var latlng = new google.maps.LatLng(21.823524, 75.514989);
var mapOptions = {
  zoom: 9,
  center: latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

function filterbins() {
  console.log("filter bin");
  var select_ward = $('#select_ward').val();
  console.log("select_ward===", select_ward);
  var thisvalue = $("select#select_ward option:selected").text();

  $('#gs_ward_name').val(thisvalue);
  $('#gs_ward_name').keyup();
  $.ajax({
    url: '/bin/filterbins',
    type: "post",
    dataType: "json",
    beforeSend: function () {
    },
    data: {selected_ward: select_ward},
    cache: true,
    error: function () {
    },
    success: function (e) {
      $.each(e.bins, function (i, option) {
        if (option.latitude != null && option.latitude != "") {

          if (!option.latest_dust_level) {
            option.latest_dust_level = 0;
          }
          var search = option.location + ' (Dust Status: ' + option.latest_dust_level + ')';
          createmarkers(search, option.latitude, option.longitude, option.latest_dust_level, option.alert_level);
        } else {
        }
      });
    },
    complete: function (jqXHR, textStatus) {

    }
  });
}

// Removes the markers from the map, but keeps them in the array.
function resetbins() {
  console.log("call resetbins");
  setMapOnAll(null);
  filterbins();
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function createmarkers(add, lat, lng, latest_dust_level, alert_level) {
  if (latest_dust_level > alert_level) {
    var pinColor = "FE7569";
  } else {
    var pinColor = "34BA46";
  }
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34));

  var contentString = add;

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lng),
    map: map,
    icon: pinImage,
  });
  map.setCenter(new google.maps.LatLng(lat, lng));
  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });

  google.maps.event.addListener(marker, 'mouseover', function () {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });

  bounds.extend(marker.position);
}

filterbins();
