import { TkbData } from '.';

let db: IDBDatabase;

async function createDataBase() {
    const temp = new Promise<IDBDatabase>((resolve, reject) => {
        const resp = window.indexedDB.open('tkbStorage', 1);
        resp.onerror = function (ev) {
            console.error(ev);
            reject(ev);
        };

        resp.onupgradeneeded = (ev) => {
            db = resp.result;
            db.createObjectStore('tkbStorage', { keyPath: 'id' });
        };

        resp.onsuccess = (ev) => {
            db = resp.result;
            resolve(db);
        };
    });

    return await temp;
}

export async function addRecord(data: TkbData) {
    if (!db) await createDataBase();

    const addRecordPromise = await new Promise<IDBValidKey>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readwrite');
        const objStore = tran.objectStore('tkbStorage');

        const addRep = objStore.add(data);

        addRep.onsuccess = (ev) => {
            resolve(addRep.result);
        };

        addRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return addRecordPromise;
}

export async function updateRecord(data: TkbData) {
    if (!db) await createDataBase();

    const updateRecord = await new Promise<IDBValidKey>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readwrite');
        const objStore = tran.objectStore('tkbStorage');

        const updateRep = objStore.put(data);

        updateRep.onsuccess = (ev) => {
            resolve(updateRep.result);
        };

        updateRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return updateRecord;
}

export async function deleteRecord(tkbId: string) {
    if (!db) await createDataBase();
    const deleteRecordPromise = await new Promise<undefined>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readwrite');
        const objStore = tran.objectStore('tkbStorage');

        const deleteRep = objStore.delete(tkbId);

        deleteRep.onsuccess = (ev) => {
            resolve(deleteRep.result);
        };

        deleteRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return deleteRecordPromise;
}

export async function getRecord(tkbId: string) {
    if (!db) await createDataBase();

    const getRecord = await new Promise<TkbData>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readonly');
        const objStore = tran.objectStore('tkbStorage');

        const getRep = objStore.get(tkbId);

        getRep.onsuccess = (ev) => {
            resolve(getRep.result as TkbData);
        };

        getRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return getRecord;
}

export async function getAllRecord() {
    if (!db) await createDataBase();
    const getALlRecord = await new Promise<TkbData[]>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readonly');
        const objStore = tran.objectStore('tkbStorage');

        const getAllRep = objStore.getAll();

        getAllRep.onsuccess = (ev) => {
            resolve(getAllRep.result as TkbData[]);
        };

        getAllRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return getALlRecord;
}
