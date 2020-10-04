
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
export const glCategories = [
    {
        code: 90024,
        name: 'İşçilərlə bağlı digər fondlara ayırmalar',
        currency: 'milli valyuta'
    },
    {
        code: 90025,
        name: 'İşçilərin tədrisi üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90026,
        name: 'Yeni işçilərin qəbulu üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90029,
        name: 'İşçilər ilə bağlı digər xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90050,
        name: 'Binalar və qurğuların təmir və saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90051,
        name: 'Mebel və avadanlığın təmir və saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90052,
        name: 'Kompüterlər avadanlıqlarının təmir və saxlanmaxərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90053,
        name: 'Nəqliyyat vasitələrinin təmirvə saxlanmaxərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90054,
        name: 'Digər əsas vəsaitlərin təmirvə saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90055,
        name: 'Maliyyə icarəsinə götürülmüş əsas vəsaitlərin təmirvə saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90056,
        name: 'İcarəyə alınmış əsas vəsaitlərin təmir və saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90057,
        name: 'İnvestisiya mülkiyyəti üzrə təmir və saxlanma xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90060,
        name: 'Avadanlıqların dəstəklənməsi üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90061,
        name: 'Proqram təminatlarının dəstəklənməsi üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90069,
        name: 'Digər dəstəklənmə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90070,
        name: 'Nəqliyyat vasitələri üzrə istismarxərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90071,
        name: 'Əmlakın sığortası üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90072,
        name: 'Avadanlığın icarəsi üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90073,
        name: 'Mühafizə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90074,
        name: 'Enerji və qızdırıcı sistemlərüzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90075,
        name: 'Kommunal xidmətlər üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90076,
        name: 'İnvestisiya mülkiyyəti üzrə digərxərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90077,
        name: 'Əsas vəsaitlər vəqeyri-maddi aktivlərlə bağlı vergilər və gömrük rüsumları',
        currency: 'milli valyuta'
    },
    {
        code: 90080,
        name: 'Rabitə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90081,
        name: 'Mətbəə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90082,
        name: 'Mal-materialların alınması üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90083,
        name: 'Reklam xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90085,
        name: 'Məsləhət, audit və digər peşəkar xidmətlər üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90086,
        name: 'İcarə haqqı',
        currency: 'milli valyuta'
    },
    {
        code: 90087,
        name: 'Üzvlük haqqı',
        currency: 'milli valyuta'
    },
    {
        code: 90089,
        name: 'Digər xidmətlər üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90090,
        name: 'Əmanətlərin sığortalanması fondu üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90110,
        name: 'Mülki müdafiə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90111,
        name: 'Ümidsiz borclarüzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90112,
        name: 'Hərrac xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90113,
        name: 'Ödənilmiş cərimə və dəbbə məbləğləri',
        currency: 'milli valyuta'
    },
    {
        code: 90114,
        name: 'Hüquq məsrəfləri vəməhkəmə xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90115,
        name: 'Nümayəndəlik xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90116,
        name: 'Xeyriyyə məqsədləri üzrə xərclər',
        currency: 'milli valyuta'
    },
    {
        code: 90118,
        name: 'Vergi xərcləri',
        currency: 'milli valyuta'
    },
    {
        code: 90119,
        name: 'Digər xərclər',
        currency: 'milli valyuta'
    }
]