import type { RouteKey } from "@/lib/routes";

const img = (n: string) => `/assets/namma/images/projects/${n}.webp`;

export type ProjectCategory = "petrochemical" | "industrialMining" | "oilGas" | "otherCargo" | "powerWater" | "infrastructure";
export type ServiceKey =
  | "clearance"
  | "clearanceTransport"
  | "doorToDoor"
  | "doorToDoorForwarding"
  | "doorToDoorProject"
  | "dutyClearanceTransport"
  | "dutyRefund"
  | "importClearanceTransport"
  | "logisticsWarehousing"
  | "personalEffects"
  | "warehousing";
export type SiteKey =
  | "ainDar"
  | "aramcoSites"
  | "berri"
  | "dammam"
  | "dhahran"
  | "fadhili"
  | "ghazlan"
  | "haradh"
  | "hawiyah"
  | "hummaiya"
  | "jafurah"
  | "jeddah"
  | "juaymah"
  | "jubail"
  | "jubailKsa"
  | "jubailPorts"
  | "khafji"
  | "khursaniyah"
  | "ksa"
  | "makkah"
  | "mina"
  | "nairiyah"
  | "najran"
  | "qatif"
  | "qurayyah"
  | "rabigh"
  | "rasAlKhair"
  | "rasAlZour"
  | "rasTanura"
  | "riyadh"
  | "riyadhDhahran"
  | "shaybah"
  | "shedgum"
  | "shuaibah"
  | "tanajib"
  | "udhailiyah"
  | "uthShedJua"
  | "uthmaniyah"
  | "yanbu";

/**
 * Completed projects list (table on /projects and /projects/all) — all 146 rows of the
 * client's "List of Completed Projects (Jan 2024)". Names are kept as recorded; sites and
 * services are normalised to keys so they translate. `category` is our grouping of the
 * list's "Type of project" column (see docs/REVIEW.md). `client` groups "More projects
 * with …"; `page` links a row to its project page.
 */
export type ProjectRow = {
  id: string;
  name: string; // contract name as recorded (kept in English in both languages)
  short: string; // short label for charts / cards
  year: string; // completing year
  site: SiteKey;
  services: ServiceKey;
  volume: number | null; // freight tons; null when the list records something else
  volumeNote?: { key: "lineItems" | "shipmentsMonthly" | "notRecorded"; n: number };
  category: ProjectCategory;
  client?: string;
  page?: RouteKey;
};

