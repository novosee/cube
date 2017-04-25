
var container = document.getElementById('visualization');

var dataset = new vis.DataSet();
var options = {
  start: vis.moment().add(-3, 'hours'), // changed so its faster
  end: vis.moment(),
};
var graph2d = new vis.Graph2d(container, dataset, options);


firebasesetup();



var database;

function firebasesetup() {

  // Start Firebase
  var config = {
    apiKey: "AIzaSyA-VyZJOZVqXZj82wvVMkfJedDEhqXcIh8",
    authDomain: "novosee-a7bad.firebaseio.com",
    databaseURL: "https://novosee-a7bad.firebaseio.com",
    storageBucket: "novosee-a7bad.appspot.com",
    messagingSenderId: "363965061200"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  loadAll();
}



function loadAll() {
  var ref = database.ref("vivid");
  //ref.orderByChild("time").startAt(1492863129709).endAt(1492864106661).on("child_added", gotAll, errData);
  ref.orderByChild("time").limitToLast(50).on("child_added", gotAll, errData);
  // The data comes back as an object
  function gotAll(gdata) {
    var sd = {};
    sd.x = new Date(gdata.val().time).toString();
    sd.y = gdata.val().count;
    dataset.add(sd);
    //console.log(data);





  }

  function errData(error) {
    console.log("Something went wrong.");
    console.log(error);
  }
}

