const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const db      = new sqlite3.Database(path.join(__dirname, 'wildlife.db'));

db.serialize(() => {

  /* ── CREATE TABLES ── */
  db.run(`CREATE TABLE IF NOT EXISTS habitats (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    tagline    TEXT,
    description TEXT,
    long_desc  TEXT,
    icon       TEXT,
    color      TEXT,
    bg_color   TEXT,
    image_url  TEXT,
    sort_order INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS experiences (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    habitat_id  INTEGER NOT NULL,
    name        TEXT NOT NULL,
    type        TEXT,
    description TEXT,
    long_desc   TEXT,
    duration    TEXT,
    difficulty  TEXT,
    image_url   TEXT,
    FOREIGN KEY (habitat_id) REFERENCES habitats(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    event_date  TEXT,
    event_time  TEXT,
    location    TEXT,
    badge       TEXT,
    badge_color TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS faqs (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer   TEXT NOT NULL,
    category TEXT DEFAULT 'General'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  /* ── CLEAR EXISTING DATA ── */
  ['habitats','experiences','events','faqs'].forEach(t => db.run(`DELETE FROM ${t}`));

  /* ── HABITATS ── */
  const H = db.prepare(`INSERT INTO habitats
    (id,name,tagline,description,long_desc,icon,color,bg_color,image_url,sort_order)
    VALUES (?,?,?,?,?,?,?,?,?,?)`);

  H.run(1,'Rainforest Canopy','Life above the forest floor',
    'Ascend into a living cathedral of towering trees, cascading vines, and vibrant wildlife hidden in the emerald shadows.',
    'The Rainforest Canopy is a 2-hectare immersive tropical biome stretching 25 metres into the sky. Suspended walkways weave through the upper canopy, offering extraordinary views of jaguars, sloths, toucans and hundreds of free-flying butterflies. Our team manages one of Europe\'s most biodiverse indoor rainforest habitats with over 80 animal species and 300 plant species coexisting in a carefully balanced ecosystem. Specialist keepers tend to the habitat daily, monitoring animal welfare and maintaining the complex web of plant and insect life that makes this miniature rainforest function.',
    '🌿','#2d6a4f','rgba(45,106,79,0.12)',
    'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=1400',1);

  H.run(2,'Savannah Plains','The heartbeat of the wild',
    'Witness the raw drama of the African savannah — big cats, vast herds, golden light and endless sky stretching to the horizon.',
    'Stretching across 5 open hectares, our Savannah Plains is home to lions, giraffes, zebras, cheetahs and a breeding herd of African elephants. Dawn and dusk jeep tours let you experience the changing moods of the landscape alongside expert rangers, while elevated viewing platforms offer spectacular panoramas at any time of day. WildVista\'s Savannah is a proud participant in the European Endangered Species Programme for both Rothschild\'s giraffe and African wild dog.',
    '🦁','#c9963a','rgba(201,150,58,0.12)',
    'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1400',2);

  H.run(3,'Reptile World','Ancient creatures, timeless wonder',
    'Come face to face with the world\'s most extraordinary reptiles — from mighty Komodo dragons to jewel-like poison dart frogs.',
    'Reptile World is a climate-controlled habitat housing over 60 species across six themed zones: the Indonesian Islands (home to our Komodo dragons), the African Wetlands (Nile crocodiles), the Amazon Floor (anacondas and caimans), the Desert Dome (Gila monsters), the Poison Garden (dart frogs behind glass) and a free-roam tortoise meadow. Daily keeper talks and the popular Handle-A-Reptile sessions make this one of the park\'s most beloved attractions for all ages.',
    '🦎','#4a7c59','rgba(74,124,89,0.12)',
    'https://images.pexels.com/photos/34426/snake-reptile-serpent-dangerous.jpg?auto=compress&cs=tinysrgb&w=1400',3);

  H.run(4,'Ocean Discovery','Dive into the deep blue',
    'Explore the breathtaking mystery of the world\'s oceans — from sunlit coral gardens to the silence of the abyss.',
    'Ocean Discovery centres on a spectacular 1-million-litre main tank with a 40-metre walk-through acrylic tunnel. Six zones include the Coral Reef Gallery, Kelp Forest, Mangrove Nursery, Jellyfish Atrium, Rockpool Discovery Centre and Deep-Sea Theatre. Our team of eight biologists and fifteen divers maintain one of the UK\'s most complex marine collections, including three shark species, manta rays and a resident octopus named Oswald.',
    '🌊','#1a6b8a','rgba(26,107,138,0.12)',
    'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1400',4);

  H.run(5,'Arctic Tundra','Wild, white and wonderfully remote',
    'Step into the frozen world of the Arctic — where polar bears roam ice fields, snowy owls glide and the aurora shimmers overhead.',
    'Our Arctic Tundra maintains a permanent sub-zero microclimate across 1.5 hectares of engineered ice, tundra vegetation and glacial pools. Home to two polar bears, Arctic foxes, walruses, beluga whales, snowy owls and a colony of king penguins. The immersive Climate Change Exhibition spanning the full length of the habitat tells the story of Arctic science and the urgent need for conservation action.',
    '❄️','#5b8fa8','rgba(91,143,168,0.12)',
    'https://images.pexels.com/photos/87833/pexels-photo-87833.jpeg?auto=compress&cs=tinysrgb&w=1400',5);

  H.run(6,'Wetlands & Marshes','Where land meets water',
    'Discover the hidden richness of wetland ecosystems — a mosaic of reed beds, glittering pools and sky-filling flocks of migratory birds.',
    'Covering 3 hectares of living reed beds, shallow lagoons, alder carr woodland and open grazing marsh, our Wetlands is a genuine nature reserve within the park. Over 200 bird species have been recorded here, including bitterns, kingfishers, marsh harriers and cranes. Self-guided canoe trails, camouflaged floating hides and the Dragonfly Discovery Centre make this the perfect habitat for wildlife photographers, families and anyone who loves a tranquil wetland.',
    '🦢','#3d7a5e','rgba(61,122,94,0.12)',
    'https://images.pexels.com/photos/158251/heron-bird-flight-animal-158251.jpeg?auto=compress&cs=tinysrgb&w=1400',6);

  H.finalize();

  /* ── EXPERIENCES ── */
  const E = db.prepare(`INSERT INTO experiences
    (id,habitat_id,name,type,description,long_desc,duration,difficulty,image_url)
    VALUES (?,?,?,?,?,?,?,?,?)`);

  // Rainforest
  E.run(1,1,'Sky Walkway Trek','Adventure',
    'Walk 25 metres above the forest floor on our suspended canopy walkway and spot toucans, sloths and howler monkeys.',
    'Our signature Sky Walkway spans 300 metres of suspended bridges through the rainforest canopy. At peak height you are level with the treetops, surrounded by bromeliads, orchids and the calls of exotic birds. Rangers stationed at key points share fascinating canopy ecology facts and help you spot wildlife hiding in the foliage below.',
    '45 min','Moderate','https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(2,1,'Jaguar Watch','Exhibit',
    'Observe our resident jaguars through floor-to-ceiling glass in a lush naturalistic jungle setting.',
    'Three jaguars — Esperanza, Dante and their cub Milo — inhabit a 0.4-hectare naturalistic enclosure complete with climbing frames, deep pools and dense tropical vegetation. The floor-to-ceiling glass gallery provides close, undisturbed observation as they swim, climb and interact with their enrichment.',
    '30 min','Easy','https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(3,1,'Night Creatures Tour','Guided Tour',
    'A ranger-led torchlight adventure through the rainforest after dark — bats, tree frogs and luminescent fungi await.',
    'Rangers lead small groups through darkened sections of the rainforest using specialist lighting to reveal nocturnal creatures: fruit bats, red-eyed tree frogs, ghost moths and bioluminescent fungi glowing on fallen logs. One of our most atmospheric and memorable experiences, running on selected evenings.',
    '1 hr','Easy','https://images.pexels.com/photos/4220967/pexels-photo-4220967.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(4,1,'Butterfly Greenhouse','Exhibit',
    'Step inside a tropical greenhouse home to over 500 free-flying butterflies from around the world.',
    'More than 500 butterflies from 40 species fly freely through this lush humid space. Look for the iridescent Blue Morpho, the vivid Scarlet Mormon and the striking Purple Emperor. A central hatching cabinet lets you watch butterflies emerge from their chrysalises in real time — a magical sight for visitors of all ages.',
    '20 min','Easy','https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800');

  // Savannah
  E.run(5,2,'Sunrise Safari Jeep','Adventure',
    'Board an open-top jeep at dawn and explore the savannah with an expert ranger guiding every moment.',
    'Limited to eight guests per vehicle, our Sunrise Safari departs at first light when animals are most active. Experienced rangers guide the 90-minute circuit frequently encountering lions, elephants and cheetahs. All sightings are logged as part of our long-term behavioural research programme.',
    '1.5 hrs','Easy','https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(6,2,'Giraffe Feeding Platform','Interactive',
    'Hand-feed our Rothschild\'s giraffes from a raised platform — the most popular experience in the park.',
    'Our platform raises you to giraffe eye-level for an unforgettable face-to-face encounter with our herd of seven Rothschild\'s giraffes — one of the world\'s most endangered subspecies. Keepers provide browse and explain the conservation importance of the breeding programme taking place at WildVista.',
    '20 min','Easy','https://images.pexels.com/photos/1035508/pexels-photo-1035508.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(7,2,'Lion Territory Viewing','Exhibit',
    'Watch our pride of African lions from reinforced glass shelters built directly into the savannah landscape.',
    'Three glass-fronted viewing shelters are positioned within the lion enclosure itself, giving a genuinely immersive experience of being surrounded by the pride. Our seven lions — two adult males, three lionesses and two young cubs — roam freely around and often approach the glass for close encounters.',
    '30 min','Easy','https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800');

  // Reptile
  E.run(8,3,'Komodo Dragon Encounter','Exhibit',
    'Get within metres of the world\'s largest lizard with a full safety briefing from our specialist keepers.',
    'WildVista is one of only four European parks to house Komodo dragons. Our two adults — each over two metres long — occupy a spacious heated enclosure designed to mirror their native Indonesian habitat. Keeper talks run twice daily covering dragon behaviour, the fascinating role of venom in hunting, and conservation challenges facing wild populations.',
    '30 min','Easy','https://images.pexels.com/photos/34426/snake-reptile-serpent-dangerous.jpg?auto=compress&cs=tinysrgb&w=800');

  E.run(9,3,'Crocodile Feeding Show','Interactive',
    'Watch our expert keepers feed Nile crocodiles — a spectacular display of raw power and speed.',
    'The Crocodile Feeding Show takes place in a purpose-built amphitheatre surrounding the Nile crocodile lagoon. Four crocodiles up to 4.5 metres long react to feeding with explosive speed. Keepers narrate throughout, explaining crocodile biology, parental behaviour and their vital ecological role.',
    '25 min','Easy','https://images.pexels.com/photos/39784/crocodile-dangerous-animal-evil-39784.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(10,3,'Handle A Reptile','Interactive',
    'Hold a range of smaller reptiles under expert supervision — a hands-on session for all ages.',
    'Under close keeper supervision, visitors can handle corn snakes, blue-tongue skinks, bearded dragons and giant African land snails. Sessions are relaxed and educational, with keepers explaining each animal\'s natural history and conservation status. Suitable for ages 5 and above.',
    '30 min','Easy','https://images.pexels.com/photos/1059823/pexels-photo-1059823.jpeg?auto=compress&cs=tinysrgb&w=800');

  // Ocean
  E.run(11,4,'Shark Tunnel Walk','Exhibit',
    'Walk through our 40-metre underwater acrylic tunnel surrounded by sharks, rays and thousands of tropical fish.',
    'A gently curving 40-metre walkway of crystal-clear acrylic set within the base of the 1-million-litre main tank. Sandtiger sharks, nurse sharks, manta rays and vast schools of tropical fish pass overhead and on all sides. Fully accessible with timed entry slots to keep the experience peaceful and unhurried.',
    '20 min','Easy','https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(12,4,'Deep Dive VR','Adventure',
    'Using state-of-the-art VR headsets, virtually descend to the ocean floor and encounter creatures of the abyss.',
    'Our custom VR experience takes visitors on a 20-minute journey from the sunlit surface down to the hadal zone, 11,000 metres below sea level. Narrated by our marine biologists, it features encounters with bioluminescent anglerfish, giant squid and hydrothermal vent ecosystems impossible to see in any aquarium.',
    '20 min','Easy','https://images.pexels.com/photos/3369102/pexels-photo-3369102.jpeg?auto=compress&cs=tinysrgb&w=800');

  // Arctic
  E.run(13,5,'Polar Bear Observatory','Exhibit',
    'Watch our polar bears from a heated glass observatory overlooking their vast frozen habitat.',
    'A climate-controlled glass pavilion with floor-to-ceiling views across the entire 1-hectare polar bear enclosure. Ice field, glacial pool, rockscape and all. Our two bears, Nanuk and Siku, are most active in the morning and during afternoon enrichment sessions managed by keepers.',
    '30 min','Easy','https://images.pexels.com/photos/87833/pexels-photo-87833.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(14,5,'Ice Trek Challenge','Adventure',
    'Navigate a simulated Arctic ice field — a fun, physically engaging course for families and adventurous groups.',
    'A 300-metre outdoor adventure course of ice stepping stones, balance beams, rope bridges and an 8-metre ice wall with safety harnesses. Designed to give a taste of Arctic exploration in complete safety. Suitable for ages 7 and above; under-12s must be accompanied by an adult.',
    '45 min','Moderate','https://images.pexels.com/photos/920038/pexels-photo-920038.jpeg?auto=compress&cs=tinysrgb&w=800');

  // Wetlands
  E.run(15,6,'Canoe Trail','Adventure',
    'Paddle silently through the reed beds on a self-guided canoe trail — the finest way to encounter shy wetland wildlife.',
    'The Canoe Trail covers 2.5 kilometres of quiet waterways winding through reed beds, alder channels and open lagoons. Self-guided with a waterproof map. Dawn slots (from 9:00 AM) offer the best birdwatching. All equipment is provided; no experience necessary.',
    '1 hr','Moderate','https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.run(16,6,'Floating Hide Photography','Interactive',
    'Board a camouflaged floating hide and photograph wetland wildlife at water level.',
    'The floating hide drifts silently through the reed beds on a guided 60-minute session, allowing wildlife to behave naturally within metres of visitors. Kingfishers, herons, water voles and otters are regularly encountered. Sessions limited to four guests. Bring your own camera; tripods welcome.',
    '1 hr','Easy','https://images.pexels.com/photos/158251/heron-bird-flight-animal-158251.jpeg?auto=compress&cs=tinysrgb&w=800');

  E.finalize();

  /* ── EVENTS ── */
  const EV = db.prepare(`INSERT INTO events
    (title,description,event_date,event_time,location,badge,badge_color)
    VALUES (?,?,?,?,?,?,?)`);

  EV.run('Summer Solstice Night Safari',
    'Celebrate the longest day with a magical after-hours tour through Savannah Plains and the Rainforest Canopy under a star-filled sky. Includes exclusive keeper talks and a welcome drink at the Lodge Bar.',
    '2026-06-21','8:00 PM – 11:30 PM','Savannah Plains','Special','#c9963a');
  EV.run('Young Naturalists Day',
    'A full day of hands-on wildlife discovery for children aged 5–14. Build bug hotels, cast animal tracks, meet our reptile ambassadors and earn your WildVista Ranger Badge.',
    '2026-07-19','9:00 AM – 5:00 PM','All Habitats','Family','#4a9e7f');
  EV.run('Conservation Photography Workshop',
    'Award-winning wildlife photographer Amara Osei leads a full-day masterclass across the Wetlands and Rainforest Canopy. All skill levels welcome.',
    '2026-08-08','8:00 AM – 6:00 PM','Wetlands & Rainforest','Workshop','#9b6bc5');
  EV.run('Arctic Awareness Week',
    'A week of special programming — polar bear enrichment shows, climate science talks, ice sculpture demonstrations and an exclusive underwater beluga viewing session.',
    '2026-09-07','9:00 AM – 6:00 PM','Arctic Tundra','Week','#5b8fa8');
  EV.run('Halloween Creature Feature',
    'Our annual Halloween spectacular — torch-lit tours of the most dramatic habitats, spine-chilling reptile encounters and a Haunted Habitat trail for families.',
    '2026-10-31','5:00 PM – 9:30 PM','Reptile World','Seasonal','#c05050');
  EV.run('Rainforest After Dark',
    'An exclusive evening in the Rainforest Canopy with torchlit guided walks, nocturnal animal spotting and atmospheric sound installations by composer Yemi Adeyemi.',
    '2026-11-21','6:30 PM – 9:30 PM','Rainforest Canopy','Exclusive','#2d6a4f');
  EV.finalize();

  /* ── FAQs ── */
  const F = db.prepare(`INSERT INTO faqs (question,answer,category) VALUES (?,?,?)`);
  [
    ['What are the opening hours?',
     'WildVista is open every day of the year — including bank holidays and Christmas — from 9:00 AM to 6:00 PM. Last entry is at 5:00 PM.',
     'Your Visit'],
    ['Is the park open on Christmas Day and bank holidays?',
     'Yes, every single day — 365 days a year, 9:00 AM to 6:00 PM. Special programming runs on selected bank holidays; check our Events page.',
     'Your Visit'],
    ['How long does a visit typically take?',
     'Most visitors spend 4–6 hours. To see everything comfortably we recommend a full day. Arriving at 9:00 AM gives the best chance of seeing animals at their most active.',
     'Your Visit'],
    ['Can I bring a picnic?',
     'Absolutely. Picnic areas are spread throughout the park. We also have three cafés, a full-service restaurant and outdoor kiosks serving vegetarian and vegan options.',
     'Your Visit'],
    ['Is there parking on site?',
     'Yes — a large free car park is directly next to the main entrance, with dedicated Blue Badge spaces close by. Overflow parking is available on site during peak periods.',
     'Getting Here'],
    ['How do I get here by public transport?',
     'WildVista is a 10-minute walk from the nearest train station and served by several bus routes stopping at the main entrance. Full address and transport links are on our Contact page.',
     'Getting Here'],
    ['Are pets allowed?',
     'Pets are not permitted inside the park for the safety and welfare of our animals. Registered assistance dogs are welcome throughout.',
     'Your Visit'],
    ['Is the park wheelchair accessible?',
     'Yes. All main pathways are paved and fully accessible. We offer complimentary wheelchair loan at reception. Some adventure activities have specific requirements — please call us in advance.',
     'Accessibility'],
    ['Are there baby changing facilities?',
     'Baby changing facilities are in all toilet blocks across the park. A quiet family feeding room is located in the main visitor centre near the entrance.',
     'Accessibility'],
    ['Can I take photographs?',
     'Personal photography and video are encouraged everywhere. Commercial photography, filming or drone use requires prior written permission — please contact us via the Contact page.',
     'Facilities'],
    ['How does WildVista support conservation?',
     'WildVista is a registered conservation charity investing 15% of all operating income into international field conservation projects. We participate in European Endangered Species breeding programmes for 14 species.',
     'Conservation'],
    ['Can I adopt an animal?',
     'Yes! Our Adopt An Animal programme offers symbolic adoption including a certificate, fact sheet, keeper updates and a personal message. Visit reception or enquire via our Contact page.',
     'Conservation'],
  ].forEach(r => F.run(...r));
  F.finalize();

  console.log('Database seeded successfully.');
});

db.close();
