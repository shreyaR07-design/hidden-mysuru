/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Place, Artisan, Food } from '../types';

export const HIDDEN_GEMS: Place[] = [
  {
    id: 'shivanasamudra-falls',
    name: 'Shivanasamudra Falls',
    rating: 4.7,
    distance: '78 km',
    description: 'A majestic twin-waterfall on the Kaveri River, one of the most powerful in Karnataka.',
    image: 'https://images.unsplash.com/photo-1596402434503-469b4c6e9499?q=80&w=800&auto=format&fit=crop',
    category: 'Nature',
    timeRequired: 'Full Day',
    travelNote: 'Monsoon season (July-Sept) is the best time to see the falls in full glory.',
    story: 'Shivanasamudra Falls is where the roaring Kaveri splits into breathtaking cascades. The air here vibrates with the sheer force of the Gaganachukki and Bharachukki falls, whispering tales of the river\'s journey through the rocky plateaus of the Deccan.',
    history: 'This site is home to Asia\'s first hydroelectric power plant, established in 1902 by the Diwan of Mysore, Sir K. Seshadri Iyer, showcasing Mysore\'s early commitment to innovation.',
    legend: 'Local folklore speaks of the river goddess Kaveri who, in her fury, carved these paths through the mountains to reach the plains, leaving behind these majestic witnesses to her power.',
    whyVisit: 'Witness one of nature\'s most powerful spectacles and explore a significant piece of India\'s industrial heritage.',
    nearbyFoodIds: ['f4', 'f3'],
    nextDestinationId: 'talakadu-sands',
    nextDestinationDistance: '35 km',
    nextDestinationTime: '45 mins'
  },
  {
    id: 'chunchanakatte-falls',
    name: 'Chunchanakatte Falls',
    rating: 4.5,
    distance: '55 km',
    description: 'A serene waterfall where the Kaveri river cascades gracefully amidst lush greenery.',
    image: 'https://images.unsplash.com/photo-1505506132470-36e788731118?q=80&w=800&auto=format&fit=crop',
    category: 'Nature',
    timeRequired: '5-6 Hours',
    travelNote: 'A peaceful spot away from the crowds, perfect for a quiet afternoon.',
    story: 'Hidden away from the bustling city, Chunchanakatte is a poet\'s dream. The water doesn\'t just fall; it dances over a series of steps, creating a natural symphony that has echoed in this valley for millennia.',
    history: 'The area is famous for the ancient Kodanda Rama temple situated on the banks, which features unique architecture that keeps the temple calm even during the heaviest rains.',
    legend: 'It is believed that Lord Rama stayed here during his exile. Legend says the sound of the waterfall is the music Sita once danced to.',
    whyVisit: 'For the rare experience of a waterfall coupled with spiritual tranquility and rich mythological roots.',
    nearbyFoodIds: ['f2', 'f3'],
    nextDestinationId: 'melukote-kalyani',
    nextDestinationDistance: '40 km',
    nextDestinationTime: '55 mins'
  },
  {
    id: 'talakadu-sands',
    name: 'Talakadu Sands',
    rating: 4.6,
    distance: '45 km',
    description: 'A mysterious desert-like landscape on the banks of Kaveri, home to ancient temples buried in sand.',
    image: 'https://images.unsplash.com/photo-1621274403997-37aae18318bc?q=80&w=800&auto=format&fit=crop',
    category: 'Heritage',
    timeRequired: '6-8 Hours',
    travelNote: 'Explore the five temples (Panchalinga) dedicated to Lord Shiva.',
    story: 'Talakadu is a place where history is literally buried. Walking on the vast sand dunes, one feels the weight of a thousand years beneath their feet, where a thriving city once stood.',
    history: 'Once a flourishing city of the Ganga Dynasty, it became part of a mystery when it was mysteriously covered in sand centuries ago.',
    legend: 'The famous "Curse of Talakadu" by Queen Alamelamma: "Let Talakadu become sand, Let Malangi become a whirlpool, and let the Mysore Rajas fail to generate heirs."',
    whyVisit: 'To unravel a historical mystery and witness the eerie beauty of temples emerging from the desert-like sands.',
    nearbyFoodIds: ['f5', 'f1'],
    nextDestinationId: 'shivanasamudra-falls',
    nextDestinationDistance: '35 km',
    nextDestinationTime: '45 mins'
  },
  {
    id: 'br-hills',
    name: 'Biligiriranga (BR) Hills',
    rating: 4.9,
    distance: '85 km',
    description: 'A hill range that bridges the Western and Eastern Ghats, rich in biodiversity and wildlife.',
    image: 'https://images.unsplash.com/photo-1592364395653-83e648b20cc2?q=80&w=800&auto=format&fit=crop',
    category: 'Adventure',
    timeRequired: '1-2 Days',
    travelNote: 'Ideal for wildife enthusiasts and those seeking a cool mountain retreat.',
    story: 'In the heart of the Biligiriranga Hills, the forest speaks. Here, the air is thick with the scent of wild jasmine and the calls of the elusive leopard, creating a sanctuary that feels untouched by time.',
    history: 'The hills have been the ancestral home of the Soliga tribal community for centuries, who live in deep harmony with the forest and its wildlife.',
    legend: 'The local temple is dedicated to Lord Ranganatha, who is said to have fallen in love with a local tribal girl, bridging the gap between the divine and the wild.',
    whyVisit: 'Experience a unique eco-system where the North meets the South, and wildlife co-exists with ancient tribal wisdom.',
    nearbyFoodIds: ['f4', 'f3'],
    nextDestinationId: 'talakadu-sands',
    nextDestinationDistance: '60 km',
    nextDestinationTime: '1.5 hours'
  },
  {
    id: 'ranganathittu',
    name: 'Ranganathittu Bird Sanctuary',
    rating: 4.8,
    distance: '18 km',
    description: 'An archipelago of islands on the Kaveri river, hosting exotic migratory birds and crocodiles.',
    image: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?q=80&w=800&auto=format&fit=crop',
    category: 'Nature',
    timeRequired: '3-4 Hours',
    travelNote: 'Take the boat ride for the best bird-watching experience.',
    story: 'Ranganathittu is a floating paradise. As you glide silently on the river, you\'re surrounded by thousands of birds who have traveled across continents just to find a home on these tiny islands.',
    history: 'Formed after the construction of a dam across the Kaveri in the 1600s, it was declared a sanctuary in 1940 by the Wodeyar kings following a request by world-renowned ornithologist Dr. Salim Ali.',
    legend: 'The river islands are seen as a blessing of the river gods, providing a safe haven for the winged travelers in the embrace of the Kaveri.',
    whyVisit: 'For bird lovers, it\'s a pilgrimage. For others, it\'s a meditative boat ride through a vibrant, living ecosystem.',
    nearbyFoodIds: ['f2', 'f1'],
    nextDestinationId: 'melukote-kalyani',
    nextDestinationDistance: '35 km',
    nextDestinationTime: '50 mins'
  },
  {
    id: 'melukote-kalyani',
    name: 'Melukote Kalyani',
    rating: 4.7,
    distance: '50 km',
    description: 'A grand temple tank with intricate stone steps and pillars, reflecting the heritage of the Wodeyars.',
    image: 'https://images.unsplash.com/photo-1548013146-2856f6f89025?q=80&w=800&auto=format&fit=crop',
    category: 'Heritage',
    timeRequired: '4-5 Hours',
    travelNote: 'Try the famous Melukote Puliyogare while you are there.',
    story: 'The Melukote Kalyani is more than just a water tank; it\'s a stone mirror that reflects centuries of devotion. Its symmetrical steps have witnessed the rise and fall of kingdoms, yet they remain as solid as the day they were carved.',
    history: 'Melukote is one of the most sacred places in Karnataka, the seat of the 12th-century saint Ramanujacharya who lived here for 12 years.',
    legend: 'The pond is said to have been created by the impact of a spear thrown by a celestial being, bringing forth sweet water for the parched land.',
    whyVisit: 'To experience the architectural grandeur of a bygone era and the spiritual peace of a living heritage town.',
    nearbyFoodIds: ['f5', 'f3'],
    nextDestinationId: 'chennakesava-temple',
    nextDestinationDistance: '65 km',
    nextDestinationTime: '1.5 hours'
  },
  {
    id: 'chennakesava-temple',
    name: 'Chennakesava Temple, Somanathapura',
    rating: 4.9,
    distance: '35 km',
    description: 'A masterpiece of Hoysala architecture, renowned for its intricate stone carvings and stellar plan.',
    image: 'https://images.unsplash.com/photo-1621319208083-d95c479421f1?q=80&w=800&auto=format&fit=crop',
    category: 'Heritage',
    timeRequired: '3-4 Hours',
    travelNote: 'Hire a guide to understand the fascinating stories behind the carvings.',
    story: 'At Somanathapura, stone comes to life. Every inch of the Chennakesava Temple is a frozen dance, a celebration of life, war, and divinity, carved with a precision that defies the technology of its time.',
    history: 'Built in 1268 AD by Somanatha Dandanayaka, a general under the Hoysala King Narasimha III, it represents the zenith of Hoysala architecture.',
    legend: 'It is said that the chief architect, Jakanachari, was so perfectionistic that he once rejected a stone because it had a "frog" inside, symbolizing a minor imperfection that only a master eye could see.',
    whyVisit: 'To see what humans are capable of creating when their devotion and artistry reach for the stars.',
    nearbyFoodIds: ['f1', 'f3'],
    nextDestinationId: 'shivanasamudra-falls',
    nextDestinationDistance: '28 km',
    nextDestinationTime: '40 mins'
  },
  {
    id: 'gomatagiri',
    name: 'Gomatagiri',
    rating: 4.4,
    distance: '20 km',
    description: 'A Jain pilgrimage center with a monolith statue of Bahubali atop a hillock.',
    image: 'https://images.unsplash.com/photo-1590059510349-2e06a3106fb7?q=80&w=800&auto=format&fit=crop',
    category: 'Religious',
    timeRequired: '2-3 Hours',
    travelNote: 'Climb the 70 steps for a peaceful view of the countryside.',
    story: 'Gomatagiri stands as a sentinel of silence. The monolith of Bahubali, standing atop a hill, looks out over the landscape with a gaze that speaks of infinite patience and detachment.',
    history: 'The 18-foot tall statue is an early specimen of Jain art in the region, dating back several centuries and serving as a key center for the Bahubali Mahamastakabhisheka festival.',
    legend: 'Bahubali, the son of the first Tirthankara, chose a path of absolute peace even after winning a war, symbolizing the victory of the soul over the kingdom.',
    whyVisit: 'For a rare combination of scenic beauty, spiritual elevation, and a lesson in ancient Indian philosophy.',
    nearbyFoodIds: ['f2', 'f3'],
    nextDestinationId: 'ranganathittu',
    nextDestinationDistance: '12 km',
    nextDestinationTime: '20 mins'
  },
  {
    id: 'balamuri-falls',
    name: 'Balamuri Falls',
    rating: 4.3,
    distance: '15 km',
    description: 'A man-made check dam on the Kaveri, popular for weekend picnics and leisurely walks.',
    image: 'https://images.unsplash.com/photo-1508433957232-3107f5ed2035?q=80&w=800&auto=format&fit=crop',
    category: 'Nature',
    timeRequired: '2-3 Hours',
    travelNote: 'A great place for a quick getaway from the city heat.',
    story: 'Balamuri is the river\'s playground. Here, the Kaveri takes a gentle turn, spilling over a man-made ridge to create a wall of water that invites everyone to just walk in and feel the cool embrace of the river.',
    whyVisit: 'The perfect spot for a casual, fun-filled afternoon by the water with friends and family.',
    nearbyFoodIds: ['f2', 'f3'],
    nextDestinationId: 'ranganathittu',
    nextDestinationDistance: '8 km',
    nextDestinationTime: '15 mins'
  }
];

