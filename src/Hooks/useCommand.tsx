import { toPng } from 'html-to-image';
import { ReactNode, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notifyMaster from '../components/NotifyPopup/NotificationManager';
import { apiConfig } from '../config';
import { CloneTkb, CreateNewTkb, Property, Share, UploadTkb } from '../pages/components/PagesPopup';
import { Convert } from '../pages/DsTkb/FileTkb';
import { useTkbHandlerTypes } from '../pages/Tkb/Tkb';
import { globalContent } from '../store/GlobalContent';
import { textSaveAsFile } from '../utils';
import useWindowPopup from './useWindowPopup';

export interface commandsInterface {
    new?: () => void;
    saveAsFile?: () => void;
    open?: () => void;
    undo?: () => void;
    redo?: () => void;
    exit?: () => void;
    clone?: () => void;
    addMember?: () => void;
    property?: () => void;
    cut?: () => void;
    past?: () => void;
    manageMenber?: () => void;
    googleCalendar?: () => void;
}

export interface commandsInterface {
    new?: () => void;
    saveAsFile?: () => void;
    open?: () => void;
    undo?: () => void;
    redo?: () => void;
    exit?: () => void;
    clone?: () => void;
    addMember?: () => void;
    property?: () => void;
    cut?: () => void;
    past?: () => void;
    manageMenber?: () => void;
    googleCalendar?: () => void;
    saveAsPng?: () => void;
}

export default function useCommand(tkbHandler: useTkbHandlerTypes) {
    const nav = useNavigate();

    const [globalState] = useContext(globalContent);
    const [popup, setPopup] = useState<ReactNode>();
    const windowPopup = useWindowPopup((event) => {
        const data = event.data;

        if (data.type === 'notify') {
            notifyMaster[data.data.notifyType](data.data.mess);
            windowPopup.close();
        }
    });

    const commands = useCallback(
        (key: keyof commandsInterface) => {
            const onUploadTkbHandler = (file: File, pos: string) => {
                const reader = new FileReader();

                reader.readAsText(file, 'utf-8');

                reader.onload = () => {
                    if (!reader.result) return;
                    try {
                        const fileTkb = Convert.toFileTkb(reader.result as string);
                        const api = pos === 'client' ? globalState.client.localApi : globalState.client.serverApi;
                        api.createNewTkb({
                            name: fileTkb.name,
                            tkb_describe: '',
                            // NOTE: magic number
                            nam: fileTkb.nam || '20242',
                            thumbnails: null,
                            isClient: pos === 'client',
                        })
                            .then(async (e) => {
                                if (!e.success || !e.data) {
                                    notifyMaster.error(e.msg);
                                    return;
                                }

                                await Promise.all([
                                    api.updateTkbContent(
                                        e.data.id,
                                        fileTkb.data.map((e) => e.id_to_hoc)
                                    ),
                                    api.updateTkbContentMmh(
                                        e.data.id,
                                        fileTkb.data.map((e) => e.mhp)
                                    ),
                                ]);

                                nav('/tkbs/' + e.data?.id + (e.data?.isClient ? '?isclient=true' : ''));
                                notifyMaster.success('Upload tkb thành công');
                            })
                            .catch((e) => {
                                notifyMaster.success('Không thể kết upload tkb không biết lý do');
                            });
                    } catch {
                        notifyMaster.error('Format file không hợp lệ');
                    }
                };
            };

            const onCreateTkbHandler = (name: string, pos: string, nam: string) => {
                (pos === 'client' ? globalState.client.localApi : globalState.client.serverApi)
                    .createNewTkb({
                        name: name,
                        nam: nam,
                        tkb_describe: '',
                        thumbnails: null,
                        isClient: pos === 'client',
                    })
                    .then((e) => {
                        if (!e.success) {
                            notifyMaster.error(e.msg);
                            return;
                        }

                        nav('/tkbs/' + e.data?.id + (e.data?.isClient ? '?isclient=true' : ''));
                        notifyMaster.success('Tạo tkb thành công');
                    })
                    .catch((e) => {
                        notifyMaster.success('Không thể kết tạo tkb không biết lý do');
                    });
            };

            const commandObj: commandsInterface = {
                new: () => {
                    console.log('ok');
                    setPopup(
                        <CreateNewTkb
                            open={true}
                            onClose={() => {
                                setPopup('');
                            }}
                            onCreate={onCreateTkbHandler}
                        />
                    );
                },
                saveAsFile: () => {
                    const a = tkbHandler.id_to_hocs.map((e) => {
                        const nhom = tkbHandler.dsNhomHoc?.ds_nhom_to.find((j) => j.id_to_hoc === e);

                        return {
                            mhp: nhom?.ma_mon,
                            ten: nhom?.ten_mon,
                            nhom: '?',
                            id_to_hoc: e,
                        };
                    });

                    const textFile = {
                        name: tkbHandler.tkbData?.name,
                        created: tkbHandler.tkbData?.created.toString(),
                        data: a,
                    };

                    textSaveAsFile(JSON.stringify(textFile));
                },
                saveAsPng: () => {
                    const div = document.getElementById('tkb-grip-content') as HTMLDivElement;
                    if (div) {
                        toPng(div, {
                            backgroundColor: globalState.theme === 'dark' ? '#2b2d31' : '#e3e5e8',
                            width: div.scrollWidth,
                            height: div.scrollHeight,
                        }).then((dataUrl) => {
                            console.log(dataUrl);
                            const link = document.createElement('a');
                            link.download = (tkbHandler.tkbData?.name || 'tkb') + '.jpeg';
                            link.href = dataUrl;
                            link.click();
                        });
                    }
                },
                open: () => {
                    setPopup(
                        <UploadTkb
                            open={true}
                            onClose={() => {
                                setPopup('');
                            }}
                            uploadTkb={(file, pos) => {
                                setPopup('');
                                onUploadTkbHandler(file, pos);
                            }}
                        />
                    );
                },
                undo: () => {
                    tkbHandler.unDo();
                },
                redo: () => {
                    tkbHandler.reDo();
                },
                exit: () => {
                    nav('/tkbs');
                },
                clone: () => {
                    setPopup(
                        <CloneTkb
                            open={true}
                            onClose={() => {
                                setPopup('');
                            }}
                            onClone={(name, pos) => {
                                console.log(tkbHandler.id_to_hocs, tkbHandler.ma_hoc_phans);

                                const api =
                                    pos === 'client' ? globalState.client.localApi : globalState.client.serverApi;

                                api.createNewTkb(
                                    {
                                        nam: tkbHandler.tkbData?.nam || '20242',
                                        name: name,
                                        tkb_describe: '',
                                        thumbnails: null,
                                    }
                                    // name,
                                    // '',
                                    // null,
                                    // false,
                                    // tkbHandler.tkbData?.id_to_hocs || [],
                                    // tkbHandler.tkbData?.ma_hoc_phans || [],
                                )
                                    .then(async (e) => {
                                        if (!e.success || !e.data) {
                                            notifyMaster.error(e.msg);
                                            return;
                                        }

                                        await Promise.all([
                                            api.updateTkbContent(e.data.id, tkbHandler.id_to_hocs),
                                            api.updateTkbContentMmh(e.data.id, tkbHandler.ma_hoc_phans),
                                        ]);

                                        window.open(
                                            window.location.origin +
                                                '/tkbs/' +
                                                e.data?.id +
                                                (e.data?.isClient ? '?isclient=true' : '')
                                        );
                                    })
                                    .catch((e) => {
                                        notifyMaster.success('Tạo bản sao tkb không biết lý do');
                                    });
                            }}
                        />
                    );
                },
                addMember: () => {
                    if (tkbHandler.tkbData) {
                        if (tkbHandler.tkbData.isClient) {
                            notifyMaster.error(
                                'không thể chia sẻ tkb client, sạo bản sao phía server rồi thử lại nha.'
                            );
                            return;
                        }
                        setPopup(
                            <Share
                                tkbid={tkbHandler.tkbData.id || ''}
                                open={true}
                                modal
                                onClose={() => setPopup('')}
                            ></Share>
                        );
                    }
                },
                property: () => {
                    if (tkbHandler.tkbData)
                        setPopup(
                            <Property open={true} tkbData={tkbHandler.tkbData} onClose={() => setPopup('')} modal />
                        );
                },
                googleCalendar: () => {
                    let url = '';

                    if (tkbHandler.tkbData?.isClient) {
                        url =
                            apiConfig.baseUrl +
                            apiConfig.googleOauthCalendar() +
                            '?tkbData=' +
                            encodeURI(JSON.stringify(tkbHandler.id_to_hocs)) +
                            '&access_token=' +
                            encodeURI(globalState.client.token || '');
                    } else {
                        url =
                            apiConfig.baseUrl +
                            apiConfig.googleOauthCalendar() +
                            '?tkbId=' +
                            encodeURI(tkbHandler.tkbData?.id || '') +
                            '&access_token=' +
                            encodeURI(globalState.client.token || '');
                    }

                    windowPopup.open({
                        url: url,
                        title: 'tkb',
                        h: 500,
                        w: 400,
                    });
                },
            };
            return commandObj[key];
        },
        [
            globalState.client.localApi,
            globalState.client.serverApi,
            globalState.client.token,
            globalState.theme,
            nav,
            tkbHandler,
            windowPopup,
        ]
    );

    return { commands, popup };
}
