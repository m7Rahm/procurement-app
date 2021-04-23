
export const newOrderInitial = {
    materials: [
        {
            id: Date.now(),
            materialId: '',
            model: '',
            code: '',
            department: '',
            approx_price: 0,
            additionalInfo: '',
            class: '',
            subGlCategory: '',
            count: 1
        }
    ],
    glCategory: '-1',
    structure: '-1',
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
    'Yeni məhsul əlavə etmək',
    "Digər sifarişləri görmək"
];

export const miscDocTypes = [
    {
        val: "0",
        text: "Hamısı"
    },
    {
        val: "1",
        text: "Büdcə artırılması"
    },
    {
        val: "2",
        text: "Silinmə"
    },
]
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
        link: '/orders'
    },
    {
        text: 'Contracts',
        link: '/contracts'
    },
    {
        text: 'Tender',
        link: '/tender'
    },
    {
        text: 'Warehouse',
        link: '/warehouse'
    },
    {
        text: 'Other',
        link: '/other'
    }
]
export const expressVendorInit = {
    name: '',
    voen: '',
    sphere: '1',
    type: '1',
    residency: '1',
    tax_type: '1',
    tax_percentage: '0',
    legal_address: '',
    actual_address: '',
    saa: '',
    phone_numbers: [],
    emails: [],
    risk_zone: '1',
    reg_date: '',
    vendor_type: '1',
    files: []
}
export const vendorTypes = [
    {
        val: 1,
        text: 'Fiziki şəxs'
    },
    {
        val: 2,
        text: 'Hüquqi şəxs'
    }
];
export const optionsAgreements = [
    {
        val: "-3",
        text: "Hamısı"
    },
    {
        val: "0",
        text: "Gözləyən"
    },
    {
        val: "1",
        text: "Təsdiq edilmiş"
    },
    {
        val: "-1",
        text: "Etiraz edilmiş"
    }
];
export const optionsReadyOrders = [
    {
        val: "-3",
        text: "Hamısı"
    },
    {
        val: "0",
        text: "Gözləyən"
    },
    {
        val: "31",
        text: "Razılaşdırılmış"
    },
    {
        val: "30",
        text: "Razılaşmada"
    }
]
export const workSectors = [
    {
        val: 1,
        text: 'Satış'
    },
    {
        val: 2,
        text: 'Ximət'
    }
];
export const taxTypes = [
    {
        val: 1,
        text: 'ƏDV'
    },
    {
        val: 2,
        text: 'Sadələşdirilmiş'
    },
    {
        val: 3,
        text: 'Ticarət və ictimai iaşə'
    }
];
export const riskZones = [
    {
        val: 1,
        text: 'Orta'
    },
    {
        val: 2,
        text: 'Yüksək'
    },
    {
        val: 3,
        text: 'Qara siyahı'
    }
];