export const ARTISANS: Artisan[] = [
  {
    id: 'a1',
    name: 'Ramaiah K.',
    craft: 'Rosewood Inlay',
    experience: '35 Years',
    location: 'Mandi Mohalla, Mysuru',
    about: 'Ramaiah is a national award-winning artisan who has dedicated his life to the intricate art of Rosewood Inlay, a tradition unique to Mysuru.',
    story: 'Ramaiah K. continues a 100-year-old rosewood inlay tradition passed through generations. His hands move with a rhythm born of decades of practice, piecing together intricate patterns of ivory and woods.',
    history: 'Rosewood Inlay work in Mysore flourished under the patronage of the Wodeyar kings, who brought in artisans from all over India to decorate the Mysore Palace.',
    legend: 'The technique is said to have originated in the Mughal courts and was adapted in Mysore using the abundant rosewood forests of the region.',
    products: [
      { id: 'p1', name: 'Rosewood Inlay Table', price: '₹12,000', image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=400&auto=format&fit=crop', description: 'Hand-carved table with intricate floral ivory inlay.' },
      { id: 'p2', name: 'Wall Hanging Art', price: '₹3,500', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?q=80&w=400&auto=format&fit=crop', description: 'Depiction of the Mysore Palace in classic inlay style.' }
    ],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'a2',
    name: 'Sarojini Devi',
    craft: 'Mysore Silk Weaving',
    experience: '28 Years',
    location: 'K.R. Nagar, Mysuru',
    about: 'Sarojini specializes in the traditional weaving techniques of the world-famous Mysore Silk, ensuring every thread reflects royal heritage.',
    story: 'For Sarojini, every saree is a canvas of heritage. She weaves not just silk, but the stories of Mysore\'s royalty, using pure gold zari that has been the hallmark of these sarees for centuries.',
    history: 'Mysore Silk was established as a royal industry in 1912 by Sri Nalvadi Krishnaraja Wodeyar, using silk from the first-ever silkworm rearing unit in the country.',
    legend: 'Legend says the first Mysore Silk saree was woven specifically for the Maharani, who wanted a fabric as soft as the river Kaveri and as radiant as the morning sun.',
    products: [
      { id: 'p3', name: 'Pure Mysore Silk Saree', price: '₹15,000', image: 'https://images.unsplash.com/photo-1610030469857-49520422ee88?q=80&w=400&auto=format&fit=crop', description: 'Classic gold zari border on rich mulberry silk.' },
      { id: 'p4', name: 'Silk Stole', price: '₹2,500', image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=400&auto=format&fit=crop', description: 'Handcrafted silk stole for elegant ethnic wear.' }
    ],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'a3',
    name: 'Basavaraj M.',
    craft: 'Sandalwood Carving',
    experience: '42 Years',
    location: 'Chamarajapuram, Mysuru',
    about: 'Carving stories into the fragrant sandalwood of Karnataka, Basavaraj maintains the delicate balance of precision and passion.',
    story: 'Basavaraj works in a fragrant cloud of sandalwood dust. He doesn\'t just carve wood; he extracts the soul of the tree, turning a rough log into a delicate idol of Lord Ganesha.',
    history: 'Karnataka is the land of sandalwood, and Mysore was once the world center for sandalwood oil and carving, a legacy carefully guarded by artisans like Basavaraj.',
    legend: 'It is believed that the fragrance of sandalwood is the breath of the mountain gods, and carving it is a form of prayer that connects the artisan to the divine.',
    products: [
      { id: 'p5', name: 'Sandalwood Ganesha', price: '₹8,500', image: 'https://images.unsplash.com/photo-1620216553250-705b7661ce06?q=80&w=400&auto=format&fit=crop', description: 'Intricately carved deity idol in pure sandalwood.' },
      { id: 'p6', name: 'Fragrant Fan', price: '₹1,200', image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=400&auto=format&fit=crop', description: 'Delicate hand fan that releases scent when used.' }
    ],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'a4',
    name: 'Lakshmi Prasad',
    craft: 'Traditional Pottery',
    experience: '20 Years',
    location: 'Kumbarageri, Mysuru',
    about: 'Lakshmi keeps the ancestral fire of pottery alive, creating functional and decorative clay masterpieces from native soil.',
    story: 'Lakshmi\'s wheel is a hypnotic blur. She sees the pottery not as an object, but as the clay\'s destiny, shaped by her hands and the spirit of the earth.',
    products: [
      { id: 'p7', name: 'Handmade Pottery Vase', price: '₹950', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop', description: 'Earthenware vase with traditional Mysuru patterns.' }
    ],
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'a5',
    name: 'Gopal S.',
    craft: 'Bamboo Craft',
    experience: '15 Years',
    location: 'Hunsur Road, Mysuru',
    about: 'Gopal transforms versatile bamboo into eco-friendly artifacts, blending modern design with traditional tribal techniques.',
    story: 'Gopal splits the bamboo with surgical precision. Each strip he weaves is a tribute to the forest, creating sustainable art that brings a piece of nature into the modern home.',
    products: [
      { id: 'p8', name: 'Bamboo Basket Set', price: '₹1,500', image: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=400&auto=format&fit=crop', description: 'Set of 3 hand-woven eco-friendly baskets.' }
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  }
];

export const FOODS: Food[] = [
  {
    id: 'f1',
    name: 'Mysore Pak',
    bestPlace: 'Guru Sweet Mart',
    priceRange: '₹100 - ₹500',
    description: 'A rich, melt-in-the-mouth sweet made from generous amounts of ghee, chickpea flour, and sugar.',
    image: 'https://images.unsplash.com/photo-1589113103503-49ca8dc689cc?q=80&w=800&auto=format&fit=crop',
    category: 'Sweets'
  },
  {
    id: 'f2',
    name: 'Mysore Masala Dosa',
    bestPlace: 'Mylari Hotel',
    priceRange: '₹50 - ₹120',
    description: 'Crispy rice crepe smeared with spicy red chutney and stuffed with seasoned potato mash, served with coconut chutney.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop',
    category: 'Snacks'
  },
  {
    id: 'f3',
    name: 'Filter Coffee',
    bestPlace: 'Malghudi Coffee',
    priceRange: '₹20 - ₹50',
    description: 'A unique blend of roasted coffee beans and chicory, brewed in a traditional metal filter and served with frothy milk.',
    image: 'https://images.unsplash.com/photo-1541173104523-d15a9a5832a5?q=80&w=800&auto=format&fit=crop',
    category: 'Beverage'
  },
  {
    id: 'f4',
    name: 'Ragi Mudde with Soppu Saaru',
    bestPlace: 'Hanumanthu Mess',
    priceRange: '₹80 - ₹200',
    description: 'Pillowy ragi balls served with a nutritious greens curry, a staple of authentic Karnataka farmers meals.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
    category: 'Full Meal'
  },
  {
    id: 'f5',
    name: 'Bisi Bele Bath',
    bestPlace: 'Kamath Madhuvan',
    priceRange: '₹70 - ₹150',
    description: 'A spicy, tangy, and flavorsome one-pot meal made of rice, lentils, and mixed vegetables.',
    image: 'https://images.unsplash.com/photo-1610450949065-0f3037953250?q=80&w=800&auto=format&fit=crop',
    category: 'Full Meal'
  }
];

export interface Vlog {
  id: string;
  title: string;
  author: string;
  videoId: string; // YouTube ID
  thumbnail: string;
}

export const VLOGS: Vlog[] = [
  {
    id: 'v1',
    title: 'Exploring the Hidden Temples of Mysuru',
    author: 'Travel with Shreya',
    videoId: 'qjW6D6L3J1Q',
    thumbnail: 'https://img.youtube.com/vi/qjW6D6L3J1Q/maxresdefault.jpg'
  },
  {
    id: 'v2',
    title: 'The Unseen Side of Mysore Palace',
    author: 'Heritage Walks',
    videoId: '8H9M9jXp6Is',
    thumbnail: 'https://img.youtube.com/vi/8H9M9jXp6Is/maxresdefault.jpg'
  },
  {
    id: 'v3',
    title: 'Traditional Rosewood Inlay documentary',
    author: 'Artisan Stories',
    videoId: 'S0_Xp_O6G9M',
    thumbnail: 'https://img.youtube.com/vi/S0_Xp_O6G9M/maxresdefault.jpg'
  }
];
