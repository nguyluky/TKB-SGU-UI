import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ApiResponse, DsNhomHocResp, NhomHoc, TkbData, TkbTiet } from '../Service';
import { globalContent } from '../store/GlobalContent';
import notifyMaster from '../components/NotifyPopup/NotificationManager';
import { NotifyMaster } from '../components/NotifyPopup';

interface eventTkb {
    type: 'addHocPhan' | 'addNhomHoc' | 'removeHocPhan' | 'removeNhomHoc' | 'switchNhomHoc' | 'replayNhomHoc';
    valueId: string;
}

/**
 *
 * hàm sẽ chuyển đổi TkbTiet Obj thành srting có định dạng
 * {thu},{tiet}|{cơ sở}
 * cách nhau bởi dấu "-"
 *
 * @param {TkbTiet[]}  tkbs
 * @returns {string}
 */
function tkbToKey(tkbs: TkbTiet[]): string {
    const temp: string[] = [];
    tkbs.forEach((e) => {
        const thu = e.thu;
        const cs = e.phong.substring(0, 1);

        for (let index = e.tbd; index <= e.tkt; index++) {
            const hash = `${thu},${index}|${cs}`;
            temp.push(hash);
        }
    });
    return temp.join('-');
}

/**
 *
 *  chả về các key bị cùng lập với newKey
 *
 * @param {string} newKey
 * @param {string[]} listKey
 */
function getKeyBiChung(newKey: string, listKey: string[]) {
    const thuTiets = newKey.split('-').map((e) => e.split('|')[0]);

    return listKey.filter((key) => {
        // TODO: nhớ phải lọc thêm lại cái lọc này
        // if (cacheTietNhom.current[key].ma_mon === maMon) return false;
        // if (cacheTietNhom.current[key].ma_mon === '862408' || cacheTietNhom.current[key].ma_mon === '862409') return false;
        let isChung = false;

        const t = key.split('-').map((j) => j.split('|')[0]);

        thuTiets.forEach((j) => {
            if (t.includes(j)) isChung = true;
        });

        return isChung;
    });
}

/**
 *
 * chả về các key bị khác Cơ sở với newKey
 *
 * @param {string} newKey
 * @param {string[]} listKey
 * @return {*}
 */
function getKeyKhacCoSo(newKey: string, listKey: string[]) {
    const tem: { [Key: string]: string } = {};
    newKey.split('-').forEach((e) => {
        console.log(e);

        const [ThT, CS] = e.split('|');
        const [Thu, t] = ThT.split(',');

        const hash = Thu + (+t <= 5 ? 's' : 'c');
        tem[hash] = CS;
    });

    console.log(tem);

    return listKey.filter((key) => {
        // if (cacheTietNhom.current[key].ma_mon === maMon) return false;
        // if (cacheTietNhom.current[key].ma_mon === '862408' || cacheTietNhom.current[key].ma_mon === '862409') return false;
        let isTrung = false;
        key.split('-').forEach((e) => {
            const [ThT, CS] = e.split('|');
            const [Thu, t] = ThT.split(',');

            const hash = Thu + (+t <= 5 ? 's' : 'c');
            console.log(tem[hash]);
            if (tem[hash] && tem[hash] !== CS) {
                isTrung = true;
            }
        });

        return isTrung;
    });
}

