/**
 * StateController
 *
 * @description :: Server-side logic for managing cities
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var db = sails.config.globals.firebasedb();
module.exports = {
  /**
   * CommentController.create()
   */
  index: function (req, res) {
    return res.view('city-listing', {title: sails.config.title.city_list});
  }, 

  /*
  * Name: getStateByCountry
  * Created By: A-SIPL
  * Created Date: 18-dec-2017
  * Purpose: aget city of the selected country
  * @param  type
  */
  getStateByCountry: function (req, res) {
    if(req.body.id) {
        const ref = db.ref('states');
        ref.orderByChild('country_id')
          .equalTo(req.body.id)
          .once("value",function (snapshot) {
            return res.json(snapshot.val());
          });
    }else{
      return res.json({});
    }
  },
 
};



/*
   * Name: getUserList
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: sget the user grid dat
   * @param  req
   */
function getCityList(snap, countries){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      city = childSnap.val();
      updateCity = city;
      country_id = city.country_id;
      //console.log("id is-->", country_id);
      //console.log("Country id is-->", countries[country_id]['name']);
      updateCity.city_id =  childSnap.key;
      updateCity.country_name =  countries[country_id]['name'];
      cities.push(updateCity);
    });
    return cities;
  }else{
    cities ={}
    return cities;
  }
}



/*
   * Name: getSubCityList
   * Created By: A-SIPL
   * Created Date: 22-dec-2017
   * Purpose: sget the user grid data
   * @param  req
   */
function getSubCityList(snap, cities){
  if(Object.keys(snap).length){
    snap.forEach(function (childSnap) {
      subCity = childSnap.val();
      updateSubCity = subCity;
      city_id = subCity.city_id;
      updateSubCity.city_id =  childSnap.key;
      updateSubCity.city_name =  cities['name'];
      subCities.push(updateSubCity);
    });
    return subCities;
  }else{
    subCities ={}
    return subCities;
  }
}

