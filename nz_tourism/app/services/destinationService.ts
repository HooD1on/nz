export type Destination = {
  id: number
  name: string
  country: string
  description: string
  longDescription: string
  rating: number
  reviews: number
  price: string
  duration: string
  mainImage: string
  galleryImages: string[]
  featured: boolean
  tags: string[]
  activities: string[]
  highlights: string[]
}

// 模拟目的地数据
const destinations: Destination[] = [
  {
    id: 1,
    name: "Mount Cook",
    country: "New Zealand",
    description: "New Zealand's highest mountain with stunning alpine scenery",
    longDescription: "Aoraki/Mount Cook is New Zealand's highest mountain, with a height of 3,724 metres. It lies in the Southern Alps, the mountain range that runs the length of the South Island. A popular tourist destination, it is also a favourite challenge for mountain climbers. A national park was established in 1953 and it includes over 140 peaks standing over 2,000 metres and 72 named glaciers, which cover 40% of the park's 700 square kilometres.",
    rating: 4.8,
    reviews: 124,
    price: "$1,299",
    duration: "5 days",
    mainImage: "https://images.unsplash.com/photo-1579269807518-4c01e2d9aae7?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1587547344558-6ba3671c3444?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1682616323286-7356731acefa?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    tags: ["mountains", "adventure", "hiking"],
    activities: [
      "Hiking on Hooker Valley Track",
      "Stargazing at Dark Sky Reserve",
      "Helicopter tours over the Southern Alps",
      "Tasman Glacier boat tours"
    ],
    highlights: [
      "Experience New Zealand's tallest mountain",
      "Stunning alpine landscapes and glaciers",
      "Perfect for photography enthusiasts",
      "World-class hiking trails"
    ]
  },
  {
    id: 2,
    name: "Milford Sound",
    country: "New Zealand",
    description: "Breathtaking fiord known for its stunning waterfalls",
    longDescription: "Milford Sound is a fiord in the southwest of New Zealand's South Island. It's known for towering Mitre Peak, plus rainforests and waterfalls like Stirling and Bowen falls, which plummet down its sheer sides. The fjord is home to fur seal colonies, penguins and dolphins. Milford Discovery Centre and Underwater Observatory offers views of rare black coral and other marine life. Boat tours are a popular way to experience the region.",
    rating: 4.9,
    reviews: 203,
    price: "$1,499",
    duration: "4 days",
    mainImage: "https://images.unsplash.com/photo-1595163772309-89b5c4a6ad61?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1504391975254-27faea638d41?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490470379485-c04ffae5d4c6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1666797494196-73740936c77c?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    tags: ["nature", "scenic", "boat tours"],
    activities: [
      "Scenic cruise on Milford Sound",
      "Kayaking among waterfalls",
      "Underwater observatory visit",
      "Hiking on Milford Track"
    ],
    highlights: [
      "See the iconic Mitre Peak",
      "Experience stunning waterfalls",
      "Spot dolphins and seals",
      "Incredible photography opportunities"
    ]
  },
  {
    id: 3,
    name: "Queenstown",
    country: "New Zealand",
    description: "Adventure capital with stunning lake and mountain views",
    longDescription: "Queenstown, New Zealand, sits on the shores of Lake Wakatipu, set against the dramatic Southern Alps. Renowned for adventure sports, it's also a base for exploring the region's vineyards and historic mining towns. The bungee jump was invented here and there are jet boat rides on offer, as well as opportunities for skiing, hiking, climbing and skydiving. Cultural activities are also available, including Maori performances.",
    rating: 4.7,
    reviews: 187,
    price: "$1,199",
    duration: "6 days",
    mainImage: "https://images.unsplash.com/photo-1589426735622-1d3bbb4a6924?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1511102135937-532979026c2a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598324583428-fba24b82ad57?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600250309121-00fe14508897?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: false,
    tags: ["adventure", "city", "nightlife"],
    activities: [
      "Bungee jumping at Kawarau Bridge",
      "Jet boating on Shotover River",
      "Skyline Gondola and Luge",
      "Wine tasting in Gibbston Valley"
    ],
    highlights: [
      "Adrenaline activities for all thrill levels",
      "Beautiful scenery of Lake Wakatipu",
      "Vibrant nightlife and dining scene",
      "Gateway to Fiordland National Park"
    ]
  },
  {
    id: 4,
    name: "Rotorua",
    country: "New Zealand",
    description: "Geothermal wonders and Maori cultural experiences",
    longDescription: "Rotorua, a town set on its namesake lake on New Zealand's North Island, is renowned for its geothermal activity and Maori culture. It's home to the Te Puia geothermal reserve, with its impressive Pohutu Geyser. The surrounding region offers numerous opportunities to see bubbling mud pools, shooting geysers and natural hot springs, some of which are suitable for swimming. The city is also famous for its strong sulphur smell.",
    rating: 4.6,
    reviews: 142,
    price: "$999",
    duration: "3 days",
    mainImage: "https://images.unsplash.com/photo-1601145930531-1f235b086c8a?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1657619559479-4ce88e7171f9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508146880225-4c29c806323e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583308148228-2e6f25df9283?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: false,
    tags: ["cultural", "nature", "relaxation"],
    activities: [
      "Te Puia geothermal park visit",
      "Traditional Maori hangi feast",
      "Wai-O-Tapu thermal wonderland tour",
      "Redwoods Treewalk"
    ],
    highlights: [
      "Experience authentic Maori culture",
      "See bubbling mud pools and geysers",
      "Relax in natural hot springs",
      "Learn about New Zealand's unique geology"
    ]
  },
  {
    id: 5,
    name: "Bay of Islands",
    country: "New Zealand",
    description: "Beautiful bay with 144 islands and marine wildlife",
    longDescription: "The Bay of Islands is a New Zealand enclave encompassing more than 140 subtropical islands next to the country's North Island. It's known for its undeveloped beaches, big-game fishing and Maori cultural artifacts. It's also home to the 19th-century whaling port of Russell, whose waterfront promenade is lined with remnants from its days as the country's first colonial capital. The islands are a popular sailing destination.",
    rating: 4.7,
    reviews: 156,
    price: "$1,099",
    duration: "4 days",
    mainImage: "https://images.unsplash.com/photo-1580138406132-36ad7e9c39f2?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1531804308561-b6438d25bc52?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601580569954-64be744bb143?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617097258257-4b3f5d01f7cf?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    tags: ["beaches", "islands", "wildlife"],
    activities: [
      "Dolphin watching cruise",
      "Visit to historic Russell",
      "Sailing among the islands",
      "Tour of Waitangi Treaty Grounds"
    ],
    highlights: [
      "Swim with dolphins in their natural habitat",
      "Explore historical sites important to New Zealand",
      "Island hopping adventures",
      "Beautiful beaches and clear waters"
    ]
  },
  {
    id: 6,
    name: "Abel Tasman National Park",
    country: "New Zealand",
    description: "Coastal paradise with golden beaches and turquoise waters",
    longDescription: "Abel Tasman National Park is a wilderness reserve at the north end of New Zealand's South Island. It's known for the Abel Tasman Coast Track, a long hiking trail that passes through beaches, native bush and the Tonga Island Marine Reserve. The park has a mild climate and is a popular camping destination. Fur seals can be seen at Tonga Island and at the northerly end of the park, and dolphin-spotting tours operate year-round.",
    rating: 4.8,
    reviews: 132,
    price: "$1,199",
    duration: "5 days",
    mainImage: "https://images.unsplash.com/photo-1518132006340-3048ad6a7fd9?q=80&w=1000&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1598346763242-7fbe5048af76?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596880300104-779c780be0f3?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596697951623-5512802d77f3?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: false,
    tags: ["beaches", "hiking", "nature"],
    activities: [
      "Kayaking along the coastline",
      "Hiking the Abel Tasman Coast Track",
      "Water taxi between scenic beaches",
      "Snorkeling in crystal clear waters"
    ],
    highlights: [
      "Pristine golden sand beaches",
      "Turquoise waters perfect for swimming",
      "Beautiful coastal hiking trails",
      "Abundant wildlife including seals and birds"
    ]
  }
]

