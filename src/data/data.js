export const orders = [
    {
        status: 'Etiraz',
        number: 4,
        category: 'İnformasiya Texnologiyaları',
        participants: [{ fullname: 'A', name: 'Linonel', surname: 'Messi' }],
        deadline: '17/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'wdasd',
                importance: 1,
                amount: 81,
                additionalInfo: '',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 2,
                model: 'dasfads',
                importance: 2,
                amount: 11,
                additionalInfo: 'sadafs',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 3,
                model: 'awdavds',
                importance: 3,
                amount: 123,
                additionalInfo: 'dwaewa',
                class: ''
            }
        ]
    },
    {
        status: 'Gözlənilir',
        number: 12,
        category: 'Elektronika',
        participants: [{ fullname: 'Lala Musaeva', name: 'Lala', surname: 'Musayeva' },
        { fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' },
        { fullname: 'Baghirov Emin', name: 'Emin', surname: 'Baghirov' },
        { fullname: 'Cristiano Ronaldo', name: 'Cristiano', surname: 'Ronaldo' }],
        deadline: '18/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'afvdas',
                importance: 1,
                amount: 81,
                additionalInfo: '',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'fwampvo',
                importance: 3,
                amount: 123,
                additionalInfo: 'sdfwe',
                class: ''
            }
        ]
    },
    {
        status: 'Təsdiq edilib',
        number: 123,
        category: 'Kadrlar',
        participants: [{ fullname: 'A', name: 'Rahman', surname: 'Mustafayev' },
        { fullname: 'B', name: 'Cesc', surname: 'Fabregas' },
        { fullname: 'C', name: 'Gabriel', surname: 'Martinelli' }],
        deadline: '19/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 1,
                model: '1d5c1a6acs',
                importance: 1,
                amount: 81,
                additionalInfo: '',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 2,
                model: 'da ci us',
                importance: 2,
                amount: 11,
                additionalInfo: 'sadafs',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 3,
                model: 'dacmop',
                importance: 3,
                amount: 123,
                additionalInfo: 'dwaewa',
                class: ''
            }
        ]
    },
    {
        status: 'Baxılır',
        number: 1234,
        category: 'Energetika',
        participants: [{ fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' }],
        deadline: '20/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 3,
                model: 'ca jk ',
                importance: 3,
                amount: 123,
                additionalInfo: 'dwaewa',
                class: ''
            }
        ]
    },
    {
        status: 'Anbarda',
        number: 12345,
        category: 'Təsərüfat',
        participants: [{ fullname: 'Sergio Ramos', name: 'Sergio', surname: 'Ramos' }],
        deadline: '21/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'dac iujk',
                importance: 1,
                amount: 81,
                additionalInfo: '',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'fncawoi kl',
                importance: 3,
                amount: 123,
                additionalInfo: 'sdfwe',
                class: ''
            }
        ]
    },
    {
        status: 'Tamamlanmışdır',
        number: 123456,
        category: 'Digər',
        participants: [{ fullname: 'Sergio Ramos', name: 'Sergio', surname: 'Ramos' }],
        deadline: '21/05/2020',
        remark: ' ',
        action: ' ',
        materials: [
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'fa cjksnl',
                importance: 1,
                amount: 81,
                additionalInfo: '',
                class: ''
            },
            {
                id: Math.random().toString(),
                materialId: 1,
                model: 'daconij09',
                importance: 2,
                amount: 11,
                additionalInfo: 'sadafs',
                class: ''
            }
        ]
    }
]
export const visas = [
    {
        isOpened: false,
        number: 1,
        from: 'Johnny Depp',
        category: 'İnformasiya Texnologiyaları',
        deadline: '17/05/2020',
        remark: 'asfas',
        date: '10/07/2020'
    },
    {
        isOpened: true,
        number: 12,
        from: 'Antonio Banderas',
        category: 'Elektronika',
        deadline: '18/05/2020',
        remark: 'asfaew',
        date: '25/07/2020'
    },
    {
        isOpened: false,
        number: 123,
        from: 'Emily Browning',
        category: 'Kadrlar',
        deadline: '19/05/2020',
        remark: 'fwqeafas24fc',
        date: '12/07/2020'
    },
    {
        isOpened: true,
        number: 1234,
        from: 'Marshall Mathers',
        category: 'Energetika',
        deadline: '20/05/2020',
        remark: 'fas4f1d5sf',
        date: '30/07/2020'
    },
    {
        number: 12345,
        isOpened: true,
        from: 'J Balvin',
        category: 'Təsərüfat',
        deadline: '21/05/2020',
        remark: 'navdkjsdbvkj',
        date: '20/07/2020'
    },
    {
        number: 123456,
        isOpened: false,
        from: 'Granit Xhaka',
        category: 'Digər',
        deadline: '21/05/2020',
        remark: 'csd1s5d1cf6eac5',
        date: '11/07/2020'
    }
]
export const token = localStorage.getItem('token');
export const newOrderInitial = {
    materials: [
        {
            id: Math.random().toString(),
            materialId: 1,
            model: '',
            importance: 1,
            amount: 1,
            additionalInfo: '',
            class: '',
            unitid: 2
        }
    ],
    deadline: '',
    receivers: [],
    assignment: '',
    comment: '',
    review: '',
    ordNumb: ''
}
export const availableLinks = [
        'Sifarişlərim',
        'Vizalarım',
        'Drafts',
        'Arxiv',
        'Gələnlər',
        'Qiymət təklifləri',
        'Anbar',
        'Users',
        'System Params',
        'Structure',
        'Dashboard',
    ];
export const availableOperations = [
        'Sifariş yaratmaq',
        'Sifarişə etiraz etmək',
        'Sifarişi ləğv etmək',
        'Sifarişə düzəliş etmək',
        'Sifarişə düzəliş etmək üçün geri çevirmək',
        'Sifarişi təsdiq etmək',
        'Məhsula görə büccə təyin etmək',
        'Yeni məhsulun əlavə edilməsi'
    ];
export const suppliers = [
    {
        name: 'Shanghai Electric International',
        id: '1'
    },
    {
        name: 'ARAZNET',
        id: '2'
    },
    {
        name: 'Estet',
        id: '3'
    },
    {
        name: 'Caspien Supplies',
        id: '4'
    },
]
export const importance = [
    {
        title: 'orta',
        val: 1
    },
    {
        title: 'vacib',
        val: 2
    },
    {
        title: 'çox vacib',
        val: 3
    },
]
export const incoTerms = [
    {
        name: 'EXW',
        id: '1'
    },
    {
        name: 'FCA',
        id: '2'
    },
    {
        name: 'FAS',
        id: '3'
    },
    {
        name: 'FOB',
        id: '4'
    },
    {
        name: 'CFR',
        id: '5'
    },
    {
        name: 'CIF',
        id: '6'
    },
    {
        name: 'CPT',
        id: '7'
    },
    {
        name: 'CIP',
        id: '8'
    },
    {
        name: 'DAP',
        id: '9'
    },
    {
        name: 'DPU',
        id: '10'
    },
    {
        name: 'DDP',
        id: '11'
    },
]