export const ALL_PROJECT_ROWS: ProjectRow[] = [
  { id: "apoc-advanced-polyolefins-industry-company-2022", name: "APOC (ADVANCED POLYOLEFINS INDUSTRY COMPANY)", short: "APOC (ADVANCED POLYOLEFINS INDUSTRY COMPANY)", year: "2022", site: "jubail", services: "importClearanceTransport", volume: 50_000, category: "petrochemical" },
  { id: "sabic-2017", name: "SABIC KSA – 2017 DOOR to DOOR FREIGHT FORWARDING Project, through DHL Global Forwarding Industrial Projects", short: "SABIC KSA – 2017 Door to Door", year: "2024", site: "jubailKsa", services: "dutyClearanceTransport", volume: 4_000_000, category: "petrochemical", client: "sabic" },
  { id: "parts-2021", name: "PARTS Project for RSAF (ROYAL SAUDI AIR FORCE)", short: "PARTS", year: "2021", site: "dhahran", services: "importClearanceTransport", volume: 15_000, category: "infrastructure" },
  { id: "american-consulate-general-dhahran-2020", name: "AMERICAN CONSULATE GENERAL – DHAHRAN Project for DGF TURKEY / ENKA / CADDELL", short: "AMERICAN CONSULATE GENERAL – DHAHRAN", year: "2020", site: "dhahran", services: "importClearanceTransport", volume: 30_000, category: "infrastructure" },
  { id: "riyadh-metro-2019", name: "Riyadh Metro Project for DHL USA / BOMBARDIER", short: "Riyadh Metro", year: "2019", site: "riyadh", services: "importClearanceTransport", volume: 20_000, category: "infrastructure" },
  { id: "petro-rabigh-kt-2019", name: "PETRO RABIGH KT Project", short: "PETRO RABIGH KT", year: "2019", site: "jubailKsa", services: "importClearanceTransport", volume: 40_000, category: "petrochemical" },
  { id: "saudi-aramco-fadhili-ipp-2019", name: "Saudi ARAMCO Fadhili IPP Project for DOOSAN / FPCC / GLONET", short: "Saudi ARAMCO Fadhili IPP", year: "2019", site: "fadhili", services: "dutyRefund", volume: null, volumeNote: { key: "lineItems", n: 1000 }, category: "powerWater", client: "aramco" },
  { id: "jafurah-etf-2018", name: "JAFURAH ETF Project for SAUDI ARAMCO / CAMERON AL RUSHAID", short: "JAFURAH ETF", year: "2018", site: "jafurah", services: "clearanceTransport", volume: 35_000, category: "oilGas", client: "aramco" },
  { id: "petrokemya-2018", name: "PETROKEMYA Project for DGF IP China / TCC", short: "PETROKEMYA", year: "2018", site: "jubailPorts", services: "clearanceTransport", volume: 50_000, category: "petrochemical", client: "sabic" },
  { id: "ibn-sina-pom-2018", name: "IBN SINA - POM Project through DRAGADOS GULF / INTECSA", short: "IBN SINA - POM", year: "2018", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical", client: "sabic" },
  { id: "riyadh-metro-impregilo-2018", name: "Riyadh Metro Impregilo", short: "Riyadh Metro Impregilo", year: "2018", site: "riyadh", services: "clearanceTransport", volume: 150_000, category: "infrastructure" },
  { id: "sabic-samac", name: "SABIC SAMAC Project for CTCI", short: "SABIC SAMAC", year: "2018", site: "jubail", services: "dutyClearanceTransport", volume: 250_000, category: "petrochemical", client: "sabic" },
  { id: "saudi-arabian-railway-company-sar-2017", name: "SAUDI ARABIAN RAILWAY Company (SAR) through PROGRESSRAIL / DHL US", short: "SAUDI ARABIAN RAILWAY Company (SAR)", year: "2017", site: "nairiyah", services: "clearanceTransport", volume: null, volumeNote: { key: "notRecorded", n: 0 }, category: "infrastructure" },
  { id: "maaden-rolling-mill-cru-2017", name: "Ma’aden Rolling Mill CRU Project through Fluor / ALCOA", short: "Ma’aden Rolling Mill CRU", year: "2017", site: "rasAlKhair", services: "clearanceTransport", volume: null, volumeNote: { key: "notRecorded", n: 0 }, category: "industrialMining", client: "maaden" },
  { id: "sabtank-pcq-2-2017", name: "Sabtank PCQ-2 Project thru DHL Supply Chain China", short: "Sabtank PCQ-2", year: "2017", site: "jubail", services: "doorToDoor", volume: 100_000, category: "petrochemical", client: "sabic" },
  { id: "hp-ldpe-plant-2016", name: "HP-LDPE Plant for SADARA for Tecnimont", short: "HP-LDPE Plant", year: "2016", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical" },
  { id: "hp-sadara-2016", name: "HP SADARA Project for Jacob Engg. Belgium through DHL", short: "HP SADARA", year: "2016", site: "jubail", services: "doorToDoor", volume: 100_000, category: "petrochemical" },
  { id: "sadara-2016", name: "SADARA Project for Jacob Engg UK through DHL", short: "SADARA", year: "2016", site: "jubail", services: "doorToDoor", volume: 150_000, category: "petrochemical" },
  { id: "saudi-elastomers-2016", name: "Saudi Elastomers Project for Kemya for Tecnicas Reunidas", short: "Saudi Elastomers", year: "2016", site: "jubail", services: "clearance", volume: 75_000, category: "petrochemical", client: "sabic" },
  { id: "safco-v-urea-amonia-2016", name: "SAFCO-V Urea & Amonia Project for Snamprogetti", short: "SAFCO-V Urea & Amonia", year: "2016", site: "jubail", services: "clearanceTransport", volume: 150_000, category: "petrochemical", client: "sabic" },
  { id: "maaden-gold", name: "Ma’aden Gold Project for DaeWoo Logistics Corporation Korea", short: "Ma’aden Gold", year: "2014", site: "hummaiya", services: "clearanceTransport", volume: 75_000, category: "industrialMining", client: "maaden" },
  { id: "sabic-affiliates-replacement-of-reactors-2013", name: "SABIC Affiliates Replacement of Reactors for INTECSA INDUSTRIAL Spain", short: "SABIC Affiliates Replacement of Reactors", year: "2013", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical", client: "sabic" },
  { id: "fluors-auto-sheet-2013", name: "Fluor’s Auto Sheet Project for Ma’aden", short: "Fluor’s Auto Sheet", year: "2013", site: "rasAlKhair", services: "doorToDoor", volume: 75_000, category: "industrialMining", client: "maaden" },
  { id: "sadara-tank-farm-project-inside-port-2013", name: "SADARA Tank Farm Project (inside Port) for ACBI", short: "SADARA Tank Farm Project (inside Port)", year: "2013", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical" },
  { id: "larsen-toubro-construction-package-2013", name: "Larsen & Toubro Construction Package for Ethylene for SADARA", short: "Larsen & Toubro Construction Package", year: "2013", site: "jubail", services: "clearanceTransport", volume: 15_000, category: "petrochemical" },
  { id: "petrokemya-abs-2013", name: "Petrokemya ABS Project for Technicas Reundas", short: "Petrokemya ABS", year: "2013", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical", client: "sabic" },
  { id: "tihama-co-generation-expansion-plant-2013", name: "Tihama Co-Generation Expansion Plant for Hyundai Heavy Industries", short: "Tihama Co-Generation Expansion Plant", year: "2013", site: "uthShedJua", services: "clearanceTransport", volume: 75_000, category: "powerWater" },
  { id: "maaden-steam-plant-2013", name: "Ma’aden Steam Plant Project for Samsung", short: "Ma’aden Steam Plant", year: "2013", site: "rasAlKhair", services: "clearanceTransport", volume: 20_000, category: "industrialMining", client: "maaden" },
  { id: "maaden-bauxite", name: "Ma’aden Bauxite for Hyundai E&C", short: "Ma’aden Bauxite", year: "2012", site: "rasAlKhair", services: "clearanceTransport", volume: 150_000, category: "industrialMining", client: "maaden" },
  { id: "sadara-tank-farm-2012", name: "SADARA Tank Farm Project for Daewoo E&C Co. Ltd.", short: "SADARA Tank Farm", year: "2012", site: "jubail", services: "clearanceTransport", volume: 150_000, category: "petrochemical" },
  { id: "maaden-smelter-port-facility-silos-2012", name: "Ma’aden Smelter Port Facility & Silos Project", short: "Ma’aden Smelter Port Facility & Silos", year: "2012", site: "rasAlKhair", services: "clearanceTransport", volume: 3_500, category: "industrialMining", client: "maaden" },
  { id: "maaden-aluminium-cast-house-2012", name: "Ma’aden Aluminium Cast House Project", short: "Ma’aden Aluminium Cast House", year: "2012", site: "rasAlKhair", services: "clearanceTransport", volume: 18_000, category: "industrialMining", client: "maaden" },
  { id: "maaden-rolling", name: "Ma’aden Rolling Project", short: "Ma’aden Rolling", year: "2012", site: "rasAlKhair", services: "clearanceTransport", volume: 135_000, category: "industrialMining", client: "maaden" },
  { id: "pet-project-yansab-2011", name: "PET Project(Yansab) through DHL China", short: "PET Project(Yansab)", year: "2011", site: "yanbu", services: "clearanceTransport", volume: 5_000, category: "petrochemical", client: "sabic" },
  { id: "satorp-project-package-5a-offsites-utilities-2010", name: "SATORP Project, Package 5A (Offsites & Utilities) for TECHNIP", short: "SATORP Project, Package 5A (Offsites & Utilities)", year: "2010", site: "jubail", services: "doorToDoor", volume: 125_000, category: "oilGas" },
  { id: "ras-al-zour", name: "Ras Al-Zour Aluminium Smelter Project for MA’ADEN/BECHTEL", short: "Ras Al-Zour Aluminium Smelter", year: "2010", site: "rasAlZour", services: "clearanceTransport", volume: 800_000, category: "industrialMining", client: "maaden", page: "rasAlZour" },
  { id: "maaden-phosphate-plant-2010", name: "Ma’aden Phosphate Plant Project for LITWIN", short: "Ma’aden Phosphate Plant", year: "2010", site: "rasAlZour", services: "clearanceTransport", volume: 50_000, category: "industrialMining", client: "maaden" },
  { id: "maaden-phosphate-power-desalination-plant-2010", name: "Ma’aden Phosphate, Power & Desalination Plant Project for Hanwha", short: "Ma’aden Phosphate, Power & Desalination Plant", year: "2010", site: "rasAlZour", services: "clearanceTransport", volume: 65_000, category: "industrialMining", client: "maaden" },
  { id: "ras-tanura-dht-2010", name: "Ras Tanura DHT Project for Samsung/Aramco", short: "Ras Tanura DHT", year: "2010", site: "rasTanura", services: "clearanceTransport", volume: 50_000, category: "oilGas", client: "aramco" },
  { id: "saudi-kayan-amines-2010", name: "Saudi Kayan Amines for Samsung Engg. Co.Ltd.,", short: "Saudi Kayan Amines", year: "2010", site: "jubail", services: "clearanceTransport", volume: 70_000, category: "petrochemical", client: "sabic" },
  { id: "aac-ethylene-amines-2010", name: "AAC Ethylene Amines Project for HANHWA Engg.Co.", short: "AAC Ethylene Amines", year: "2010", site: "jubail", services: "clearanceTransport", volume: 70_000, category: "petrochemical" },
  { id: "maaden-ammonia", name: "MAADEN Amonia Plant Project for SAMSUNG Engg.Co.Ltd.", short: "Ma’aden Ammonia Plant", year: "2010", site: "jubail", services: "clearanceTransport", volume: 150_000, category: "industrialMining", client: "maaden" },
  { id: "marafiq", name: "Marafiq IWPP-I Project for Hyundai Heavy Industries", short: "Marafiq IWPP-I", year: "2009", site: "jubail", services: "clearanceTransport", volume: 370_000, category: "powerWater" },
  { id: "saudi-kayan-pp-pdh-2009", name: "Saudi Kayan PP/PDH for Samsung Engg.Co.Ltd.", short: "Saudi Kayan PP/PDH", year: "2009", site: "jubail", services: "clearanceTransport", volume: 115_000, category: "petrochemical", client: "sabic" },
  { id: "saudi-kayan-cracker", name: "Saudi Kayan Craker Plant for KBR", short: "Saudi Kayan Cracker Plant", year: "2009", site: "jubail", services: "clearanceTransport", volume: 250_000, category: "petrochemical", client: "sabic" },
  { id: "ncp-worley-parson-2009", name: "NCP/Worley Parson", short: "NCP/Worley Parson", year: "2009", site: "jubail", services: "doorToDoor", volume: 35_000, category: "petrochemical" },
  { id: "nesma-al-masane-2009", name: "Nesma Al-Masane Project", short: "Nesma Al-Masane", year: "2009", site: "najran", services: "clearanceTransport", volume: 35_000, category: "industrialMining" },
  { id: "mitsubishi-quarayyah-rehabilitation-2009", name: "Mitsubishi Quarayyah Rehabilitation Project for Aramco", short: "Mitsubishi Quarayyah Rehabilitation", year: "2009", site: "qurayyah", services: "clearanceTransport", volume: 10_000, category: "oilGas", client: "aramco" },
  { id: "saudi-kayan-amines-2008", name: "Saudi Kayan Amines for Samsung Engg. Co.Ltd.,", short: "Saudi Kayan Amines", year: "2008", site: "jubail", services: "clearanceTransport", volume: 70_000, category: "petrochemical", client: "sabic" },
  { id: "aac-ethylene-amines-2008", name: "AAC Ethylene Amines Project for HANHWA Engg.Co.", short: "AAC Ethylene Amines", year: "2008", site: "jubail", services: "clearanceTransport", volume: 70_000, category: "petrochemical" },
  { id: "mitsubishi-quarayyah-rehabilitation-2008", name: "Mitsubishi Quarayyah Rehabilitation Project for Aramco", short: "Mitsubishi Quarayyah Rehabilitation", year: "2008", site: "qurayyah", services: "clearanceTransport", volume: 10_000, category: "powerWater", client: "aramco" },
  { id: "shaybah-pgp-2007", name: "Shaybah PGP Project", short: "Shaybah PGP", year: "2007", site: "shaybah", services: "clearanceTransport", volume: 20_000, category: "oilGas" },
  { id: "ethylene-oxide-ethylene-glycol-2007", name: "Ethylene Oxide & Ethylene Glycol Project for CTCI", short: "Ethylene Oxide & Ethylene Glycol", year: "2007", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical" },
  { id: "ibn-zahr-pp-iii-and-oct-projects-2007", name: "IBN ZAHR PP-III and OCT Projects for SAMSUNG", short: "IBN ZAHR PP-III and OCT Projects", year: "2007", site: "jubail", services: "clearanceTransport", volume: 150_000, category: "petrochemical", client: "sabic" },
  { id: "qurayyah-seawater-plant-2007", name: "Qurayyah Seawater Plant Project for Snamprogetti for ARAMCO", short: "Qurayyah Seawater Plant", year: "2007", site: "qurayyah", services: "clearanceTransport", volume: 30_000, category: "powerWater", client: "aramco" },
  { id: "juaymah-gas-plant-2006", name: "Ju’aymah Gas Plant Project for Technical Reunidas INITEC", short: "Ju’aymah Gas Plant", year: "2006", site: "juaymah", services: "clearanceTransport", volume: 100_000, category: "oilGas" },
  { id: "ar-razi-v-2006", name: "AR-RAZI-V Project for Mitsubishi", short: "AR-RAZI-V", year: "2006", site: "jubail", services: "clearanceTransport", volume: 85_000, category: "petrochemical", client: "sabic" },
  { id: "appc-pdh-pp-2006", name: "APPC PDH/PP Project for Samsung", short: "APPC PDH/PP", year: "2006", site: "jubail", services: "clearanceTransport", volume: 85_000, category: "petrochemical" },
  { id: "tasnee-petrochemical-ethylen-2006", name: "Tasnee Petrochemical Ethylen Project for Samsung", short: "Tasnee Petrochemical Ethylen", year: "2006", site: "jubail", services: "clearanceTransport", volume: 150_000, category: "petrochemical" },
  { id: "sharq-3rd-expansion-2006", name: "SHARQ 3rd Expansion Project for Samsung", short: "SHARQ 3rd Expansion", year: "2006", site: "jubail", services: "clearanceTransport", volume: 95_000, category: "petrochemical", client: "sabic" },
  { id: "khursaniyah", name: "Khursaniyah Producing Facilities – GOSP & Utilities Project for Snamprogetti", short: "Khursaniyah GOSP & Utilities", year: "2006", site: "khursaniyah", services: "clearanceTransport", volume: 200_000, category: "oilGas" },
  { id: "hawiyah-ngl-recovery-plant-2006", name: "Hawiyah NGL Recovery Plant Project", short: "Hawiyah NGL Recovery Plant", year: "2006", site: "hawiyah", services: "clearanceTransport", volume: 57_000, category: "oilGas" },
  { id: "yansab-olefins-2006", name: "YANSAB Olefins Project for AkerKvaerner/SINOPAC", short: "YANSAB Olefins", year: "2006", site: "yanbu", services: "clearanceTransport", volume: 125_000, category: "petrochemical", client: "sabic" },
  { id: "petrorabigh-u-o-2006", name: "PetroRabigh U&O Project", short: "PetroRabigh U&O", year: "2006", site: "rabigh", services: "clearanceTransport", volume: 30_000, category: "petrochemical" },
  { id: "munshaat-hotel-2006", name: "Munshaat Hotel Project for Munshaat Projects & Contracting Co.(WLL)", short: "Munshaat Hotel", year: "2006", site: "makkah", services: "warehousing", volume: 50_000, category: "otherCargo" },
  { id: "huawei-tech-2006", name: "Huawei Tech. for STC & Mobily", short: "Huawei Tech", year: "2006", site: "riyadh", services: "warehousing", volume: 30_000, category: "otherCargo" },
  { id: "motorola-2006", name: "Motorola for Mobily", short: "Motorola", year: "2006", site: "riyadh", services: "clearanceTransport", volume: 25_000, category: "otherCargo" },
  { id: "jgc-jcp", name: "JGC/JCP Project for Jubail Chevron Phillips Co./Saudi Chevron Phillis Co.", short: "JGC/JCP Chevron Phillips", year: "2005", site: "jubail", services: "clearanceTransport", volume: 250_000, category: "petrochemical" },
  { id: "erricssion-2005", name: "Erricssion for STC & Mobily Project", short: "Erricssion", year: "2005", site: "riyadh", services: "warehousing", volume: 25_000, category: "otherCargo" },
  { id: "nokia-stc-expansion-project-2001", name: "NOKIA (STC Expansion Project)", short: "NOKIA (STC Expansion Project)", year: "2001", site: "ksa", services: "warehousing", volume: 150_000, category: "otherCargo" },
  { id: "hawiyah-ngl-recovery-plant-2008", name: "Hawiyah NGL Recovery Plant Project", short: "Hawiyah NGL Recovery Plant", year: "2008", site: "hawiyah", services: "clearanceTransport", volume: 57_000, category: "oilGas" },
  { id: "juaymah-gas-plant-2008", name: "Ju’aymah Gas Plant Project for Tecnicas Reunidas", short: "Ju’aymah Gas Plant", year: "2008", site: "juaymah", services: "clearanceTransport", volume: 100_000, category: "oilGas" },
  { id: "appc-pdh-pp-2008", name: "APPC PDH/PP Project for Samsung", short: "APPC PDH/PP", year: "2008", site: "jubail", services: "clearanceTransport", volume: 85_000, category: "petrochemical" },
  { id: "saudi-chevron-phillips-brown-field-expansion-2007", name: "Saudi Chevron Phillips’ Brown Field Expansion Project", short: "Saudi Chevron Phillips’ Brown Field Expansion", year: "2007", site: "jubail", services: "doorToDoor", volume: 30_000, category: "petrochemical" },
  { id: "aramco-cogen", name: "Saudi Aramco 3rd Party Co-Generation Program", short: "Saudi Aramco 3rd Party Co-Generation", year: "2006", site: "aramcoSites", services: "clearanceTransport", volume: 185_000, category: "powerWater", client: "aramco" },
  { id: "unicoil-crm-cgl-2005", name: "Unicoil CRM/CGL Project", short: "Unicoil CRM/CGL", year: "2005", site: "jubail", services: "clearanceTransport", volume: 30_000, category: "industrialMining" },
  { id: "uhde-safco-iv-ufc-2005", name: "UHDE Safco IV UFC Project", short: "UHDE Safco IV UFC", year: "2005", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "petrochemical", client: "sabic" },
  { id: "hindustan-construction-company-project-with-king-2005", name: "Hindustan Construction Company Project With King Abdul Aziz Naval Base for Kaanb Piers Restoration Project.", short: "Hindustan Construction Company Project With King Abdul Aziz Naval Base", year: "2005", site: "jubail", services: "clearanceTransport", volume: 5_000, category: "infrastructure" },
  { id: "gulf-farabi-snc-lavalin-n-paraffins-lab-2005", name: "Gulf Farabi/SNC Lavalin N-Paraffins & LAB Project", short: "Gulf Farabi/SNC Lavalin N-Paraffins & LAB", year: "2005", site: "jubail", services: "doorToDoor", volume: 65_000, category: "petrochemical" },
  { id: "technip-holland-albayroni-2005", name: "Technip Holland ALBAYRONI Project", short: "Technip Holland ALBAYRONI", year: "2005", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "petrochemical" },
  { id: "hrm-2005", name: "HRM Project for HADEED", short: "HRM", year: "2005", site: "jubail", services: "clearanceTransport", volume: 15_000, category: "industrialMining", client: "sabic" },
  { id: "jupc-liner-alpha-olefins-2005", name: "JUPC Liner Alpha Olefins Project", short: "JUPC Liner Alpha Olefins", year: "2005", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "petrochemical", client: "sabic" },
  { id: "technip-holland-kemya-2005", name: "Technip Holland KEMYA Project", short: "Technip Holland KEMYA", year: "2005", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "petrochemical", client: "sabic" },
  { id: "aramco-dht-complex-riyadh-refinery-2004", name: "Aramco DHT Complex - Riyadh Refinery For Technip Italy", short: "Aramco DHT Complex - Riyadh Refinery", year: "2004", site: "riyadh", services: "clearanceTransport", volume: 50_000, category: "oilGas", client: "aramco" },
  { id: "saudi-aramco-berry-gas-plant-2004", name: "Saudi Aramco Berry Gas Plant For Technip Italy", short: "Saudi Aramco Berry Gas Plant", year: "2004", site: "berri", services: "clearanceTransport", volume: 25_000, category: "oilGas", client: "aramco" },
  { id: "sipc-gacic-bdo-plant-in-jubail-2004", name: "SIPC GACIC BDO Plant in Jubail for Aker Kvaerner", short: "SIPC GACIC BDO Plant in Jubail", year: "2004", site: "jubail", services: "clearanceTransport", volume: 50_000, category: "petrochemical" },
  { id: "snamprogettis-seawater-conversion-2004", name: "Snamprogetti’s Seawater Conversion Project for Aramco.", short: "Snamprogetti’s Seawater Conversion", year: "2004", site: "ainDar", services: "clearanceTransport", volume: 25_000, category: "powerWater", client: "aramco" },
  { id: "sipc-saudi-methanol-smj-project-jubail-plant-2003", name: "SIPC Saudi Methanol(SMJ Project) Jubail Plant for Chiyoda Petrostar Ltd.", short: "SIPC Saudi Methanol(SMJ Project) Jubail Plant", year: "2003", site: "jubail", services: "clearanceTransport", volume: 100_000, category: "petrochemical" },
  { id: "snamprogettis-ibn-zahr-mtbe-iii-dbn-raffinate-i-2004", name: "Snamprogetti’s IBN Zahr MTBE III – DBN & Raffinate I and Pipe Line Project for SABIC", short: "Snamprogetti’s IBN Zahr MTBE III – DBN & Raffinate I and Pipe Line", year: "2004", site: "jubail", services: "clearanceTransport", volume: 15_000, category: "petrochemical", client: "sabic" },
  { id: "petrokemya-butene-1-project-in-jubail-2004", name: "Petrokemya Butene 1 Project in Jubail for Samsung, Korea", short: "Petrokemya Butene 1 Project in Jubail", year: "2004", site: "jubail", services: "clearanceTransport", volume: 15_000, category: "petrochemical", client: "sabic" },
  { id: "caustic-soda-plant-2004", name: "Caustic Soda Plant Project for Basic Chemical Industries(BCI) in Dammam", short: "Caustic Soda Plant", year: "2004", site: "dammam", services: "clearanceTransport", volume: 10_000, category: "petrochemical" },
  { id: "hadeed-vaccum-degasser-project-in-jubail-2004", name: "HADEED Vaccum Degasser Project in Jubail for Danieli, Italy", short: "HADEED Vaccum Degasser Project in Jubail", year: "2004", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "industrialMining", client: "sabic" },
  { id: "sipc-saudi-methanol-jubail-plant-2003", name: "SIPC Saudi Methanol Jubail Plant for Arabian Chicago Bridge Industries for Storage Tanks", short: "SIPC Saudi Methanol Jubail Plant", year: "2003", site: "jubail", services: "clearanceTransport", volume: 5_000, category: "petrochemical" },
  { id: "sipc-saudi-methanol-smj-project-jubail-plant-2003-2", name: "SIPC Saudi Methanol(SMJ Project) Jubail Plant for ABB Contracting for Power Station", short: "SIPC Saudi Methanol(SMJ Project) Jubail Plant", year: "2003", site: "jubail", services: "clearanceTransport", volume: 1_500, category: "petrochemical" },
  { id: "sipc-saudi-methanol-2003", name: "SIPC Saudi Methanol Project for S.A. Kent, Jubail", short: "SIPC Saudi Methanol", year: "2003", site: "jubail", services: "clearanceTransport", volume: 10_000, category: "petrochemical" },
  { id: "sceco-abu-safa-field-development-project-sub-sta-2003", name: "SCECO Abu Safa Field Development Project (Sub-station Portion) for Saudi Aramco’s Qatif Project", short: "SCECO Abu Safa Field Development Project (Sub-station Portion)", year: "2003", site: "juaymah", services: "clearanceTransport", volume: 10_000, category: "powerWater", client: "aramco" },
  { id: "sabic-acetic-acid-plant-2003", name: "SABIC Acetic Acid Plant Project for Technip, Italy", short: "SABIC Acetic Acid Plant", year: "2003", site: "yanbu", services: "clearanceTransport", volume: 10_000, category: "petrochemical", client: "sabic" },
  { id: "qatif-gosp", name: "Aramco Qatif GOSP Project for SNAMPROGETTI", short: "Aramco Qatif GOSP", year: "2002", site: "qatif", services: "clearanceTransport", volume: 275_000, category: "oilGas", client: "aramco", page: "qatifGosp" },
  { id: "saudi-polyolefins-pdh-pp-new-plant-2002", name: "Saudi Polyolefins PDH/PP [New Plant] Project for SAMSUNG, KOREA", short: "Saudi Polyolefins PDH/PP [New Plant]", year: "2002", site: "jubail", services: "clearanceTransport", volume: 100_000, category: "petrochemical" },
  { id: "jubail-united-petrochemical-co-ethylene-plant-2002", name: "Jubail United Petrochemical Co. Ethylene Plant Project for CHIYODA PETROSTAR", short: "Jubail United Petrochemical Co. Ethylene Plant", year: "2002", site: "jubail", services: "clearanceTransport", volume: 175_000, category: "petrochemical", client: "sabic" },
  { id: "kfupm-hs-fcc-demonstration-plant-project-rastanu-2002", name: "KFUPM HS-FCC Demonstration Plant Project, Rastanura", short: "KFUPM HS-FCC Demonstration Plant Project, Rastanura", year: "2002", site: "rasTanura", services: "clearanceTransport", volume: 5_000, category: "petrochemical" },
  { id: "future-pipe-co-2002", name: "Future Pipe Co. Project for SEC", short: "Future Pipe Co", year: "2002", site: "dammam", services: "clearanceTransport", volume: 5_000, category: "industrialMining" },
  { id: "380-kv-substation-no-9015-riyadh-2002", name: "380 KV Substation No: 9015 Riyadh for MITSUI", short: "380 KV Substation No: 9015 Riyadh", year: "2002", site: "riyadh", services: "clearanceTransport", volume: 15_000, category: "powerWater" },
  { id: "aramco-haradh-light-crude-increment-ii-2002", name: "Aramco Haradh Light Crude Increment II Project for SNAMPROGETTI", short: "Aramco Haradh Light Crude Increment II", year: "2002", site: "haradh", services: "clearanceTransport", volume: 50_000, category: "oilGas", client: "aramco" },
  { id: "aramco-rastanura-khuff-condensate-fractionation-2002", name: "Aramco Rastanura Khuff Condensate Fractionation Project for SNAMPROGETTI", short: "Aramco Rastanura Khuff Condensate Fractionation", year: "2002", site: "rasTanura", services: "clearanceTransport", volume: 50_000, category: "oilGas", client: "aramco" },
  { id: "npc-expansion-2001", name: "NPC Expansion Project for SUMITOMO CORP/SUMIKIN TRANSPORT", short: "NPC Expansion", year: "2001", site: "dammam", services: "clearanceTransport", volume: 10_000, category: "industrialMining" },
  { id: "saudi-techint-hawiya-gas-plant-2000", name: "Saudi Techint Hawiya Gas Plant Project for Inlets and Auxillary Facilities", short: "Saudi Techint Hawiya Gas Plant", year: "2000", site: "hawiyah", services: "clearanceTransport", volume: 20_000, category: "oilGas" },
  { id: "mcconnel-dowell-rastanura-dhahran-finished-produ-2000", name: "McConnel Dowell-Rastanura/Dhahran Finished Products Project", short: "McConnel Dowell-Rastanura/Dhahran Finished Products", year: "2000", site: "dhahran", services: "clearanceTransport", volume: 10_000, category: "oilGas" },
  { id: "danzas-germany-abb-power-project-shoaiba-2000", name: "DANZAS-Germany, ABB Power Project, Shoaiba", short: "DANZAS-Germany, ABB Power Project, Shoaiba", year: "2000", site: "jeddah", services: "clearanceTransport", volume: 38_000, category: "powerWater" },
  { id: "british-aerospace-1990", name: "British Aerospace", short: "British Aerospace", year: "1990", site: "riyadhDhahran", services: "personalEffects", volume: null, volumeNote: { key: "shipmentsMonthly", n: 150 }, category: "otherCargo" },
  { id: "western-geophysical-2000", name: "Western Geophysical", short: "Western Geophysical", year: "2000", site: "khafji", services: "clearanceTransport", volume: 10_000, category: "otherCargo" },
  { id: "king-faisal-foundation-al-faisaliah-center-hotel-2000", name: "King Faisal Foundation Al-Faisaliah Center [Hotel and Apartment] Project", short: "King Faisal Foundation Al-Faisaliah Center [Hotel and Apartment]", year: "2000", site: "riyadh", services: "logisticsWarehousing", volume: 40_000, category: "infrastructure" },
  { id: "ibn-zahr-pp2", name: "IBN-ZAHR PP-II Project for Parsons International, USA", short: "IBN-ZAHR PP-II", year: "1999", site: "jubail", services: "doorToDoorProject", volume: 35_000, category: "petrochemical", client: "sabic", page: "ibnZahr" },
  { id: "saudi-techint-hawiyah-gas-pipeline-1999", name: "Saudi Techint-Hawiyah Gas Pipeline Project", short: "Saudi Techint-Hawiyah Gas Pipeline", year: "1999", site: "hawiyah", services: "clearanceTransport", volume: 10_000, category: "oilGas" },
  { id: "mcconnel-dowell-riyadh-refinery-project-1999", name: "McConnel Dowell-Riyadh Refinery project", short: "McConnel Dowell-Riyadh Refinery project", year: "1999", site: "riyadh", services: "clearanceTransport", volume: 7_500, category: "oilGas" },
  { id: "eastern-petrochemical-company-sharq-1999", name: "Eastern Petrochemical Company [SHARQ]", short: "Eastern Petrochemical Company [SHARQ]", year: "1999", site: "jubail", services: "doorToDoorForwarding", volume: 10_000, category: "petrochemical", client: "sabic" },
  { id: "tecnimont-kemya-ldpe-1999", name: "Tecnimont Kemya LDPE Project", short: "Tecnimont Kemya LDPE", year: "1999", site: "jubail", services: "clearanceTransport", volume: 2_000, category: "petrochemical", client: "sabic" },
  { id: "national-gas-expansion-1999", name: "National GAS Expansion Project for Air Products, UK", short: "National GAS Expansion", year: "1999", site: "jubail", services: "clearanceTransport", volume: 25_000, category: "petrochemical" },
  { id: "sharq-second-expansion-project-cpl-ccc-1998", name: "SHARQ, Second Expansion Project, CPL/CCC", short: "SHARQ, Second Expansion Project, CPL/CCC", year: "1998", site: "jubail", services: "clearanceTransport", volume: 100_000, category: "petrochemical", client: "sabic" },
  { id: "aramco-shudgom-debottling-project-prichard-al-ba-1998", name: "Aramco Shudgom Debottling Project Prichard Al-Bassam", short: "Aramco Shudgom Debottling Project Prichard Al-Bassam", year: "1998", site: "shedgum", services: "clearanceTransport", volume: 35_000, category: "oilGas", client: "aramco" },
  { id: "petrokemya-olefins-furnace-1999", name: "Petrokemya Olefins Furnace Project for Technip/KTI", short: "Petrokemya Olefins Furnace", year: "1999", site: "jubail", services: "clearanceTransport", volume: 25_000, category: "petrochemical", client: "sabic" },
  { id: "al-sharif-kec-380-kv-overhead-transmission-line-1998", name: "AL-SHARIF KEC 380 KV Overhead Transmission Line for Ghazlan II Power Plant Project for Sceco East.", short: "AL-SHARIF KEC 380 KV Overhead Transmission Line", year: "1998", site: "ghazlan", services: "clearanceTransport", volume: 50_000, category: "powerWater" },
  { id: "saudi-chevron-petrochemical-1997", name: "Saudi Chevron Petrochemical Project for Flour/Chiyoda", short: "Saudi Chevron Petrochemical", year: "1997", site: "jubail", services: "clearanceTransport", volume: 75_000, category: "petrochemical" },
  { id: "uthmaniyah-gas-plant-expansion-1997", name: "Uthmaniyah Gas Plant Expansion Project for Al-Suwaidi", short: "Uthmaniyah Gas Plant Expansion", year: "1997", site: "uthmaniyah", services: "clearanceTransport", volume: 75_000, category: "oilGas" },
  { id: "safco-ammonia-and-urea-plant-1997", name: "SAFCO Ammonia and Urea Plant Project for Tecnimont", short: "SAFCO Ammonia and Urea Plant", year: "1997", site: "jubail", services: "clearanceTransport", volume: 50_000, category: "petrochemical", client: "sabic" },
  { id: "ralph-m-parson-1997", name: "Ralph M. Parson Project for ARAMCO", short: "Ralph M. Parson", year: "1997", site: "udhailiyah", services: "clearanceTransport", volume: 65_000, category: "oilGas", client: "aramco" },
  { id: "saudi-techint-limited-1997", name: "Saudi Techint Limited", short: "Saudi Techint Limited", year: "1997", site: "shaybah", services: "clearanceTransport", volume: 10_000, category: "oilGas" },
  { id: "rabigh-power-plant-1996", name: "Rabigh Power Plant Project for Flour Daniel", short: "Rabigh Power Plant", year: "1996", site: "rabigh", services: "clearanceTransport", volume: 35_000, category: "powerWater" },
  { id: "ibn-rushd-aromatic-pta-plant-1996", name: "IBN RUSHD AROMATIC & PTA Plant Project for Bechtel", short: "IBN RUSHD AROMATIC & PTA Plant", year: "1996", site: "yanbu", services: "clearanceTransport", volume: 25_000, category: "petrochemical", client: "sabic" },
  { id: "sabic-services-ltd-r-d-complex-1996", name: "SABIC Services Ltd. R&D Complex Project", short: "SABIC Services Ltd. R&D Complex", year: "1996", site: "riyadh", services: "doorToDoorForwarding", volume: 50_000, category: "petrochemical", client: "sabic" },
  { id: "ccc-aramco-shaybah-1996", name: "CCC-Aramco Shaybah Project", short: "CCC-Aramco Shaybah", year: "1996", site: "shaybah", services: "clearanceTransport", volume: 50_000, category: "infrastructure", client: "aramco" },
  { id: "pp9-raytheon-1996", name: "PP9 Raytheon Project", short: "PP9 Raytheon", year: "1996", site: "riyadh", services: "clearanceTransport", volume: 20_000, category: "powerWater" },
  { id: "shoiba-power-plant-1995", name: "Shoiba Power Plant Project for Bechtel", short: "Shoiba Power Plant", year: "1995", site: "shuaibah", services: "clearanceTransport", volume: 50_000, category: "powerWater" },
  { id: "sadaf-kfip-1995", name: "SADAF KFIP Project with Fluor Arabia Ltd.", short: "SADAF KFIP", year: "1995", site: "jubail", services: "clearanceTransport", volume: 80_000, category: "petrochemical", client: "sabic" },
  { id: "abb-lummus-1995", name: "ABB Lummus Project for Saudi Aramco Berri Gas", short: "ABB Lummus", year: "1995", site: "jubail", services: "clearanceTransport", volume: 70_000, category: "oilGas", client: "aramco" },
  { id: "mitsubishi-kakoki-kaisha-ltd-1995", name: "Mitsubishi Kakoki Kaisha Ltd. For SAMAD", short: "Mitsubishi Kakoki Kaisha Ltd", year: "1995", site: "jubail", services: "clearanceTransport", volume: 3_500, category: "petrochemical", client: "sabic" },
  { id: "sadaf", name: "Brown & Root SADAF Expansion Project", short: "SADAF Expansion", year: "1995", site: "jubail", services: "clearanceTransport", volume: 200_000, category: "petrochemical", client: "sabic", page: "sadafExpansion" },
  { id: "glaxo-saudi-arabia-ltd-1994", name: "Glaxo Saudi Arabia Ltd.", short: "Glaxo Saudi Arabia Ltd", year: "1994", site: "riyadh", services: "clearanceTransport", volume: 42_000, category: "petrochemical" },
  { id: "jeraisy-steelcase-furniture-plant-1994", name: "Jeraisy Steelcase Furniture Plant", short: "Jeraisy Steelcase Furniture Plant", year: "1994", site: "riyadh", services: "clearanceTransport", volume: 40_000, category: "industrialMining" },
  { id: "al-zamil-1994", name: "Al-Zamil Project for ARAMCO", short: "Al-Zamil", year: "1994", site: "dhahran", services: "doorToDoorForwarding", volume: 40_000, category: "oilGas", client: "aramco" },
  { id: "airport-clearance-1992", name: "Airport Clearance Project for all ARAMCO General Cargo to ARAMCO Multiple Sites", short: "Airport Clearance", year: "1992", site: "dhahran", services: "clearanceTransport", volume: null, volumeNote: { key: "shipmentsMonthly", n: 6000 }, category: "otherCargo", client: "aramco" },
  { id: "kemya-project-cargo-1992", name: "Kemya Project Cargo", short: "Kemya Project Cargo", year: "1992", site: "jubail", services: "clearanceTransport", volume: 20_000, category: "petrochemical", client: "sabic" },
  { id: "fluor-daniel-1991", name: "Fluor Daniel Project for ARAMCO", short: "Fluor Daniel", year: "1991", site: "tanajib", services: "clearanceTransport", volume: 80_000, category: "oilGas", client: "aramco" },
  { id: "general-dynamics-military-move-1991", name: "General Dynamics (Military Move)", short: "General Dynamics (Military Move)", year: "1991", site: "riyadh", services: "personalEffects", volume: 35_000, category: "otherCargo" },
  { id: "mina-royal-palace-complex-1991", name: "Mina Royal Palace Complex Project", short: "Mina Royal Palace Complex", year: "1991", site: "mina", services: "clearanceTransport", volume: 48_000, category: "infrastructure" },
  { id: "ballast-nedam-project-phase-vi-1991", name: "Ballast Nedam Project Phase VI", short: "Ballast Nedam Project Phase VI", year: "1991", site: "riyadh", services: "clearanceTransport", volume: 38_000, category: "infrastructure" },
];

/**
 * The projects shown on the site (table, filters, "More with …", volume chart): the 4 project
 * pages + the 16 largest recorded volumes (ties → most recent). Client request, Nov 2026.
 */
const SELECTED = [
  "ras-al-zour", "qatif-gosp", "ibn-zahr-pp2", "sadaf",
  "sabic-2017", "marafiq", "sabic-samac", "saudi-kayan-cracker", "jgc-jcp", "khursaniyah", "aramco-cogen",
  "jubail-united-petrochemical-co-ethylene-plant-2002", "riyadh-metro-impregilo-2018", "sadara-2016",
  "safco-v-urea-amonia-2016", "maaden-bauxite", "sadara-tank-farm-2012", "maaden-ammonia",
  "ibn-zahr-pp-iii-and-oct-projects-2007", "tasnee-petrochemical-ethylen-2006",
];
export const PROJECT_ROWS: ProjectRow[] = ALL_PROJECT_ROWS.filter((r) => SELECTED.includes(r.id));

/** Category order for the filter chips (Figma). */
export const CATEGORY_ORDER: ProjectCategory[] = ["petrochemical", "industrialMining", "oilGas", "otherCargo", "powerWater", "infrastructure"];

/** Total of the client's completed-projects list (hero counter) — 146. */
export const PROJECTS_TOTAL = ALL_PROJECT_ROWS.length;

/** The four projects with their own pages — featured order on /projects, prev / next order on project pages. */
export type ProjectPageKey = "rasAlZour" | "qatifGosp" | "ibnZahr" | "sadafExpansion";
export const FEATURED: ProjectPageKey[] = ["rasAlZour", "qatifGosp", "ibnZahr", "sadafExpansion"];

export type ProjectPageData = {
  key: ProjectPageKey;
  row: string; // id in PROJECT_ROWS
  year: string;
  /** Hero eyebrow wording (Figma): "Recorded project" or "Project logistics milestone". */
  eyebrow: "recorded" | "milestone";
  layout: "banner" | "split";
  heroImage: string;
  detailImage: string;
  cardImage: string;
};

export const PROJECT_PAGES: Record<ProjectPageKey, ProjectPageData> = {
  rasAlZour: { key: "rasAlZour", eyebrow: "recorded", row: "ras-al-zour", year: "2010", layout: "split", heroImage: img("ras-al-zour-hero"), detailImage: img("detail-smelter"), cardImage: img("featured-ras-al-zour") },
  qatifGosp: { key: "qatifGosp", eyebrow: "recorded", row: "qatif-gosp", year: "2002", layout: "banner", heroImage: img("qatif-hero"), detailImage: img("detail-cargo-aircraft"), cardImage: img("qatif-hero") },
  ibnZahr: { key: "ibnZahr", eyebrow: "milestone", row: "ibn-zahr-pp2", year: "1999", layout: "banner", heroImage: img("ibn-zahr-hero"), detailImage: img("detail-cargo-aircraft"), cardImage: img("ibn-zahr-hero") },
  sadafExpansion: { key: "sadafExpansion", eyebrow: "recorded", row: "sadaf", year: "1995", layout: "split", heroImage: img("sadaf-hero"), detailImage: img("detail-cargo-aircraft"), cardImage: img("sadaf-hero") },
};

export const rowById = (id: string) => PROJECT_ROWS.find((r) => r.id === id)!;
export const byVolume = (a: ProjectRow, b: ProjectRow) => (b.volume ?? -1) - (a.volume ?? -1) || a.name.localeCompare(b.name);

/** Names for the hero "wall" — every project in the list, once, in list order. */
export const PROJECT_NAMES: string[] = [...new Set(ALL_PROJECT_ROWS.map((r) => r.name))];

/** Other recorded projects for the same client, largest first. */
export const clientRows = (client: string | undefined, exclude?: string) =>
  client ? PROJECT_ROWS.filter((r) => r.client === client && r.id !== exclude).sort(byVolume) : [];

/** Previous / next project page, cycling through the featured order. */
export const neighbours = (key: ProjectPageKey) => {
  const i = FEATURED.indexOf(key);
  const n = FEATURED.length;
  return { prev: FEATURED[(i - 1 + n) % n], next: FEATURED[(i + 1) % n] };
};
