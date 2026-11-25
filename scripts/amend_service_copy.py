"""One-off: adds the copy for the new service pages (client amendments, Nov 2026).

Draft copy adapted from the closest approved pages (Freight & Transport, Air & Sea
Chartering, Warehousing, Project Logistics). To be replaced when Namma supplies
approved text. Run from the project root: python3 scripts/amend_service_copy.py
"""
import json

COMMON = {
    "en": {
        "includedEyebrow": "What's included",
        "stepsEyebrow": "How it works",
        "relatedEyebrow": "Related services",
        "relatedTitle": "Within the same\n*service group*",
        "backTo": "All {group}",
    },
    "ar": {
        "includedEyebrow": "ما تشمله الخدمة",
        "stepsEyebrow": "كيف نعمل",
        "relatedEyebrow": "خدمات ذات صلة",
        "relatedTitle": "ضمن مجموعة\n*الخدمات نفسها*",
        "backTo": "كل خدمات {group}",
    },
}

PAGES = {
    "airFreight": {
        "en": {
            "title": "Air freight for\n*time-critical* cargo",
            "body": [
                "When the arrival date leads, air freight moves your cargo on scheduled services or, when capacity or timing demands it, on a dedicated charter.",
                "Namma arranges the booking, documentation and handling at both ends, and connects the flight with customs clearance and delivery in Saudi Arabia.",
            ],
            "includedTitle": "Air freight,\n*arranged end to end*",
            "included": [
                {"title": "Scheduled air cargo", "body": "Space booked on airline services that match the route and the required arrival date."},
                {"title": "Air charter", "body": "Dedicated capacity when cargo dimensions, weight or timing do not fit scheduled services."},
                {"title": "Documentation", "body": "Air waybills and shipping documents prepared and checked before departure."},
                {"title": "Airport handling", "body": "Collection, acceptance and handling coordinated at the origin and destination airports."},
            ],
            "stepsTitle": "From booking\n*to arrival*",
            "steps": [
                {"title": "Cargo & timeline", "body": "We review what is moving and when it must arrive."},
                {"title": "Routing & booking", "body": "The service or charter that fits is booked with the airline."},
                {"title": "Departure", "body": "Documents, handling and loading are completed at origin."},
                {"title": "Arrival & delivery", "body": "Clearance and onward delivery are coordinated at destination."},
            ],
            "topic": "air freight",
        },
        "ar": {
            "title": "شحن جوي\n*للشحنات العاجلة*",
            "body": [
                "عندما يكون موعد الوصول هو الأولوية، ينقل الشحن الجوي بضائعك عبر الرحلات المجدولة، أو عبر طائرة مستأجرة عندما تتطلب السعة أو التوقيت ذلك.",
                "تتولى نما الحجز والمستندات والمناولة في طرفي الرحلة، وتربط الشحنة بالتخليص الجمركي والتسليم داخل المملكة.",
            ],
            "includedTitle": "شحن جوي\n*منسّق من البداية إلى النهاية*",
            "included": [
                {"title": "الشحن الجوي المجدول", "body": "حجز مساحات على رحلات شركات الطيران بما يناسب المسار وموعد الوصول المطلوب."},
                {"title": "استئجار الطائرات", "body": "سعة مخصصة عندما لا تناسب أبعاد الشحنة أو وزنها أو توقيتها الرحلات المجدولة."},
                {"title": "المستندات", "body": "إعداد بوالص الشحن الجوي ومستندات الشحن ومراجعتها قبل المغادرة."},
                {"title": "المناولة في المطارات", "body": "تنسيق الاستلام والقبول والمناولة في مطاري المنشأ والوصول."},
            ],
            "stepsTitle": "من الحجز\n*حتى الوصول*",
            "steps": [
                {"title": "الشحنة والتوقيت", "body": "نراجع ما سيتم نقله وموعد وصوله المطلوب."},
                {"title": "المسار والحجز", "body": "نحجز الرحلة أو الطائرة المستأجرة المناسبة مع شركة الطيران."},
                {"title": "المغادرة", "body": "إنجاز المستندات والمناولة والتحميل في بلد المنشأ."},
                {"title": "الوصول والتسليم", "body": "تنسيق التخليص والتسليم النهائي في جهة الوصول."},
            ],
            "topic": "الشحن الجوي",
        },
    },
    "seaFreight": {
        "en": {
            "title": "Sea freight for\n*full containers and\nproject cargo*",
            "body": [
                "Sea freight carries full containers, breakbulk and project cargo between international ports and Saudi Arabia, port to port or door to door.",
                "Namma books the carrier, prepares the documents and coordinates the land legs, port handling and customs clearance on both sides.",
            ],
            "includedTitle": "Sea freight,\n*coordinated port to door*",
            "included": [
                {"title": "Full container loads (FCL)", "body": "Containers booked for your cargo alone, sized to the volume that is moving."},
                {"title": "Breakbulk & project cargo", "body": "Cargo that does not fit a container, planned with ports, carriers and handling providers."},
                {"title": "Sea charter", "body": "Dedicated vessels for large or specialized shipments when regular services do not fit."},
                {"title": "Port handling", "body": "Loading, discharge and port formalities coordinated at both ends."},
            ],
            "stepsTitle": "From booking\n*to delivery*",
            "steps": [
                {"title": "Cargo & route", "body": "We review the cargo, the ports and the required arrival date."},
                {"title": "Carrier & booking", "body": "Space or a vessel is booked and the documents are prepared."},
                {"title": "Ocean transit", "body": "The shipment is followed from loading to arrival at the port."},
                {"title": "Clearance & delivery", "body": "Customs clearance and the land leg to destination are coordinated."},
            ],
            "topic": "sea freight",
        },
        "ar": {
            "title": "شحن بحري\n*للحاويات الكاملة\nوبضائع المشاريع*",
            "body": [
                "ينقل الشحن البحري الحاويات الكاملة والبضائع السائبة وبضائع المشاريع بين الموانئ الدولية والمملكة، من ميناء إلى ميناء أو من الباب إلى الباب.",
                "تتولى نما الحجز مع الناقل وإعداد المستندات، وتنسيق النقل البري والمناولة في الموانئ والتخليص الجمركي في الطرفين.",
            ],
            "includedTitle": "شحن بحري\n*منسّق من الميناء إلى الباب*",
            "included": [
                {"title": "الحاويات الكاملة (FCL)", "body": "حاويات مخصصة لشحنتك وحدها، بأحجام تناسب الكمية المنقولة."},
                {"title": "البضائع السائبة وبضائع المشاريع", "body": "بضائع لا تناسبها الحاويات، يُخطَّط لنقلها مع الموانئ والناقلين ومقدمي خدمات المناولة."},
                {"title": "استئجار السفن", "body": "سفن مخصصة للشحنات الكبيرة أو المتخصصة عندما لا تناسبها الخطوط المنتظمة."},
                {"title": "المناولة في الموانئ", "body": "تنسيق التحميل والتفريغ والإجراءات في ميناءي الشحن والوصول."},
            ],
            "stepsTitle": "من الحجز\n*حتى التسليم*",
            "steps": [
                {"title": "الشحنة والمسار", "body": "نراجع الشحنة والموانئ وموعد الوصول المطلوب."},
                {"title": "الناقل والحجز", "body": "نحجز المساحة أو السفينة ونعدّ المستندات."},
                {"title": "الرحلة البحرية", "body": "متابعة الشحنة من التحميل حتى الوصول إلى الميناء."},
                {"title": "التخليص والتسليم", "body": "تنسيق التخليص الجمركي والنقل البري إلى الوجهة."},
            ],
            "topic": "الشحن البحري",
        },
    },
    "lclShipments": {
        "en": {
            "title": "LCL shipments:\n*share the container*",
            "body": [
                "When your cargo does not fill a container, less-than-container-load (LCL) shipping lets it travel in shared space and pay for the volume it uses.",
                "Namma coordinates consolidation at origin, the sea leg, and deconsolidation, clearance and delivery at destination.",
            ],
            "includedTitle": "Smaller shipments,\n*handled with care*",
            "included": [
                {"title": "Consolidation", "body": "Your cargo is combined with other shipments in a shared container at origin."},
                {"title": "Volume-based space", "body": "Space is arranged around the volume and weight of the cargo that is moving."},
                {"title": "Deconsolidation", "body": "Cargo is separated from the shared container after arrival."},
                {"title": "Onward delivery", "body": "Clearance and delivery to your site or warehouse are coordinated."},
            ],
            "stepsTitle": "From pickup\n*to delivery*",
            "steps": [
                {"title": "Cargo details", "body": "We confirm volume, weight, packing and the required dates."},
                {"title": "Consolidation", "body": "The cargo is delivered to the consolidation point and loaded."},
                {"title": "Sea transit", "body": "The shared container moves to the destination port."},
                {"title": "Release & delivery", "body": "After deconsolidation and clearance, the cargo is delivered."},
            ],
            "topic": "LCL shipment",
        },
        "ar": {
            "title": "الشحنات الجزئية:\n*مساحة مشتركة في الحاوية*",
            "body": [
                "عندما لا تملأ شحنتك حاوية كاملة، يتيح لك الشحن الجزئي (LCL) نقلها في مساحة مشتركة ودفع تكلفة الحجم الذي تشغله فقط.",
                "تنسّق نما التجميع في بلد المنشأ، والرحلة البحرية، ثم الفرز والتخليص والتسليم في جهة الوصول.",
            ],
            "includedTitle": "شحنات أصغر،\n*بعناية كاملة*",
            "included": [
                {"title": "التجميع", "body": "تُجمع شحنتك مع شحنات أخرى في حاوية مشتركة في بلد المنشأ."},
                {"title": "مساحة حسب الحجم", "body": "تُرتَّب المساحة وفق حجم الشحنة ووزنها."},
                {"title": "الفرز", "body": "تُفصل الشحنة عن الحاوية المشتركة بعد الوصول."},
                {"title": "التسليم", "body": "تنسيق التخليص والتسليم إلى موقعك أو مستودعك."},
            ],
            "stepsTitle": "من الاستلام\n*حتى التسليم*",
            "steps": [
                {"title": "تفاصيل الشحنة", "body": "نؤكد الحجم والوزن والتغليف والمواعيد المطلوبة."},
                {"title": "التجميع", "body": "تُسلَّم الشحنة إلى نقطة التجميع وتُحمَّل."},
                {"title": "الرحلة البحرية", "body": "تنتقل الحاوية المشتركة إلى ميناء الوصول."},
                {"title": "الإفراج والتسليم", "body": "بعد الفرز والتخليص تُسلَّم الشحنة."},
            ],
            "topic": "الشحنات الجزئية",
        },
    },
    "roadFreight": {
        "en": {
            "title": "Road freight\n*across the Kingdom\nand its borders*",
            "body": [
                "Road freight connects ports, factories, warehouses and project sites within Saudi Arabia and across the GCC and neighbouring countries.",
                "Namma arranges the trucks and trailers for the cargo, plans the route and coordinates border formalities on cross-border journeys.",
            ],
            "includedTitle": "Road freight,\n*planned around the route*",
            "included": [
                {"title": "Domestic road freight", "body": "Full and part loads between cities, ports and sites in Saudi Arabia."},
                {"title": "Cross-border trucking", "body": "Road journeys to and from the GCC and neighbouring countries."},
                {"title": "Border formalities", "body": "Documents and customs steps at the border, coordinated in advance."},
                {"title": "Suited equipment", "body": "Trucks and trailers selected for the cargo, its weight and dimensions."},
            ],
            "stepsTitle": "From loading\n*to destination*",
            "steps": [
                {"title": "Cargo & route", "body": "We confirm the cargo, origin, destination and dates."},
                {"title": "Equipment", "body": "The truck and trailer that fit the cargo are arranged."},
                {"title": "On the road", "body": "The journey is coordinated, including any border crossings."},
                {"title": "Delivery", "body": "Cargo is delivered and offloaded at destination."},
            ],
            "topic": "road freight",
        },
        "ar": {
            "title": "شحن بري\n*داخل المملكة\nوعبر حدودها*",
            "body": [
                "يربط الشحن البري الموانئ والمصانع والمستودعات ومواقع المشاريع داخل المملكة، ومع دول الخليج والدول المجاورة.",
                "ترتّب نما الشاحنات والمقطورات المناسبة للشحنة، وتخطط المسار، وتنسّق إجراءات العبور في الرحلات العابرة للحدود.",
            ],
            "includedTitle": "شحن بري\n*مخطط حول المسار*",
            "included": [
                {"title": "الشحن البري الداخلي", "body": "حمولات كاملة وجزئية بين المدن والموانئ والمواقع داخل المملكة."},
                {"title": "النقل البري عبر الحدود", "body": "رحلات برية من دول الخليج والدول المجاورة وإليها."},
                {"title": "إجراءات العبور", "body": "تنسيق المستندات والإجراءات الجمركية على الحدود مسبقًا."},
                {"title": "معدات مناسبة", "body": "شاحنات ومقطورات تُختار وفق الشحنة ووزنها وأبعادها."},
            ],
            "stepsTitle": "من التحميل\n*حتى الوجهة*",
            "steps": [
                {"title": "الشحنة والمسار", "body": "نؤكد الشحنة ونقطة الانطلاق والوجهة والمواعيد."},
                {"title": "المعدات", "body": "نرتّب الشاحنة والمقطورة المناسبتين للشحنة."},
                {"title": "على الطريق", "body": "تنسيق الرحلة بما في ذلك أي عبور للحدود."},
                {"title": "التسليم", "body": "تسليم الشحنة وتفريغها في الوجهة."},
            ],
            "topic": "الشحن البري",
        },
    },
    "transportation": {
        "en": {
            "title": "Transportation\n*built into your\nsupply chain*",
            "body": [
                "Within a contract logistics agreement, transportation links your warehouse to your sites, branches and customers on a planned schedule.",
                "Namma plans the routes and the vehicles around your volumes, and keeps deliveries visible from dispatch to proof of delivery.",
            ],
            "includedTitle": "Planned movement,\n*every day*",
            "included": [
                {"title": "Scheduled distribution", "body": "Regular deliveries to branches, sites and customers on agreed routes."},
                {"title": "Dedicated transport", "body": "Vehicles assigned to your operation when volumes call for it."},
                {"title": "Inter-city transport", "body": "Movements between cities and regions within the Kingdom."},
                {"title": "Delivery visibility", "body": "Dispatch, status and proof of delivery shared as goods move."},
            ],
            "stepsTitle": "From warehouse\n*to your customers*",
            "steps": [
                {"title": "Requirements", "body": "We map your volumes, destinations and delivery windows."},
                {"title": "Route plan", "body": "Routes and vehicles are planned around the schedule."},
                {"title": "Dispatch", "body": "Orders are loaded and dispatched from the warehouse."},
                {"title": "Delivery & reporting", "body": "Deliveries are confirmed and reported back to you."},
            ],
            "topic": "transportation",
        },
        "ar": {
            "title": "النقل\n*جزء من\nسلسلة إمدادك*",
            "body": [
                "ضمن اتفاقية الخدمات اللوجستية التعاقدية، يربط النقل مستودعك بمواقعك وفروعك وعملائك وفق جدول مخطط.",
                "تخطط نما المسارات والمركبات حول الكميات لديك، وتتيح متابعة التسليمات من الإرسال حتى إثبات الاستلام.",
            ],
            "includedTitle": "حركة مخططة\n*كل يوم*",
            "included": [
                {"title": "التوزيع المجدول", "body": "تسليمات منتظمة إلى الفروع والمواقع والعملاء على مسارات متفق عليها."},
                {"title": "نقل مخصص", "body": "مركبات مخصصة لعملياتك عندما تتطلب الكميات ذلك."},
                {"title": "النقل بين المدن", "body": "حركة بين المدن والمناطق داخل المملكة."},
                {"title": "متابعة التسليم", "body": "مشاركة حالة الإرسال والتسليم وإثباته أثناء حركة البضائع."},
            ],
            "stepsTitle": "من المستودع\n*إلى عملائك*",
            "steps": [
                {"title": "المتطلبات", "body": "نحدد الكميات والوجهات ونوافذ التسليم."},
                {"title": "خطة المسارات", "body": "تُخطط المسارات والمركبات حول الجدول."},
                {"title": "الإرسال", "body": "تُحمَّل الطلبات وتُرسل من المستودع."},
                {"title": "التسليم والتقارير", "body": "تأكيد التسليمات ورفع التقارير إليك."},
            ],
            "topic": "النقل",
        },
    },
    "heavyLift": {
        "en": {
            "title": "Heavy lift\n*cargo solutions*",
            "body": [
                "Heavy equipment needs lifting and transport planned around its weight, centre of gravity and the conditions at each point of the journey.",
                "Namma coordinates cranes, modular trailers and specialized providers, with the lifting and securing plan agreed before movement begins.",
            ],
            "includedTitle": "Heavy lifts,\n*engineered in advance*",
            "included": [
                {"title": "Lift planning", "body": "Lifting methods and equipment selected for the cargo's weight and dimensions."},
                {"title": "Cranes & modular trailers", "body": "Lifting equipment and multi-axle trailers arranged with specialized providers."},
                {"title": "Securing & handling", "body": "Lashing and handling planned for each stage of the movement."},
                {"title": "Site coordination", "body": "Offloading and placement coordinated with the project site."},
            ],
            "stepsTitle": "From assessment\n*to placement*",
            "steps": [
                {"title": "Cargo assessment", "body": "Weight, dimensions and lifting points are reviewed."},
                {"title": "Lift & route plan", "body": "Equipment, method and route are agreed before movement."},
                {"title": "Lift & transport", "body": "The cargo is lifted, secured and moved under supervision."},
                {"title": "Offload at site", "body": "Placement at site is coordinated with your team."},
            ],
            "topic": "heavy lift",
        },
        "ar": {
            "title": "حلول رفع\n*الشحنات الثقيلة*",
            "body": [
                "تحتاج المعدات الثقيلة إلى رفع ونقل يُخطط لهما وفق وزنها ومركز ثقلها والظروف في كل مرحلة من الرحلة.",
                "تنسّق نما الرافعات والمقطورات المعيارية ومقدمي الخدمات المتخصصين، مع الاتفاق على خطة الرفع والتثبيت قبل بدء النقل.",
            ],
            "includedTitle": "رفع ثقيل\n*مخطط مسبقًا*",
            "included": [
                {"title": "تخطيط الرفع", "body": "اختيار أساليب ومعدات الرفع وفق وزن الشحنة وأبعادها."},
                {"title": "الرافعات والمقطورات المعيارية", "body": "ترتيب معدات الرفع والمقطورات متعددة المحاور مع مقدمي خدمات متخصصين."},
                {"title": "التثبيت والمناولة", "body": "تخطيط الربط والمناولة لكل مرحلة من مراحل النقل."},
                {"title": "التنسيق مع الموقع", "body": "تنسيق التفريغ والتركيز في موقع المشروع."},
            ],
            "stepsTitle": "من التقييم\n*حتى التركيز*",
            "steps": [
                {"title": "تقييم الشحنة", "body": "مراجعة الوزن والأبعاد ونقاط الرفع."},
                {"title": "خطة الرفع والمسار", "body": "الاتفاق على المعدات والأسلوب والمسار قبل النقل."},
                {"title": "الرفع والنقل", "body": "رفع الشحنة وتثبيتها ونقلها تحت الإشراف."},
                {"title": "التفريغ في الموقع", "body": "تنسيق التركيز في الموقع مع فريقك."},
            ],
            "topic": "رفع الشحنات الثقيلة",
        },
    },
    "oversizedCargo": {
        "en": {
            "title": "Oversized cargo\n*transport*",
            "body": [
                "Out-of-gauge cargo is wider, taller or longer than standard transport allows, so every route has to be surveyed and permitted before it moves.",
                "Namma plans the route, the permits and the escorts, and coordinates the transport with authorities and the receiving site.",
            ],
            "includedTitle": "Out-of-gauge,\n*on a planned route*",
            "included": [
                {"title": "Route surveys", "body": "Bridges, turns, utilities and road conditions checked along the route."},
                {"title": "Permits", "body": "Movement permits arranged with the relevant authorities."},
                {"title": "Escorts", "body": "Escort and traffic arrangements for the journey where required."},
                {"title": "Specialized trailers", "body": "Low-bed, extendable and modular trailers matched to the cargo."},
            ],
            "stepsTitle": "From survey\n*to site*",
            "steps": [
                {"title": "Dimensions", "body": "We confirm the cargo's size, weight and loading points."},
                {"title": "Route & permits", "body": "The route is surveyed and the permits arranged."},
                {"title": "Movement", "body": "The cargo moves with escorts on the approved route."},
                {"title": "Arrival", "body": "Offloading is coordinated with the receiving site."},
            ],
            "topic": "oversized cargo",
        },
        "ar": {
            "title": "نقل الشحنات\n*كبيرة الحجم*",
            "body": [
                "الشحنات الخارجة عن المقاسات أعرض أو أعلى أو أطول مما يسمح به النقل المعتاد، لذلك يجب مسح كل مسار واستخراج تصاريحه قبل النقل.",
                "تخطط نما المسار والتصاريح والمرافقة، وتنسّق النقل مع الجهات المختصة والموقع المستلم.",
            ],
            "includedTitle": "خارج المقاسات،\n*على مسار مخطط*",
            "included": [
                {"title": "مسح المسارات", "body": "فحص الجسور والمنعطفات والمرافق وحالة الطرق على طول المسار."},
                {"title": "التصاريح", "body": "استخراج تصاريح الحركة من الجهات المختصة."},
                {"title": "المرافقة", "body": "ترتيبات المرافقة والمرور خلال الرحلة عند الحاجة."},
                {"title": "مقطورات متخصصة", "body": "مقطورات منخفضة وقابلة للتمديد ومعيارية تناسب الشحنة."},
            ],
            "stepsTitle": "من المسح\n*حتى الموقع*",
            "steps": [
                {"title": "الأبعاد", "body": "نؤكد حجم الشحنة ووزنها ونقاط تحميلها."},
                {"title": "المسار والتصاريح", "body": "مسح المسار واستخراج التصاريح."},
                {"title": "النقل", "body": "تتحرك الشحنة مع المرافقة على المسار المعتمد."},
                {"title": "الوصول", "body": "تنسيق التفريغ مع الموقع المستلم."},
            ],
            "topic": "الشحنات كبيرة الحجم",
        },
    },
}

