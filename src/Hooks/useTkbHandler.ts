import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    ApiResponse,
    DsNhomHocResp,
    NhomHoc,
    TkbContent,
    TkbContentMmh,
    TkbInfo,
    TkbTiet,
} from '../Service';
import { globalContent } from '../store/GlobalContent';
import notifyMaster from '../components/NotifyPopup/NotificationManager';
import { NotifyMaster } from '../components/NotifyPopup';

interface eventTkb {
    type:
        | 'addHocPhan'
        | 'addNhomHoc'
        | 'removeHocPhan'
        | 'removeNhomHoc'
        | 'switchNhomHoc'
        | 'replayNhomHoc';
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

    // console.log(tem);

    return listKey.filter((key) => {
        // if (cacheTietNhom.current[key].ma_mon === maMon) return false;
        // if (cacheTietNhom.current[key].ma_mon === '862408' || cacheTietNhom.current[key].ma_mon === '862409') return false;
        let isTrung = false;
        key.split('-').forEach((e) => {
            const [ThT, CS] = e.split('|');
            const [Thu, t] = ThT.split(',');

            const hash = Thu + (+t <= 5 ? 's' : 'c');
            // console.log(tem[hash]);
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
    const [tkbInfo, setTkbInfo] = useState<TkbInfo>();
    const [id_to_hocs, setIdToHocs] = useState<string[]>([]);
    const [ma_hoc_phans, setMaMomHoc] = useState<string[]>([]);
    const [dsNhomHoc, setDsNhomHoc] = useState<DsNhomHocResp>();
    const [conflict, setConflict] = useState<string[]>([]); // những môn bị chùng
    const cacheMhpIdToHoc = useRef<{ [Key: string]: string }>({});
    const cacheTietNhom = useRef<{ [Key: string]: NhomHoc }>({}); // key là gí trị mà hàm tkbToKey chả về
    const tkbDataRef = useRef<TkbInfo>();
    const TkbContent = useRef<[string[], string[]]>([[], []]);
    const undoTimeLine = useRef<eventTkb[]>([]);
    const redoTimeLine = useRef<eventTkb[]>([]);
    const [iconSaveing, setIconSaveing] = useState<'saved' | 'notsave' | 'saving'>('saved');
    const [errMsg, setErrMsg] = useState<string>('');

    const getTkbData = useCallback(async () => {
        if (!tkbId) {
            const resp: ApiResponse<TkbInfo> = {
                code: 500,
                msg: 'không tìm thấy Tkb',
                success: false,
            };

            return resp;
        }

        console.log(isClient);
        if (isClient) {
            return await globalState.client.localApi.getTkb(tkbId);
        }
        return await globalState.client.serverApi.getTkb(tkbId);
    }, [globalState.client.localApi, globalState.client.serverApi, isClient, tkbId]);

    const getTkbContent = useCallback(async () => {
        if (!tkbId) {
            const resp: ApiResponse<TkbContent> = {
                code: 500,
                msg: 'không tìm thấy Tkb',
                success: false,
            };

            return resp;
        }

        if (isClient) {
            return await globalState.client.localApi.getTkbContent(tkbId);
        }
        return await globalState.client.serverApi.getTkbContent(tkbId);
    }, [globalState.client.localApi, globalState.client.serverApi, isClient, tkbId]);

    const getTkbContentMmh = useCallback(async () => {
        if (!tkbId) {
            const resp: ApiResponse<TkbContentMmh> = {
                code: 500,
                msg: 'không tìm thấy Tkb',
                success: false,
            };

            return resp;
        }

        if (isClient) {
            return await globalState.client.localApi.getTkbContentMmh(tkbId);
        }
        return await globalState.client.serverApi.getTkbContentMmh(tkbId);
    }, [globalState.client.localApi, globalState.client.serverApi, isClient, tkbId]);

    const getDsNhomHoc = useCallback(async () => {
        return await globalState.client.serverApi.getDsNhomHoc();
    }, [globalState.client.serverApi]);

    const onAddHphandler = useCallback(
        (mhp: string, isTimeLine?: boolean, isSocket?: boolean) => {
            if (!tkbInfo || ma_hoc_phans.includes(mhp)) {
                notifyMaster.info('tkb chưa tải xong');
                return;
            }

            // ? api chưa có cái này
            // if (tkbInfo.rule >= 3) {
            //     notifyMaster.error('bạn không có quyền sửa tkb này');
            //     return;
            // }

            if (!isSocket)
                globalState.client.socket.emit('addHocPhan', tkbInfo.id, mhp, !!isTimeLine);

            ma_hoc_phans.push(mhp);
            setMaMomHoc([...ma_hoc_phans]);
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'addHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }
        },
        [globalState.client.socket, ma_hoc_phans, tkbInfo],
    );

    const onRemoveNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean, isSocket?: boolean) => {
            const nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);
            if (!tkbInfo || !nhom || !id_to_hocs.includes(idToHoc)) return;

            if (!isSocket)
                globalState.client.socket.emit('removeNhomHoc', tkbInfo.id, idToHoc, !!isTimeLine);

            const index = id_to_hocs.indexOf(idToHoc);
            id_to_hocs.splice(index, 1);
            setIdToHocs([...id_to_hocs]);
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeNhomHoc', valueId: idToHoc });
                redoTimeLine.current = [];
            }
            delete cacheMhpIdToHoc.current[nhom.ma_mon];
            delete cacheTietNhom.current[tkbToKey(nhom.tkb)];
        },
        [dsNhomHoc?.ds_nhom_to, globalState.client.socket, id_to_hocs, tkbInfo],
    );

