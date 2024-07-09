var db;

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

export {};