const useTkbHandler = (tkbId: string, isClient: boolean) => {
    const [globalState] = useContext(globalContent);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tkbData, setTkbData] = useState<TkbData>();
    const [dsNhomHoc, setDsNhomHoc] = useState<DsNhomHocResp>();
    const [conflict, setConflict] = useState<string[]>([]); // những môn bị chùng
    const cacheMhpIdToHoc = useRef<{ [Key: string]: string }>({});
    const cacheTietNhom = useRef<{ [Key: string]: NhomHoc }>({}); // key là gí trị mà hàm tkbToKey chả về
    const tkbDataRef = useRef<TkbData>();
    const undoTimeLine = useRef<eventTkb[]>([]);
    const redoTimeLine = useRef<eventTkb[]>([]);
    const [iconSaveing, setIconSaveing] = useState<'saved' | 'notsave' | 'saving'>('saved');
    const [errMsg, setErrMsg] = useState<string>('');

    const getTkbData = useCallback( async () => {
        if (!tkbId) {
            const resp: ApiResponse<TkbData> = {
                code: 500,
                msg: 'không tìm thấy Tkb',
                success: false,
            };

            return resp;
        }

        if (isClient) {
            return await globalState.client.localApi.getTkb(tkbId);
        }
        return await globalState.client.serverApi.getTkb(tkbId);
    }, [globalState.client.localApi, globalState.client.serverApi, isClient, tkbId]);

    const getDsNhomHoc = useCallback(async () => {
        return await globalState.client.serverApi.getDsNhomHoc();
    }, [globalState.client.serverApi]);

    const onAddHphandler = useCallback(
        (mhp: string, isTimeLine?: boolean, isSocket?: boolean) => {
            if (!tkbData || tkbData.ma_hoc_phans.includes(mhp)) {
                notifyMaster.info('tkb chưa tải xong');
                return;
            }

            if (tkbData.rule >= 3) {
                notifyMaster.error('bạn không có quyền sửa tkb này');
                return;
            }

            if (!isSocket) globalState.client.socket.emit('addHocPhan', tkbData.id, mhp, !!isTimeLine);

            tkbData.ma_hoc_phans.push(mhp);
            setTkbData({ ...tkbData });
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'addHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }
        },
        [globalState.client.socket, tkbData],
    );

    const onRemoveNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean, isSocket?: boolean) => {
            const nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);
            if (!tkbData || !nhom || !tkbData.id_to_hocs.includes(idToHoc)) return;

            if (!isSocket) globalState.client.socket.emit('removeNhomHoc', tkbData.id, idToHoc, !!isTimeLine);

            const index = tkbData.id_to_hocs.indexOf(idToHoc);
            tkbData.id_to_hocs.splice(index, 1);
            setTkbData({ ...tkbData });
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeNhomHoc', valueId: idToHoc });
                redoTimeLine.current = [];
            }
            delete cacheMhpIdToHoc.current[nhom.ma_mon];
            delete cacheTietNhom.current[tkbToKey(nhom.tkb)];
        },
        [dsNhomHoc?.ds_nhom_to, globalState.client.socket, tkbData],
    );

    const onRemoveHphandeler = useCallback(
        (mhp: string, isTimeLine?: boolean, isSocket?: boolean) => {
            if (!tkbData || !tkbData?.ma_hoc_phans.includes(mhp)) {
                console.log('hp không tồn tại trong ds hoặc tkb chưa tải xong');
                return;
            }

            if (!isSocket) globalState.client.socket.emit('removeHocPhan', tkbData.id || '', mhp, !!isTimeLine);

            const index = tkbData.ma_hoc_phans.indexOf(mhp);
            tkbData.ma_hoc_phans.splice(index, 1);
            if (cacheMhpIdToHoc.current[mhp]) onRemoveNhomHocHandler(cacheMhpIdToHoc.current[mhp]);
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }

            setTkbData({ ...tkbData });
        },
        [globalState.client.socket, onRemoveNhomHocHandler, tkbData],
    );

    const onAddNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean, replay?: boolean, isSocket?: boolean) => {
            // dừng hỏi tôi cũng cũng không hiểu mình đang viết gì đâu

            if (!tkbData) return;
            const nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);
            if (!nhom) {
                notifyMaster.error('không có nhóm học id: ' + idToHoc);
                return;
            }

            const maMon = nhom.ma_mon;

            let overlapKey = getKeyBiChung(tkbToKey(nhom.tkb), Object.keys(cacheTietNhom.current));
            // chừ chính môn đó và môn quốc phòng 3 , 4 là không có bị báo lỗi
            overlapKey = overlapKey.filter(
                (key) =>
                    !(
                        cacheTietNhom.current[key].ma_mon === maMon ||
                        cacheTietNhom.current[key].ma_mon === '862408' ||
                        cacheTietNhom.current[key].ma_mon === '862409'
                    ),
            );
            const ov = overlapKey.map((e) => cacheTietNhom.current[e]);

            // kiểm tra khác cơ sở

            let khacCSKey = getKeyKhacCoSo(tkbToKey(nhom.tkb), Object.keys(cacheTietNhom.current));
            khacCSKey = khacCSKey.filter(
                (key) =>
                    !(
                        cacheTietNhom.current[key].ma_mon === maMon ||
                        cacheTietNhom.current[key].ma_mon === '862408' ||
                        cacheTietNhom.current[key].ma_mon === '862409'
                    ),
            );
            const khacCS = khacCSKey.map((e) => cacheTietNhom.current[e]);

            // console.log(khacCS);

            if (replay) {
                const tietString: string[] = [];
                tietString.push(idToHoc);

                khacCS.forEach((e) => {
                    tietString.push(e.id_to_hoc);
                    onRemoveNhomHocHandler(e.id_to_hoc, true);
                });

                ov.forEach((e) => {
                    tietString.push(e.id_to_hoc);
                    onRemoveNhomHocHandler(e.id_to_hoc, true);
                });

                if (cacheMhpIdToHoc.current[maMon]) {
                    tietString.push(cacheMhpIdToHoc.current[maMon]);
                    onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
                }

                undoTimeLine.current.push({ type: 'replayNhomHoc', valueId: tietString.join('|') });
                cacheMhpIdToHoc.current[maMon] = idToHoc;
                cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
                tkbData.id_to_hocs.push(idToHoc);
                setTkbData({ ...tkbData });
                return;
            }
            if (khacCS.length && nhom.ma_mon !== '862408' && nhom.ma_mon !== '862409') {
                NotifyMaster.error(`khác cơ sở ${ov.map((e) => e.ten_mon).join(' - ')}`);
                setConflict((e) => {
                    khacCS.forEach((j) => {
                        if (!e.includes(j.id_to_hoc)) e.push(j.id_to_hoc);
                    });
                    return [...e];
                });
                setTimeout(() => {
                    console.log('ok');

                    setConflict((e) => {
                        khacCS.forEach((j) => {
                            const m = j.id_to_hoc;
                            const i = e.indexOf(m);
                            if (i >= 0) e.splice(i, 1);
                        });

                        return [...e];
                    });
                }, 500);
                return;
            }

            if (ov.length && nhom.ma_mon !== '862408' && nhom.ma_mon !== '862409') {
                console.log(ov);
                // ông xem nên để cái thông báo lỗi như thế nào cho hợi lý

                NotifyMaster.error(`Trùng tiết ${ov.map((e) => e.ten_mon).join(' - ')}`);
                setConflict((e) => {
                    ov.forEach((j) => {
                        if (!e.includes(j.id_to_hoc)) e.push(j.id_to_hoc);
                    });
                    return [...e];
                });
                setTimeout(() => {
                    console.log('ok');
                    setConflict((e) => {
                        ov.forEach((j) => {
                            const m = j.id_to_hoc;
                            const i = e.indexOf(m);
                            if (i >= 0) e.splice(i, 1);
                        });

                        return [...e];
                    });
                }, 500);
                return;
            }

            if (cacheMhpIdToHoc.current[maMon]) {
                if (!isTimeLine) {
                    undoTimeLine.current.push({
                        type: 'switchNhomHoc',
                        valueId: cacheMhpIdToHoc.current[maMon] + '|' + idToHoc,
                    });
                    redoTimeLine.current = [];
                }
                onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
            } else if (!isTimeLine) {
                redoTimeLine.current = [];
                undoTimeLine.current.push({ type: 'addNhomHoc', valueId: idToHoc });
            }

            if (!isSocket) globalState.client.socket.emit('addNhomHoc', tkbData.id, idToHoc, !!isTimeLine, !!replay);
            cacheMhpIdToHoc.current[maMon] = idToHoc;
            cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
            tkbData.id_to_hocs.push(idToHoc);
            setTkbData({ ...tkbData });
        },
        [dsNhomHoc?.ds_nhom_to, globalState.client.socket, onRemoveNhomHocHandler, tkbData],
    );

    const doUpdate = useCallback(() => {
        // console.log(tkbDateRef.current);
        console.log('dosave');

        if (!tkbDataRef.current) return;

        if (tkbDataRef.current.rule >= 3) return;

        if (tkbDataRef.current?.isClient) {
            setIconSaveing('saving');
            globalState.client.localApi.updateTkb(tkbDataRef.current).then((apiresp) => {
                setIconSaveing('saved');
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        } else if (globalState.client.islogin() && tkbId) {
            setIconSaveing('saving');
            globalState.client.serverApi.updateTkb(tkbDataRef.current).then((apiresp) => {
                setIconSaveing('saved');
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        }
    }, [globalState.client, tkbId]);

    const onRenameHandler = (s: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e.name = s;
            return { ...e };
        });
    };

    // getTkbData và dsNhomHoc
    useEffect(() => {
        if (globalState.client.islogin()) {
            globalState.client.socket.emit('join', tkbId || '');
        }

        Promise.all([getTkbData(), getDsNhomHoc()]).then(([tkbDataResp, dsNhomHocResp]) => {
            console.log('getTkbRep', tkbDataResp);
            console.log('getDsNhomHocRep', dsNhomHocResp);
            setIsLoading(false)
            if (!tkbDataResp.success || !tkbDataResp.data) {
                setErrMsg(tkbDataResp.msg || 'lỗi không thể lấy thời khóa biểu');
                return;
            }
            setTkbData(tkbDataResp.data);
            setDsNhomHoc(dsNhomHocResp);
            tkbDataResp.data?.id_to_hocs.forEach((idToHoc) => {
                const nhomHoc = dsNhomHocResp.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);

                if (!nhomHoc) return;

                cacheMhpIdToHoc.current[nhomHoc.ma_mon] = idToHoc;
                const key = tkbToKey(nhomHoc.tkb);
                cacheTietNhom.current[key] = nhomHoc;
            });
        });

        return () => {
            doUpdate();
            globalState.client.socket.emit('leave', tkbId || '');
        };

    }, [doUpdate, getDsNhomHoc, getTkbData, globalState.client, tkbId]);

    useEffect(() => {
        tkbDataRef.current = tkbData;
        setIconSaveing('notsave');
    }, [tkbData])

    return {
        tkbData,
        dsNhomHoc,
        conflict,
        iconSaveing,
        errMsg,
        undoTimeLine,
        redoTimeLine,  
        isLoading,      

        onAddHphandler,
        onRemoveHphandeler,
        onRemoveNhomHocHandler,
        onAddNhomHocHandler,
        onRenameHandler,
        doUpdate
    };
};

export default useTkbHandler;