
const ipc = require('electron').ipcRenderer;

const element = document.getElementById('element')
const display = document.getElementById('display')
const stateResult = document.getElementById('state_result')
const elementState = document.getElementById('element_state')
const search = document.getElementById('search')
const name = document.getElementById('name')
const resultInfo = document.getElementById('resultInfo')
const stateInfo = document.getElementById('stateInfo')

document.addEventListener('load', () => {
   name.innerHTML = '';
});

search.addEventListener('click', (e) => {
   e.preventDefault()
   if (element.value.length == 0) {
      resultInfo.innerHTML = 'Element name is required';
      element.style.borderColor = 'red';
      name.innerHTML = '';
   } else {
      resultInfo.innerHTML = ' ';
      element.style.borderColor = 'black';
      const value = element.value;
      name.innerHTML = value.toUpperCase();

      let query = {
         element_name: element.value.charAt(0).toUpperCase() + value.slice(1)
      };
      //console.log(query);

      const MongodbConn = require('./data/mongodb.js');
      const mongodb = new MongodbConn();

      mongodb.connectDB((err) => {
         console.log("Connected to MongoDB server");
         if (err) throw err
         const database = mongodb.getDB();
         let db = database.db('Periodic_Table');

         // Get the documents collection
         db.collection("Periodic").find(query).toArray((err, result) => {
            if (err) { resultInfo.innerHTML = 'Element not found'; };
            //console.log(result);
            display.innerHTML =
               "<ul class='list-group list-group-flush'>" +
               "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Symbol:&nbsp;&nbsp</span>" + result[0].symbol + "</li>" +
               "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Atomic Number:&nbsp;&nbsp</span>" + result[0].atomic_num + "</li>" +
               "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Atomic Mass:&nbsp;&nbsp</span>" + result[0].atomic_mass + "</li>" +
               "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Category:&nbsp;&nbsp</span>" + result[0].category + "</li>" +
               "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>State:&nbsp;&nbsp</span>" + result[0].element_state + "</li>" +
               "<li class='list-group-item'></li>" +
               "</ul>";
         });
      });
   }
});


elementState.addEventListener('change', (e) => {
   if (elementState.value.length == 0) {
      stateInfo.innerHTML = 'Field is required';
      elementState.style.borderColor = 'red';
   } else {
      stateInfo.innerHTML = ' ';
      elementState.style.borderColor = 'black';
      const choose = elementState.value;

      let query = { element_state: choose };
      console.log(query);

      const MongodbConn = require('./data/mongodb.js');
      const mongodb = new MongodbConn();

      mongodb.connectDB((err) => {
         console.log("Connected to MongoDB server");
         if (err) throw err
         const database = mongodb.getDB();
         let db = database.db('Periodic_Table');

         // Get the documents collection
         db.collection("Periodic").find(query).toArray((err, result) => {
            if (err) { stateInfo.innerHTML = 'State of element not found'; };
            console.log(result);
            //let text = ''
            result.forEach((value) => {
               console.log(value.element_name);
               stateResult.innerHTML = "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Element name:&nbsp;&nbsp</span>" + value.element_name + "</li>";
            });
            //stateResult.innerHTML = "<li class='list-group-item font-weight-bold text-info'><span class='text-dark'>Element name:&nbsp;&nbsp</span>" + result[0].element_name + "</li>";

            //stateResult.innerHTML = text;
            mongodb.dbDisconnect();
         });
      });
   }
});