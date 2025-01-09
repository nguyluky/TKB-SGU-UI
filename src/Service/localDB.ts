let db: IDBDatabase;

export interface TkbInfoIndexDb {
    id: string;
    name: string;
    nam: string;
    tkb_describe: string;
    thumbnails: string;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    rule: number;
    isClient?: boolean;
    created: Date; //"2024-06-17T12:22:36.000Z"
}

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

export async function addRecord(data: TkbInfoIndexDb) {
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

export async function updateRecord(data: TkbInfoIndexDb) {
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

    const getRecord = await new Promise<TkbInfoIndexDb>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readonly');
        const objStore = tran.objectStore('tkbStorage');

        const getRep = objStore.get(tkbId);

        getRep.onsuccess = (ev) => {
            resolve(getRep.result as TkbInfoIndexDb);
        };

        getRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return getRecord;
}

export async function getAllRecord() {
    if (!db) await createDataBase();
    const getALlRecord = await new Promise<TkbInfoIndexDb[]>(function (resolve, reject) {
        const tran = db.transaction(['tkbStorage'], 'readonly');
        const objStore = tran.objectStore('tkbStorage');

        const getAllRep = objStore.getAll();

        getAllRep.onsuccess = (ev) => {
            resolve(getAllRep.result as TkbInfoIndexDb[]);
        };

        getAllRep.onerror = (ev) => {
            reject(ev);
        };
    });

    return getALlRecord;
}
