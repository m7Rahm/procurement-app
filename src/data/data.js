
export const newOrderInitial = {
    materials: [
        {
            id: Date.now().toString(),
            materialId: '',
            model: '',
            approx_price: 0,
            additionalInfo: '',
            class: '',
            subCategory: '',
            category: '',
            count: 1
        }
    ],
    comment: '',
    review: '',
    ordNumb: '',
    orderType: 0
}
export const months = [
    {
        name: 'Yanvar',
        value: '01'
    },
    {
        name: 'Fevral',
        value: '02'
    },
    {
        name: 'Mart',
        value: '03'
    },
    {
        name: 'Aprel',
        value: '04'
    },
    {
        name: 'May',
        value: '05'
    },
    {
        name: 'Iyun',
        value: '06'
    },
    {
        name: 'Iyul',
        value: '07'
    },
    {
        name: 'Avqust',
        value: '08'
    },
    {
        name: 'Sentyabr',
        value: '09'
    },
    {
        name: 'Oktyabr',
        value: '10'
    },
    {
        name: 'Noyabr',
        value: '11'
    },
    {
        name: 'Dekabr',
        value: '12'
    }
]


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
        'Büccə'
    ];
export const availableOperations = [
        'Sifariş yaratmaq',
        'Sifarişi təsdiq etmək',
        'Sifarişə etiraz etmək',
        'Sifarişi redaktəyə qaytarmaq',
        'Sifarişi redaktə etmək',
        'Büccə daxil etmək',
        'Yeni məhsul əlavə etmək'
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
];
export const modules = [
    {
        text: 'Admin',
        link: '/admin'
    },
    {
        text: 'Budget',
        link: '/budget'
    },
    {
        text: 'Orders',
        link:'/orders'
    },
    {
        text: 'Contracts',
        link: '/contracts'
    },
    {
        text: 'Tender',
        link: '/tender'
    }
]
