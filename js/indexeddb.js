var db_obj;
(function initDB() {
   var request = indexedDB.open('mydiary', 1);
   request.onerror = function (e) {
      console.log(e.currentTarget.error.message);
   };
   request.onsuccess = function (e) {
      db_obj = e.target.result;
   };
   request.onupgradeneeded = function (e) {//版本不一致时调用onupgradeneeded
      var thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains("diary")) {
         var objStore = thisDB.createObjectStore("diary", {keyPath: "id", autoIncrement: true});
         objStore.createIndex("create_date", "create_date", {unique: false});
         objStore.createIndex("folder", "folder", {unique: false});
      }
      if (!thisDB.objectStoreNames.contains("list")) {
         var objStore = thisDB.createObjectStore("list", {keyPath: "id", autoIncrement: true});
         objStore.createIndex("create_date", "create_date", {unique: false});
      }
   };
})();

function closeDB() {
   db_obj.close();
}

function deleteDB() {
   indexedDB.deleteDatabase('mydiary');
}
function addData(table, data, cb) {
   var transaction = db_obj.transaction(table, 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore(table);
   var request = objectStore.add(data);
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : data
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
   
}
function addmData(mdata, cb) {
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   for(var c = 0;c<mdata.length;c++){
      var request = objectStore.add(mdata[c]);
      request.onerror = function (e) {
         if (cb) {
            cb({
               error: 1
            })
         }
      }
   }
}
function deleteData(id, cb) {
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var request = objectStore.delete(parseInt(id));
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : parseInt(id)
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}

function getDataById(id, cb) {
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };

   var objectStore = transaction.objectStore("diary");
   var request = objectStore.get(id);
   request.onsuccess = function (e) {
      if (cb) {
         cb({
            error: 0,
            data : e.target.result
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}

function getDataAll(table, cb) {//按创建时间排列
	indexedDB.open('mydiary', 1).onsuccess = function (e) {
   db_obj = e.target.result;
   var transaction = db_obj.transaction(table, 'readonly');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore(table);
   var rowData = [];
   objectStore.openCursor(IDBKeyRange.lowerBound(0)).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor && cb) {
         cb({
            error: 0,
            data : rowData
         });
         return;
      }
      rowData.push(cursor.value);
      cursor.continue();
   };
   };
}


function getDiaryBySearch(keywords, cb) {
	indexedDB.open('mydiary', 1).onsuccess = function (e) {
   db_obj = e.target.result;
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var boundKeyRange = IDBKeyRange.only(keywords);
   var rowData=[];
   objectStore.index("diary").openCursor(boundKeyRange).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor) {
         if (cb) {
            cb({
               error: 0,
               data : rowData
            })
         }
         return;
      }
      rowData.push(cursor.value);
      cursor.continue();
   };
   };
}
function searchString(keyword){
   var keyword = keyword;
   var transaction = db_obj.transaction("diary", "readwrite");
   var objectStore = transaction.objectStore("diary");
   var request = objectStore.openCursor();
   request.onsuccess = function(event) {
       var cursor = event.target.result;
       if (cursor) {
           if (cursor.value.title.indexOf(keyword) !== -1 ||cursor.value.content.indexOf(keyword) !== -1) {                
               console.log("We found a row with value: " + JSON.stringify(cursor.value));
           }  

           cursor.continue();          
       }
   };
}

function getDataByPager(start, end, cb) {
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var boundKeyRange = IDBKeyRange.bound(start, end, false, true);
   var rowData = [];
   objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
      var cursor = event.target.result;
      if (!cursor && cb) {
         cb({
            error: 0,
            data : rowData
         });
         return;
      }
      rowData.push(cursor.value);
      cursor.continue();
   };
}

function updateData(id, updateData, cb) {
   var transaction = db_obj.transaction("diary", 'readwrite');
   transaction.oncomplete = function () {
      console.log("transaction complete");
   };
   transaction.onerror = function (event) {
      console.dir(event)
   };
   var objectStore = transaction.objectStore("diary");
   var request = objectStore.get(id);
   request.onsuccess = function (e) {
      var thisDB = e.target.result;
      for (key in updateData) {
         thisDB[key] = updateData[key];
      }
      objectStore.put(thisDB);
      if (cb) {
         cb({
            error: 0,
            data : thisDB
         })
      }
   };
   request.onerror = function (e) {
      if (cb) {
         cb({
            error: 1
         })
      }
   }
}
