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
  }, 8000);

  setTimeout(function () {
    $('.flash-message').remove();
  }, 8000);

  //Grid  Defaul Width Set
  $.jgrid.defaults.width = $(window).width() - 135;

  /* On submit form Disable submit button */
  $(".form-submit").on('submit', function (e) {
    if ($(this).parsley().isValid()) {
      $(':submit').prop("disabled", "disabled");
    }
  });


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
    en: 'Bin image should not be larger than 4 Mb',
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
}


/* Make activate/deactivate a record */
$("body").on("click", ".status-action", function () {
  $(".alert-danger").css("display", "none");
  $(".alert-success").css("display", "none");
  helper.showLoader();
  var id = $(this).attr('data-id');
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
        jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').jqGrid('clearGridData');
        jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').jqGrid('setGridParam', {datatype: 'json'});
        jQuery('#bin-grid, #bin-grid-searchpage, #vehicle-grid, #driver-grid').trigger('reloadGrid');
        helper.hideLoader();
        $(".alert-success").css("display", "block");
        $(".alert-success").html(result.message);
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
  var driver_id = '';
  $("#driver-grid").jqGrid({
    url: BASE_URL + '/driver/driverlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 220, search: true},
      {label: 'Area', name: 'area_name', width: 220, search: true},
      {label: 'Contact Number', name: 'mobile_number', width: 150},
      {label: 'Address', name: 'address', width: 300},
      {
        name: 'user_id', hidden: true,
        formatter: function (cellvalue) {
          driver_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 90, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/driver/updateStatus" class="button status-action active" data-id="' + driver_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/driver/updateStatus" class="button status-action active" data-id="' + driver_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'user_id', search: false, width: 100, align: "center",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Vehicle Detail" href="' + BASE_URL + '/driver/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Vehicle Detail" href="' + BASE_URL + '/driver/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
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
        label: 'Filling Status', name: 'filling_status', width: 140, search: true,formatter: "number",sorttype: "number",
        formatter: function (cellvalue) {
          status = cellvalue;
          var level = '';
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
          action += '<span><a title="View Bin Detail" href="' + BASE_URL + '/bin/view/' + cellvalue + '?search=true' +'" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Bin Detail" href="' + BASE_URL + '/bin/edit/' + cellvalue + '?search=true' + '" ><i class="fa fa-edit"></i></a></span>';
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
  var vehicle_id = '';
  $("#vehicle-grid").jqGrid({
    url: BASE_URL + '/vehicle/vehiclelist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 200, search: true, classes: 'text-break'},
      {label: 'Number', name: 'number', width: 180, search: true},
      {
        name: 'vehicle_key', hidden: true,
        formatter: function (cellvalue) {
          vehicle_id = cellvalue;
        }
      },
      {label: 'Assign To', name: 'assign_to_name', width: 200, search: true, classes: 'text-break'},
      {label: 'Type', name: 'type_name', width: 200, search: true},
      {
        label: 'Status', name: 'is_deleted', width: 90, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/vehicle/updateStatus" class="button status-action active" data-id="' + vehicle_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/vehicle/updateStatus" class="button status-action active" data-id="' + vehicle_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'vehicle_key', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Vehicle Detail" href="' + BASE_URL + '/vehicle/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Vehicle Detail" href="' + BASE_URL + '/vehicle/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#vehicle-grid-pager",
  });
  jQuery("#vehicle-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /*Disable auto complete of on the input filed of the grid */
  $(".ui-widget-content").attr("autocomplete", "off");
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
  zoom: 12,
  center: latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

function filterbins() {
  var select_ward = $('#select_ward').val();
  var select_driver = $('#select_driver').val();
  var thisvalue = $("select#select_ward option:selected").text();

  $('#gs_ward_name').val(thisvalue);
  $('#gs_ward_name').keyup();
  $.ajax({
    url: '/bin/filterbins',
    type: "post",
    dataType: "json",
    beforeSend: function () {
    },
    data: {selected_ward: select_ward, select_driver: select_driver},
    cache: true,
    error: function () {
    },
    success: function (e) {
      $.each(e.bins, function (i, option) {
        if (option.latitude != null && option.latitude != "") {
          if(option.alert_level != undefined && option.alert_level != '' && option.latest_dust_level != undefined && option.latest_dust_level != undefined){
            option.latest_dust_level = parseInt((((parseInt(option.alert_level) - parseInt(option.latest_dust_level)))* 100) / parseInt(option.alert_level));
          }else{
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
