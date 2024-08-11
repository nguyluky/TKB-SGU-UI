import { render } from '@testing-library/react';
import { DsNhomHocResp } from '../../../../Service';
import Calendar from '../Calendar';

test('testCalendar', () => {
    const data: DsNhomHocResp = {
        ds_nhom_to: [
            {
                id_to_hoc: '-5187303781071816538',
                id_mon: '-5620010867672547761',
                ma_mon: '841419',
                ten_mon: 'Lập trình web và ứng dụng',
                so_tc: 4,
                lop: {
                    ma: 'DKP1232',
                    ten: 'ĐH chính quy - ngành Kỹ thuật phần mềm - K.23 - Lớp 2',
                },
                nhom: '06',
                ds_lop: [
                    {
                        ma: 'DKP1232',
                        ten: 'ĐH chính quy - ngành Kỹ thuật phần mềm - K.23 - Lớp 2',
                    },
                ],
                ds_khoa: [
                    {
                        ma: 'CTCT',
                        ten: '(ngành) Công nghệ thông tin',
                    },
                ],
                tkb: [
                    {
                        thu: '6',
                        tbd: 6,
                        tkt: 8,
                        phong: 'C.E403',
                        gv: 'Nguyễn Thanh Sang',
                        th: false,
                    },
                    {
                        thu: '6',
                        tbd: 9,
                        tkt: 10,
                        phong: 'C.E403',
                        gv: 'Nguyễn Thanh Sang',
                        th: false,
                    },
                ],
            },

            {
                id_to_hoc: '-8361096851499031711',
                id_mon: '-7492042434385681633',
                ma_mon: '841044',
                ten_mon: 'Phương pháp lập trình hướng đối tượng',
                so_tc: 4,
                lop: {
                    ma: 'DCT1233',
                    ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 3',
                },
                nhom: '07',
                ds_lop: [
                    {
                        ma: 'DCT1233',
                        ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 3',
                    },
                ],
                ds_khoa: [
                    {
                        ma: 'CTCT',
                        ten: '(ngành) Công nghệ thông tin',
                    },
                ],
                tkb: [
                    {
                        thu: '2',
                        tbd: 6,
                        tkt: 8,
                        phong: 'C.A106',
                        gv: 'Nguyễn Thị Hồng Anh',
                        th: false,
                    },
                    {
                        thu: '2',
                        tbd: 9,
                        tkt: 10,
                        phong: 'C.A106',
                        gv: 'Nguyễn Thị Hồng Anh',
                        th: false,
                    },
                ],
            },

            {
                id_to_hoc: '-8385649243555356019',
                id_mon: '-6230603544374870828',
                ma_mon: '841109',
                ten_mon: 'Cơ sở dữ liệu',
                so_tc: 4,
                lop: {
                    ma: 'DCT1232',
                    ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 2',
                },
                nhom: '02',
                ds_lop: [
                    {
                        ma: 'DCT1232',
                        ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 2',
                    },
                ],
                ds_khoa: [
                    {
                        ma: 'CTCT',
                        ten: '(ngành) Công nghệ thông tin',
                    },
                ],
                tkb: [
                    {
                        thu: '3',
                        tbd: 1,
                        tkt: 3,
                        phong: 'C.A102',
                        gv: 'Lê Nhị Lãm Thúy',
                        th: false,
                    },
                    {
                        thu: '3',
                        tbd: 4,
                        tkt: 5,
                        phong: 'C.A102',
                        gv: 'Lê Nhị Lãm Thúy',
                        th: false,
                    },
                ],
            },
            {
                id_to_hoc: '-8830955315427045980',
                id_mon: '-5988897119460449836',
                ma_mon: '841110',
                ten_mon: 'Cơ sở trí tuệ nhân tạo',
                so_tc: 4,
                lop: {
                    ma: 'DKP1221',
                    ten: 'ĐH chính quy - ngành Kỹ thuật phần mềm - K.22 - Lớp 1',
                },
                nhom: '01',
                ds_lop: [
                    {
                        ma: 'DKP1221',
                        ten: 'ĐH chính quy - ngành Kỹ thuật phần mềm - K.22 - Lớp 1',
                    },
                ],
                ds_khoa: [
                    {
                        ma: 'CTCT',
                        ten: '(ngành) Công nghệ thông tin',
                    },
                ],
                tkb: [
                    {
                        thu: '4',
                        tbd: 1,
                        tkt: 3,
                        phong: 'C.HB403',
                        gv: 'Vũ Ngọc Thanh Sang',
                        th: false,
                    },
                    {
                        thu: '4',
                        tbd: 4,
                        tkt: 5,
                        phong: 'C.HB403',
                        gv: 'Vũ Ngọc Thanh Sang',
                        th: false,
                    },
                ],
            },
            {
                id_to_hoc: '-6417985311602454964',
                id_mon: '-5953894619121402077',
                ma_mon: '841022',
                ten_mon: 'Hệ điều hành',
                so_tc: 3,
                lop: {
                    ma: 'DCT1234',
                    ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 4',
                },
                nhom: '04',
                ds_lop: [
                    {
                        ma: 'DCT1234',
                        ten: 'ĐH chính quy - ngành Công nghệ thông tin - K.23 - Lớp 4',
                    },
                ],
                ds_khoa: [
                    {
                        ma: 'CTCT',
                        ten: '(ngành) Công nghệ thông tin',
                    },
                ],
                tkb: [
                    {
                        thu: '5',
                        tbd: 2,
                        tkt: 3,
                        phong: 'C.A110',
                        gv: 'Nguyễn Quốc Phong',
                        th: false,
                    },
                    {
                        thu: '5',
                        tbd: 4,
                        tkt: 5,
                        phong: 'C.A110',
                        gv: 'Nguyễn Quốc Phong',
                        th: false,
                    },
                ],
            },
        ],
        ds_mon_hoc: {
            '841419': 'Lập trình web và ứng dụng',
            '841044': 'Phương pháp lập trình hướng đối tượng',
            '841109': 'Cơ sở dữ liệu',
            '841110': 'Cơ sở trí tuệ nhân tạo',
            '841022': 'Hệ điều hành',
        },
    };

    const onDeleteNhomHoc = (idToHoc: string) => {};

    const onTimMonHocTuTu = (idToHocs: string[]) => {};

    render(
        <Calendar
            data={data.ds_nhom_to}
            idToHocs={['-5187303781071816538', '-8361096851499031711', '-8385649243555356019']}
            onDeleteNhomHoc={onDeleteNhomHoc}
            onTimMonHocTuTu={onTimMonHocTuTu}
            conflict={[]}
        />,
    );
});

export {};
