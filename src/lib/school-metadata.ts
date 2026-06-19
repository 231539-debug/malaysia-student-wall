export type SchoolGroup = "public" | "private" | "international";

export type SchoolCatalogItem = {
  name: string;
  shortName: string;
  slug: string;
  city: string;
  description: string;
  group: SchoolGroup;
};

export const schoolGroupLabels: Record<SchoolGroup, string> = {
  public: "公立大学",
  private: "私立大学",
  international: "海外名校马来西亚分校"
};

export const schoolCatalog: SchoolCatalogItem[] = [
  {
    name: "University of Malaya",
    shortName: "UM",
    slug: "university-of-malaya",
    city: "Kuala Lumpur",
    description: "简称 UM。马来西亚历史悠久的综合型大学，校园生活与城市资源都很丰富。",
    group: "public"
  },
  {
    name: "Universiti Sains Malaysia",
    shortName: "USM",
    slug: "universiti-sains-malaysia",
    city: "Penang",
    description: "简称 USM。位于槟城的重要公立大学，适合沉淀本地生活经验。",
    group: "public"
  },
  {
    name: "Universiti Kebangsaan Malaysia",
    shortName: "UKM",
    slug: "universiti-kebangsaan-malaysia",
    city: "Selangor",
    description: "简称 UKM。位于 Bangi 的国立大学，适合分享学术、交通和本地生活互助信息。",
    group: "public"
  },
  {
    name: "Universiti Putra Malaysia",
    shortName: "UPM",
    slug: "universiti-putra-malaysia",
    city: "Selangor",
    description: "简称 UPM。位于 Serdang 的公立研究型大学，农业、工程、商科和研究资源丰富。",
    group: "public"
  },
  {
    name: "Universiti Teknologi Malaysia",
    shortName: "UTM",
    slug: "universiti-teknologi-malaysia",
    city: "Johor Bahru",
    description: "简称 UTM。工程与技术方向突出，柔佛生活、交通和课程信息很实用。",
    group: "public"
  },
  {
    name: "International Islamic University Malaysia",
    shortName: "IIUM",
    slug: "international-islamic-university-malaysia",
    city: "Selangor",
    description: "简称 IIUM。位于 Gombak 一带，国际学生多，校园生活和住宿信息需求稳定。",
    group: "public"
  },
  {
    name: "Universiti Utara Malaysia",
    shortName: "UUM",
    slug: "universiti-utara-malaysia",
    city: "Kedah",
    description: "简称 UUM。位于 Sintok 的管理类强校，适合分享北马生活、交通和课程经验。",
    group: "public"
  },
  {
    name: "Universiti Malaysia Sabah",
    shortName: "UMS",
    slug: "universiti-malaysia-sabah",
    city: "Sabah",
    description: "简称 UMS。位于 Kota Kinabalu，适合沉淀沙巴留学生活、租房和新生求助信息。",
    group: "public"
  },
  {
    name: "Universiti Malaysia Sarawak",
    shortName: "UNIMAS",
    slug: "universiti-malaysia-sarawak",
    city: "Sarawak",
    description: "简称 UNIMAS。砂拉越重要公立大学，适合分享古晋周边生活、交通和住宿经验。",
    group: "public"
  },
  {
    name: "Universiti Sains Islam Malaysia",
    shortName: "USIM",
    slug: "universiti-sains-islam-malaysia",
    city: "Negeri Sembilan",
    description: "简称 USIM。位于 Nilai，适合汇总校园生活、课程和通勤相关经验。",
    group: "public"
  },
  {
    name: "Universiti Pendidikan Sultan Idris",
    shortName: "UPSI",
    slug: "universiti-pendidikan-sultan-idris",
    city: "Perak",
    description: "简称 UPSI。位于 Tanjung Malim 的教育类大学，适合分享课程与生活经验。",
    group: "public"
  },
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    slug: "taylors-university",
    city: "Selangor",
    description: "湖畔校园氛围鲜明，商科、酒店管理和传媒相关信息需求较多。",
    group: "private"
  },
  {
    name: "UCSI University",
    shortName: "UCSI",
    slug: "ucsi-university",
    city: "Kuala Lumpur",
    description: "简称 UCSI。位于吉隆坡，音乐、医学、商科等方向信息需求活跃。",
    group: "private"
  },
  {
    name: "Sunway University",
    shortName: "Sunway",
    slug: "sunway-university",
    city: "Selangor",
    description: "靠近 Sunway City，生活便利，留学生社区活跃。",
    group: "private"
  },
  {
    name: "INTI International University",
    shortName: "INTI",
    slug: "inti-international-university",
    city: "Negeri Sembilan",
    description: "简称 INTI。位于 Nilai，国际学生多，适合分享住宿、交通和课程信息。",
    group: "private"
  },
  {
    name: "Multimedia University",
    shortName: "MMU",
    slug: "multimedia-university",
    city: "Selangor",
    description: "简称 MMU。多媒体与科技方向突出，Cyberjaya 校园适合技术社群和租房互助。",
    group: "private"
  },
  {
    name: "Limkokwing University of Creative Technology",
    shortName: "LUCT",
    slug: "limkokwing-university-of-creative-technology",
    city: "Selangor",
    description: "简称 LUCT。创意、设计和传媒方向突出，适合分享作品、课程和校园生活信息。",
    group: "private"
  },
  {
    name: "MAHSA University",
    shortName: "MAHSA",
    slug: "mahsa-university",
    city: "Selangor",
    description: "简称 MAHSA。医学、健康科学和商科相关信息需求较多，适合新生互助。",
    group: "private"
  },
  {
    name: "SEGi University",
    shortName: "SEGi",
    slug: "segi-university",
    city: "Selangor",
    description: "简称 SEGi。Kota Damansara 周边生活便利，适合发布租房、二手和新生求助。",
    group: "private"
  },
  {
    name: "HELP University",
    shortName: "HELP",
    slug: "help-university",
    city: "Kuala Lumpur",
    description: "简称 HELP。以心理学、商科和传媒等方向闻名，吉隆坡生活资源丰富。",
    group: "private"
  },
  {
    name: "Universiti Tunku Abdul Rahman",
    shortName: "UTAR",
    slug: "universiti-tunku-abdul-rahman",
    city: "Perak",
    description: "简称 UTAR。Kampar 校区学生生活集中，适合分享租房、交通和课程信息。",
    group: "private"
  },
  {
    name: "Tunku Abdul Rahman University of Management and Technology",
    shortName: "TAR UMT",
    slug: "tunku-abdul-rahman-university-of-management-and-technology",
    city: "Kuala Lumpur",
    description: "简称 TAR UMT。以管理、会计、科技和应用学科见长，适合课程和生活互助。",
    group: "private"
  },
  {
    name: "Asia Pacific University of Technology & Innovation",
    shortName: "APU",
    slug: "asia-pacific-university",
    city: "Kuala Lumpur",
    description: "简称 APU。以科技、商科和国际学生社群闻名，位于吉隆坡科技园一带。",
    group: "private"
  },
  {
    name: "Management and Science University",
    shortName: "MSU",
    slug: "management-and-science-university",
    city: "Selangor",
    description: "简称 MSU。Shah Alam 一带的综合型私立大学，适合校园生活和课程互助。",
    group: "private"
  },
  {
    name: "International Medical University",
    shortName: "IMU",
    slug: "international-medical-university",
    city: "Kuala Lumpur",
    description: "简称 IMU。医学与健康科学方向突出，适合课程、实习和生活经验交流。",
    group: "private"
  },
  {
    name: "Universiti Tenaga Nasional",
    shortName: "UNITEN",
    slug: "universiti-tenaga-nasional",
    city: "Selangor",
    description: "简称 UNITEN。能源、工程、IT 和商科方向活跃，适合课程和租房互助。",
    group: "private"
  },
  {
    name: "Universiti Teknologi PETRONAS",
    shortName: "UTP",
    slug: "universiti-teknologi-petronas",
    city: "Perak",
    description: "简称 UTP。工程、能源和科技方向突出，适合分享课程、住宿和实习信息。",
    group: "private"
  },
  {
    name: "Malaysia University of Science and Technology",
    shortName: "MUST",
    slug: "malaysia-university-of-science-and-technology",
    city: "Selangor",
    description: "简称 MUST。以科技、管理和应用学科为主，适合课程与生活信息交流。",
    group: "private"
  },
  {
    name: "Monash University Malaysia",
    shortName: "Monash",
    slug: "monash-university-malaysia",
    city: "Selangor",
    description: "澳洲名校马来西亚校区，课程节奏紧凑，国际学生比例高。",
    group: "international"
  },
  {
    name: "University of Nottingham Malaysia",
    shortName: "UNM",
    slug: "university-of-nottingham-malaysia",
    city: "Selangor",
    description: "简称 UNM。英式校园环境，适合集中展示租房、交通和课程互助信息。",
    group: "international"
  },
  {
    name: "University of Southampton Malaysia",
    shortName: "Southampton",
    slug: "university-of-southampton-malaysia",
    city: "Johor",
    description: "英国大学马来西亚校区，适合分享工程、商科和柔佛生活信息。",
    group: "international"
  },
  {
    name: "Curtin University Malaysia",
    shortName: "Curtin",
    slug: "curtin-university-malaysia",
    city: "Sarawak",
    description: "位于 Miri 的澳洲大学校区，适合分享东马生活和课程信息。",
    group: "international"
  },
  {
    name: "University of Reading Malaysia",
    shortName: "Reading",
    slug: "university-of-reading-malaysia",
    city: "Johor",
    description: "英国大学马来西亚校区，位于 EduCity，适合分享课程、住宿和柔佛生活信息。",
    group: "international"
  },
  {
    name: "Heriot-Watt University Malaysia",
    shortName: "HWUM",
    slug: "heriot-watt-university-malaysia",
    city: "Putrajaya",
    description: "简称 HWUM。位于 Putrajaya，适合分享住宿、通勤和英式课程经验。",
    group: "international"
  },
  {
    name: "University of Wollongong Malaysia",
    shortName: "UOW Malaysia",
    slug: "university-of-wollongong-malaysia",
    city: "Selangor",
    description: "简称 UOW Malaysia。澳洲大学马来西亚校区，适合商科、传媒和生活互助信息。",
    group: "international"
  },
  {
    name: "Xiamen University Malaysia",
    shortName: "XMUM",
    slug: "xiamen-university-malaysia",
    city: "Selangor",
    description: "简称 XMUM。位于 Sepang，华人留学生群体活跃，适合生活和课程互助。",
    group: "international"
  }
];

export const popularSchoolSlugs = [
  "asia-pacific-university",
  "taylors-university",
  "sunway-university",
  "monash-university-malaysia",
  "universiti-putra-malaysia",
  "university-of-malaya",
  "ucsi-university",
  "inti-international-university",
  "segi-university",
  "multimedia-university",
  "universiti-kebangsaan-malaysia",
  "university-of-nottingham-malaysia"
];

export function getSchoolCatalogItem(slug: string) {
  return schoolCatalog.find((school) => school.slug === slug);
}

export function getSchoolDisplayName(slug: string, name: string) {
  const catalogItem = getSchoolCatalogItem(slug);
  return catalogItem?.shortName ? `${catalogItem.shortName} · ${catalogItem.name}` : name;
}