DESC = {
    "en": {
        "airFreight": "Scheduled and charter air cargo for time-critical shipments.",
        "seaFreight": "Full containers, breakbulk and project cargo by sea.",
        "lclShipments": "Shared container space for smaller sea shipments.",
        "roadFreight": "Domestic, GCC and cross-border road freight.",
        "transportation": "Planned distribution and dedicated transport across the Kingdom.",
        "heavyLift": "Lifting and moving heavy equipment with engineered planning.",
        "oversizedCargo": "Out-of-gauge cargo moved with route surveys and permits.",
    },
    "ar": {
        "airFreight": "شحن جوي مجدول ومستأجر للشحنات العاجلة.",
        "seaFreight": "حاويات كاملة وبضائع سائبة وبضائع مشاريع عبر البحر.",
        "lclShipments": "مساحة مشتركة في الحاويات للشحنات البحرية الأصغر.",
        "roadFreight": "شحن بري داخل المملكة وإلى دول الخليج وعبر الحدود.",
        "transportation": "نقل وتوزيع مخطط داخل المملكة.",
        "heavyLift": "رفع ونقل المعدات الثقيلة بتخطيط هندسي.",
        "oversizedCargo": "نقل الشحنات الخارجة عن المقاسات مع مسح المسارات والتصاريح.",
    },
}

HUBS = {
    "en": {"threePl.eyebrow": "Contract logistics solutions", "packing.eyebrow": "Value-added services"},
    "ar": {"threePl.eyebrow": "حلول الخدمات اللوجستية التعاقدية", "packing.eyebrow": "خدمات القيمة المضافة"},
}

for lang in ("en", "ar"):
    path = f"messages/{lang}.json"
    d = json.load(open(path, encoding="utf-8"))
    sp = d["solutionPages"]
    sp["serviceDetail"] = COMMON[lang]
    for key, copy in PAGES.items():
        sp[key] = copy[lang]
    sp["common"]["serviceDesc"].update(DESC[lang])
    for k in ("dutyExemption", "airSeaChartering"):
        sp["common"]["serviceDesc"].pop(k, None)
    for dotted, value in HUBS[lang].items():
        page, field = dotted.split(".")
        sp[page][field] = value
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(path, "a", encoding="utf-8").write("\n")
print("service copy added")