// 获取所有目的地
export const getAllDestinations = (): Destination[] => {
  return destinations
}

// 获取精选目的地
export const getFeaturedDestinations = (): Destination[] => {
  return destinations.filter(dest => dest.featured)
}

// 根据ID获取目的地
export const getDestinationById = (id: number): Destination | undefined => {
  return destinations.find(dest => dest.id === id)
}

// 根据标签获取目的地
export const getDestinationsByTag = (tag: string): Destination[] => {
  return destinations.filter(dest => dest.tags.includes(tag))
}

// 搜索目的地
export const searchDestinations = (query: string): Destination[] => {
  const searchTerm = query.toLowerCase()
  return destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm) ||
    dest.country.toLowerCase().includes(searchTerm) ||
    dest.description.toLowerCase().includes(searchTerm) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

// 获取相关目的地（排除当前ID，可选择按标签筛选）
export const getRelatedDestinations = (currentId: number, limit: number = 3): Destination[] => {
  const current = destinations.find(d => d.id === currentId)
  if (!current) return []
  
  // 首先尝试找到有相同标签的目的地
  const withSameTags = destinations.filter(d => 
    d.id !== currentId && 
    d.tags.some(tag => current.tags.includes(tag))
  )
  
  // 如果有足够的相同标签目的地，返回它们
  if (withSameTags.length >= limit) {
    return withSameTags.slice(0, limit)
  }
  
  // 否则，添加其他目的地直到达到限制
  const others = destinations.filter(d => 
    d.id !== currentId && 
    !withSameTags.some(sd => sd.id === d.id)
  )
  
  return [...withSameTags, ...others].slice(0, limit)
} 