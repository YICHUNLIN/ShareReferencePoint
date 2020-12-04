var map;
var markers = {};
var gis = null;
var lplace = null;
var placeMarker = null;
var placeLocation = null;
var isPlace = false;

/**
 * ------kmGIS start
 */
function kmGIS() {
}

kmGIS.prototype.nearby = function(x, y, scope) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis/twd97_nearby?x=${x}&y=${y}&scope=${scope}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}

kmGIS.prototype.getAll = function() {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis/all`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}

kmGIS.prototype.twd97Towgs84 = function(x, y) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis/twd97towgs84?x=${x}&y=${y}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}

kmGIS.prototype.wgs84totwd97 = function(lat, lng) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis/wgs84totwd97?lat=${lat}&lng=${lng}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}

kmGIS.prototype.getByName = function(name) {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: `https://kpp.kmn.tw/kmgis?name=${name}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            statusCode: {
                200: function (data) {
                    resolve(data);
                },
                404: function(data) {
                    reject(data);
                }
            }
        });
    })
}

/**
 * ------kmGIS end
 */

 /**
  * ------ Place start
  */
 function Place(map, target) {
     this.status = false;
     this.marker = null;
     this.location = null;
     this.map = map;
     this.place_object = target;
 }

 Place.prototype.start = function() {
     var t_this = this;
     this.status = true;
     this.place_object.text("正在放")
     this.map.on('click', function(e){
        t_this.onMapClick(e, t_this)
     });
 }

 Place.prototype.end = function() {
     this.status = false;
     this.place_object.text("放")
     this.map.off('click');
 }

 Place.prototype.switch = function() {
     if (!this.status) {
         this.start();
     } else {
         this.end();
     }
 }


 Place.prototype.onMapClick = function(e, target) {
    const blackIcon = new L.Icon({
            iconUrl:
              "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
    var marker = L.marker([e.latlng.lat, e.latlng.lng], {title: "點在這", icon:blackIcon});
    marker.bindPopup(`${e.latlng.lat},${e.latlng.lng}`);
    marker.addTo(target.map);
    target.location = e.latlng;
    if (target.marker != null) {
        target.map.removeLayer(target.marker);
    }
    target.marker = marker;
}

Place.prototype.clear = function() {
    this.map.removeLayer(this.marker);
    this.marker = null;
    this.end();
}
 /**
  * ------ Place end
  */
function keyup(e) {
    var name = $('.name').val();
    gis.getByName(name)
        .then(function(data){
            if (!markers.hasOwnProperty(name)) { 
                var marker = L.marker([data.data.wgs84.lat, data.data.wgs84.lng], {title: data.data.name});
                marker.addTo(map);
                markers[name] = marker;
                marker.bindPopup(`<b>編號:${data.data.name}</b><br>高程:${data.data.ele}<br>wgs84: ${data.data.wgs84.lat},${data.data.wgs84.lng}<br>twd97:${data.data.twd97.x},${data.data.twd97.y}`).openPopup();
            }
           $('.name').val("")
        })
        .catch(function(err){
        })
}
function all() {
    gis.getAll()
        .then(function(data){
            data.data.forEach(function(point){
                if (!markers.hasOwnProperty(point.name)) {
                    var marker = L.marker([point.wgs84.lat, point.wgs84.lng]);
                    marker.addTo(map);
                    markers[point.name] = marker;
                    marker.bindPopup(`<b>編號:${point.name}</b><br>高程:${point.ele}<br>wgs84: ${point.wgs84.lat},${point.wgs84.lng}<br>twd97:${point.twd97.x},${point.twd97.y}`);
                }
            })
        })
        .catch(function(err){
        })
}

function ra() {
    Object.values(markers).forEach(m => {
        map.removeLayer(m);
    });
    lplace.clear();
}

function place() {
    lplace.switch();
}

function getNearBy() {
    const scope = $(".distance").val(); 
    gis.wgs84totwd97(lplace.location.lat, lplace.location.lng)
        .then(function(d1){
            console.log(d1);
            gis.nearby(d1.x, d1.y, scope)
                .then(function(data){
                    console.log(data);
                    data.data.forEach(function(point){
                        if (!markers.hasOwnProperty(point.name)) {
                            var marker = L.marker([point.wgs84.lat, point.wgs84.lng]);
                            marker.addTo(map);
                            markers[point.name] = marker;
                            marker.bindPopup(`<b>編號:${point.name}</b><br>高程:${point.ele}<br>wgs84: ${point.wgs84.lat},${point.wgs84.lng}<br>twd97:${point.twd97.x},${point.twd97.y}`);
                        }})
                })
                .catch(function(err){
                    console.log(err);
                })
        }).catch(function(error){

        })
}

function setEvent() {
    $(".confirm").on('click', keyup);
    $(".reset").on('click', ra)
    $(".all").on('click', all)
    $(".place").on('click', place);
    $(".nearby").on('click', getNearBy);
}


$('document').ready(function(){
    map = L.map('map').setView([24.446781, 118.376470], 12)
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16});
    map.addLayer(osm);

    gis = new kmGIS()
    lplace = new Place(map, $(".place"));
    setEvent()
})