    const onRemoveHphandeler = useCallback(
        (mhp: string, isTimeLine?: boolean, isSocket?: boolean) => {
            if (!tkbInfo || !ma_hoc_phans.includes(mhp)) {
                console.log('hp không tồn tại trong ds hoặc tkb chưa tải xong');
                return;
            }

            if (!isSocket)
                globalState.client.socket.emit(
                    'removeHocPhan',
                    tkbInfo.id || '',
                    mhp,
                    !!isTimeLine,
                );

            const index = ma_hoc_phans.indexOf(mhp);
            ma_hoc_phans.splice(index, 1);
            if (cacheMhpIdToHoc.current[mhp]) onRemoveNhomHocHandler(cacheMhpIdToHoc.current[mhp]);
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }

            setTkbInfo({ ...tkbInfo });
        },
        [globalState.client.socket, ma_hoc_phans, onRemoveNhomHocHandler, tkbInfo],
    );

    const onAddNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean, replay?: boolean, isSocket?: boolean) => {
            // dừng hỏi tôi cũng cũng không hiểu mình đang viết gì đâu

            if (!tkbInfo) return;
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

            // nếu môn đó thay thế hết toàn bộ môn thì xóa những môn bị chùng đi
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
                id_to_hocs.push(idToHoc);
                // setTkbInfo({ ...tkbInfo });
                setIdToHocs([...id_to_hocs]);
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
                    // console.log('ok');

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
                // console.log(ov);

                NotifyMaster.error(`Trùng tiết ${ov.map((e) => e.ten_mon).join(' - ')}`);
                setConflict((e) => {
                    ov.forEach((j) => {
                        if (!e.includes(j.id_to_hoc)) e.push(j.id_to_hoc);
                    });
                    return [...e];
                });
                setTimeout(() => {
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

            if (!isSocket)
                globalState.client.socket.emit(
                    'addNhomHoc',
                    tkbInfo.id,
                    idToHoc,
                    !!isTimeLine,
                    !!replay,
                );
            cacheMhpIdToHoc.current[maMon] = idToHoc;
            cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
            id_to_hocs.push(idToHoc);
            setIdToHocs([...id_to_hocs]);
        },
        [
            dsNhomHoc?.ds_nhom_to,
            globalState.client.socket,
            id_to_hocs,
            onRemoveNhomHocHandler,
            tkbInfo,
        ],
    );

    const updataTkbInfo = useCallback(async () => {
        if (!tkbDataRef.current || !TkbContent.current) return;
        console.log('dosave');
        const api = tkbDataRef.current?.isClient
            ? globalState.client.localApi
            : globalState.client.serverApi;

        const update_info = await api.updateTkbInfo(tkbDataRef.current);
        if (!update_info.success) {
            notifyMaster.error(update_info.msg);
            return;
        }

        const content = await api.updateTkbContent(tkbId, TkbContent.current[0]);
        if (!content.success) {
            notifyMaster.error(content.msg);
            return;
        }

        const mmh = await api.updateTkbContentMmh(tkbId, TkbContent.current[1]);
        if (!mmh.success) {
            notifyMaster.error(mmh.msg);
            return;
        }
        setIconSaveing('saved');
        console.log('lưu thành công');
    }, [globalState.client.localApi, globalState.client.serverApi, tkbId]);

    const onRenameHandler = useCallback(
        (s: string, isSocket?: boolean) => {
            if (!isSocket) globalState.client.socket.emit('rename', tkbId, s);
            setTkbInfo((e) => {
                if (!e) return e;
                e.name = s;
                return { ...e };
            });
        },
        [globalState.client.socket, tkbId],
    );

    // getTkbData và dsNhomHoc
    useEffect(() => {
        if (globalState.client.islogin()) {
            console.log('join');
            globalState.client.socket.emit('join', tkbId || '');
        }

        if (!tkbInfo || !dsNhomHoc) {
            Promise.all([getTkbData(), getTkbContent(), getTkbContentMmh(), getDsNhomHoc()]).then(
                ([tkbDataResp, idToHocs, mmh, dsNhomHocResp]) => {
                    console.log('getTkbRep', tkbDataResp);
                    console.log('getDsNhomHocRep', dsNhomHocResp);

                    setIsLoading(false);

                    if (!tkbDataResp.success || !tkbDataResp.data) {
                        setErrMsg(tkbDataResp.msg || 'lỗi không thể lấy thời khóa biểu');
                        return;
                    }
                    setTkbInfo(tkbDataResp.data);

                    setDsNhomHoc(dsNhomHocResp);

                    if (idToHocs.success && idToHocs.data) {
                        setIdToHocs(idToHocs.data);
                        idToHocs.data?.forEach((idToHoc) => {
                            const nhomHoc = dsNhomHocResp.ds_nhom_to.find(
                                (e) => e.id_to_hoc === idToHoc,
                            );

                            if (!nhomHoc) return;

                            cacheMhpIdToHoc.current[nhomHoc.ma_mon] = idToHoc;
                            const key = tkbToKey(nhomHoc.tkb);
                            cacheTietNhom.current[key] = nhomHoc;
                        });
                    }

                    if (mmh.success && mmh.data) {
                        setMaMomHoc(mmh.data);
                    }
                },
            );
        }

        return () => {
            console.log('hello');
            updataTkbInfo();
            globalState.client.socket.emit('leave', tkbId || '');
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updataTkbInfo, getDsNhomHoc, getTkbData, globalState.client, tkbId]);

    useEffect(() => {
        if (!tkbInfo) return;
        tkbDataRef.current = tkbInfo;
        TkbContent.current = [id_to_hocs, ma_hoc_phans];
        // setIconSaveing('notsave');
    }, [tkbInfo, id_to_hocs, ma_hoc_phans]);

    return {
        tkbData: tkbInfo,
        dsNhomHoc,
        conflict,
        iconSaveing,
        errMsg,
        undoTimeLine,
        redoTimeLine,
        isLoading,
        id_to_hocs,
        ma_hoc_phans,

        setIconSaveing,
        onAddHphandler,
        onRemoveHphandeler,
        onRemoveNhomHocHandler,
        onAddNhomHocHandler,
        onRenameHandler,
        doUpdate: updataTkbInfo,
    };
};

export default useTkbHandler;
