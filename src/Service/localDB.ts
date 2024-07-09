import { TkbData } from ".";

var db: IDBDatabase;

const resp = window.indexedDB.open('tkbStorage', 1);
resp.onerror = function(ev) {
    console.error(ev)
    alert('lỗi khi mở kết nối với database indexedDB: ');
}

resp.onupgradeneeded = (ev) => {
    db = resp.result;
    db.createObjectStore('tkbStorage', {keyPath: 'id'});
}

resp.onsuccess = (ev) => {
    db = resp.result;
}

export function addRecord(data : TkbData) {
    return new Promise<IDBValidKey>(function (resolve, reject) {
        if (!db) return;
        var tran = db.transaction(['tkbStorage'], 'readwrite');
        var objStore = tran.objectStore('tkbStorage');
        
        var addRep = objStore.add(data);
        

        addRep.onsuccess = (ev) => {
            resolve(addRep.result);
        }

        addRep.onerror = (ev) => {
            reject(ev)
        }

    })
    
}

export function updateRecord(data: TkbData) {
    return new Promise<IDBValidKey>(function (resolve, reject) {
        if (!db) return;
        var tran = db.transaction(['tkbStorage'], 'readwrite');
        var objStore = tran.objectStore('tkbStorage');
        
        var updateRep = objStore.put(data);
        

        updateRep.onsuccess = (ev) => {
            resolve(updateRep.result);
        }

        updateRep.onerror = (ev) => {
            reject(ev)
        }
    })
}


export function deleteRecord(tkbId: string) {
    return new Promise<undefined>(function (resolve, reject) {
        if (!db) return;
        var tran = db.transaction(['tkbStorage'], 'readwrite');
        var objStore = tran.objectStore('tkbStorage');
        
        var deleteRep = objStore.delete(tkbId);
        

        deleteRep.onsuccess = (ev) => {
            resolve(deleteRep.result);
        }

        deleteRep.onerror = (ev) => {
            reject(ev)
        }
    })
}

export function getRecord(tkbId: string) {
    return new Promise<TkbData>(function (resolve, reject) {
        if (!db) return;
        var tran = db.transaction(['tkbStorage'], 'readonly');
        var objStore = tran.objectStore('tkbStorage');
        
        var getRep = objStore.get(tkbId);
        
        getRep.onsuccess = (ev) => {
            resolve(getRep.result as TkbData);
        }

        getRep.onerror = (ev) => {
            reject(ev)
        }
    })
}


export function getAllRecord() {
    return new Promise<TkbData[]>(function (resolve, reject) {
        if (!db) return;
        var tran = db.transaction(['tkbStorage'], 'readonly');
        var objStore = tran.objectStore('tkbStorage');
        
        var getAllRep = objStore.getAll();
        
        getAllRep.onsuccess = (ev) => {
            resolve(getAllRep.result as TkbData[]);
        }

        getAllRep.onerror = (ev) => {
            reject(ev)
        }
    })
}

