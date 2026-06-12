import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const { verbose } = sqlite3pkg;
const sqlite3 = verbose();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(path.join(__dirname, 'wildlife.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS habitats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, tagline TEXT, description TEXT, long_desc TEXT,
    icon TEXT, color TEXT, bg_color TEXT, image_url TEXT, sort_order INTEGER DEFAULT 0)`);
  db.run(`CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habitat_id INTEGER NOT NULL, name TEXT NOT NULL, type TEXT,
    description TEXT, long_desc TEXT, duration TEXT, difficulty TEXT, image_url TEXT,
    FOREIGN KEY (habitat_id) REFERENCES habitats(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, description TEXT, event_date TEXT,
    event_time TEXT, location TEXT, badge TEXT, badge_color TEXT, category TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL, answer TEXT NOT NULL, category TEXT DEFAULT 'General')`);
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL,
    message TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`);

  ['habitats', 'experiences', 'events', 'faqs'].forEach(t => db.run('DELETE FROM ' + t));

  const H = db.prepare('INSERT INTO habitats (id,name,tagline,description,long_desc,icon,color,bg_color,image_url,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)');
  H.run(1, 'Rainforest Canopy', 'Life above the forest floor', 'Ascend into a living cathedral of towering trees, cascading vines, and vibrant wildlife.', 'The Rainforest Canopy is a 2-hectare immersive tropical biome stretching 25 metres into the sky. Suspended walkways weave through the upper canopy offering extraordinary views of jaguars, sloths, toucans and hundreds of free-flying butterflies. Our team manages one of Europe\'s most biodiverse indoor rainforest habitats with over 80 animal species.', '🌿', '#2d6a4f', 'rgba(45,106,79,0.12)', 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=1400', 1);
  H.run(2, 'Savannah Plains', 'The heartbeat of the wild', 'Witness the raw drama of the African savannah — big cats, vast herds and golden light.', 'Stretching across 5 open hectares, our Savannah Plains is home to lions, giraffes, zebras, cheetahs and a breeding herd of African elephants. Dawn and dusk jeep tours let you experience the landscape alongside expert rangers.', '🦁', '#c9963a', 'rgba(201,150,58,0.12)', 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1400', 2);
  H.run(3, 'Reptile World', 'Ancient creatures, timeless wonder', 'Come face to face with extraordinary reptiles from Komodo dragons to poison dart frogs.', 'Reptile World houses over 60 species across six themed zones including the Indonesian Islands, African Wetlands, Amazon Floor, Desert Dome and Poison Garden. Daily keeper talks and Handle-A-Reptile sessions make this one of the most beloved attractions.', '🦎', '#4a7c59', 'rgba(74,124,89,0.12)', 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=1400', 3);
  H.run(4, 'Ocean Discovery', 'Dive into the deep blue', 'Explore the mystery of the oceans from sunlit coral gardens to the silence of the abyss.', 'Ocean Discovery centres on a 1-million-litre main tank with a 40-metre walk-through acrylic tunnel. Six zones include the Coral Reef Gallery, Kelp Forest, Mangrove Nursery, Jellyfish Atrium and Deep-Sea Theatre.', '🌊', '#1a6b8a', 'rgba(26,107,138,0.12)', 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1400', 4);
  H.run(5, 'Arctic Tundra', 'Wild, white and wonderfully remote', 'Step into the frozen world of the Arctic where polar bears roam and the aurora shimmers.', 'Our Arctic Tundra maintains a permanent sub-zero microclimate across 1.5 hectares. Home to polar bears, Arctic foxes, walruses, beluga whales and king penguins. The Climate Change Exhibition spans the full habitat.', '❄️', '#5b8fa8', 'rgba(91,143,168,0.12)', 'https://images.pexels.com/photos/87833/pexels-photo-87833.jpeg?auto=compress&cs=tinysrgb&w=1400', 5);
  H.run(6, 'Wetlands & Marshes', 'Where land meets water', 'Discover the richness of wetlands — reed beds, glittering pools and migratory birds.', 'Covering 3 hectares of living reed beds, shallow lagoons and alder woodland, our Wetlands is a genuine nature reserve. Over 200 bird species have been recorded. Self-guided canoe trails and floating hides make this perfect for wildlife photographers.', '🦢', '#3d7a5e', 'rgba(61,122,94,0.12)', 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1400', 6);
  H.finalize();

  const E = db.prepare('INSERT INTO experiences (id,habitat_id,name,type,description,long_desc,duration,difficulty,image_url) VALUES (?,?,?,?,?,?,?,?,?)');
  E.run(1, 1, 'Sky Walkway Trek', 'Adventure', 'Walk 25m above the forest floor and spot toucans, sloths and howler monkeys.', 'Our 300-metre suspended Sky Walkway takes you through the rainforest canopy. At peak height you are level with the treetops surrounded by bromeliads, orchids and exotic birds.', '45 min', 'Moderate', 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(2, 1, 'Jaguar Watch', 'Exhibit', 'Observe our resident jaguars through floor-to-ceiling glass in a naturalistic jungle setting.', 'Three jaguars inhabit a 0.4-hectare enclosure with climbing frames, pools and dense vegetation. The gallery provides close undisturbed observation.', '30 min', 'Easy', 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(3, 1, 'Night Creatures Tour', 'Guided Tour', 'A torchlight adventure through the rainforest after dark.', 'Rangers lead groups through darkened sections revealing fruit bats, tree frogs and bioluminescent fungi.', '1 hr', 'Easy', 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(4, 1, 'Butterfly Greenhouse', 'Exhibit', 'Step inside a greenhouse with over 500 free-flying butterflies.', 'More than 500 butterflies from 40 species fly freely. A hatching cabinet lets you watch butterflies emerge live.', '20 min', 'Easy', 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(5, 2, 'Sunrise Safari Jeep', 'Adventure', 'Board an open-top jeep at dawn with an expert ranger.', 'Limited to eight guests, the Sunrise Safari departs at first light. The 90-minute circuit frequently encounters lions, elephants and cheetahs.', '1.5 hrs', 'Easy', 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(6, 2, 'Giraffe Feeding Platform', 'Interactive', 'Hand-feed our Rothschild\'s giraffes from a raised platform.', 'Our platform raises you to giraffe eye-level for a face-to-face encounter. Keepers explain the conservation importance of this breeding programme.', '20 min', 'Easy', 'https://images.pexels.com/photos/1035508/pexels-photo-1035508.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(7, 2, 'Lion Territory Viewing', 'Exhibit', 'Watch our pride of lions from reinforced glass shelters.', 'Three shelters inside the lion enclosure give an immersive experience. Seven lions roam freely and often approach the glass.', '30 min', 'Easy', 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(8, 3, 'Komodo Dragon Encounter', 'Exhibit', 'Get within metres of the world\'s largest lizard.', 'Keeper talks cover behaviour, venom and conservation challenges facing wild populations.', '30 min', 'Easy', 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(9, 3, 'Crocodile Feeding Show', 'Interactive', 'Watch keepers feed Nile crocodiles — raw power on display.', 'Four crocodiles up to 4.5 metres react with explosive speed. Keepers narrate throughout.', '25 min', 'Easy', 'https://images.pexels.com/photos/1682243/pexels-photo-1682243.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(10, 3, 'Handle A Reptile', 'Interactive', 'Hold reptiles under expert supervision — hands-on for all ages.', 'Visitors can handle corn snakes, skinks, bearded dragons and land snails. Ages 5 and above.', '30 min', 'Easy', 'https://images.pexels.com/photos/3299904/pexels-photo-3299904.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(11, 4, 'Shark Tunnel Walk', 'Exhibit', 'Walk through our 40-metre underwater tunnel.', 'A 40-metre acrylic walkway inside the 1-million-litre tank. Sharks, rays and tropical fish pass overhead.', '20 min', 'Easy', 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(12, 4, 'Deep Dive VR', 'Adventure', 'Virtually descend to the ocean floor using VR headsets.', 'A 20-minute journey from the surface to 11,000 metres deep. Features anglerfish, giant squid and vent ecosystems.', '20 min', 'Easy', 'https://images.pexels.com/photos/3046637/pexels-photo-3046637.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(13, 5, 'Polar Bear Observatory', 'Exhibit', 'Watch polar bears from a heated glass observatory.', 'Floor-to-ceiling views across the 1-hectare enclosure. Most active in the morning and during afternoon enrichment.', '30 min', 'Easy', 'https://images.pexels.com/photos/87833/pexels-photo-87833.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(14, 5, 'Ice Trek Challenge', 'Adventure', 'Navigate a simulated Arctic ice field.', 'A 300-metre course of stepping stones, balance beams, rope bridges and an 8-metre ice wall. Ages 7 and above.', '45 min', 'Moderate', 'https://images.pexels.com/photos/376361/pexels-photo-376361.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(15, 6, 'Canoe Trail', 'Adventure', 'Paddle through reed beds on a self-guided canoe trail.', '2.5km of waterways through reed beds and open lagoons. Self-guided with a waterproof map. All equipment provided.', '1 hr', 'Moderate', 'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg?auto=compress&cs=tinysrgb&w=800');
  E.run(16, 6, 'Floating Hide Photography', 'Interactive', 'Photograph wetland wildlife from a floating hide at water level.', 'The hide drifts silently through reed beds. Kingfishers, herons and otters regularly encountered. Max four guests.', '1 hr', 'Easy', 'https://images.pexels.com/photos/46160/field-moorland-fog-foggy-46160.jpeg?auto=compress&cs=tinysrgb&w=1400');
  E.finalize();

  const EV = db.prepare('INSERT INTO events (title,description,event_date,event_time,location,badge,badge_color,category) VALUES (?,?,?,?,?,?,?,?)');
  EV.run('Winter Wildlife Weekend', 'A two-day celebration of winter wildlife with guided walks and photography workshops.', '2024-01-20', '9:00 AM - 5:00 PM', 'All Habitats', 'Seasonal', '#5b8fa8', 'Seasonal Celebration');
  EV.run('Big Cat Awareness Day', 'Special talks and close-up lion and jaguar viewing to raise awareness of big cat conservation.', '2024-03-15', '10:00 AM - 4:00 PM', 'Savannah Plains', 'Conservation', '#c9963a', 'Conservation Talk');
  EV.run('Spring Family Day 2024', 'A full day of family-friendly activities including bug hunts and reptile handling.', '2024-04-06', '9:00 AM - 5:00 PM', 'All Habitats', 'Family', '#4a9e7f', 'Family Activity');
  EV.run('Rainforest Night Safari 2024', 'Torchlit after-hours tours of the Rainforest Canopy to discover nocturnal wildlife.', '2024-06-21', '8:00 PM - 11:00 PM', 'Rainforest Canopy', 'Special', '#2d6a4f', 'Seasonal Celebration');
  EV.run('Ocean Conservation Talk', 'Marine biologist Dr. Sarah Chen presents on coral reef restoration.', '2024-09-14', '2:00 PM - 4:00 PM', 'Ocean Discovery', 'Talk', '#1a6b8a', 'Conservation Talk');
  EV.run('Halloween 2024', 'Torch-lit tours, reptile encounters and a Haunted Habitat trail.', '2024-10-31', '5:00 PM - 9:30 PM', 'Reptile World', 'Seasonal', '#c05050', 'Seasonal Celebration');
  EV.run('Young Naturalists Day 2025', 'Hands-on wildlife discovery for children aged 5-14.', '2025-03-22', '9:00 AM - 5:00 PM', 'All Habitats', 'Family', '#4a9e7f', 'Family Activity');
  EV.run('Photography Masterclass 2025', 'Photographer Amara Osei leads a full-day workshop across the Wetlands.', '2025-05-10', '8:00 AM - 6:00 PM', 'Wetlands', 'Workshop', '#9b6bc5', 'Conservation Talk');
  EV.run('Midsummer Night Safari 2025', 'Exclusive after-hours jeep safari across the Savannah under the stars.', '2025-06-21', '8:30 PM - 11:30 PM', 'Savannah Plains', 'Special', '#c9963a', 'Seasonal Celebration');
  EV.run('Arctic Awareness Week 2025', 'Polar bear enrichment shows, climate talks and beluga viewing.', '2025-09-01', '9:00 AM - 6:00 PM', 'Arctic Tundra', 'Week', '#5b8fa8', 'Conservation Talk');
  EV.run('Halloween 2025', 'Annual Halloween spectacular with torch-lit tours and reptile encounters.', '2025-10-31', '5:00 PM - 9:30 PM', 'Reptile World', 'Seasonal', '#c05050', 'Seasonal Celebration');
  EV.run('Spring Family Festival 2026', 'A weekend of family wildlife activities including animal talks and crafts.', '2026-04-05', '9:00 AM - 5:00 PM', 'All Habitats', 'Family', '#4a9e7f', 'Family Activity');
  EV.run('Summer Solstice Night Safari', 'Magical after-hours tour through Savannah Plains and Rainforest Canopy.', '2026-06-21', '8:00 PM - 11:30 PM', 'Savannah Plains', 'Special', '#c9963a', 'Seasonal Celebration');
  EV.run('Young Naturalists Day 2026', 'Hands-on wildlife discovery for children. Earn your WildVista Ranger Badge.', '2026-07-19', '9:00 AM - 5:00 PM', 'All Habitats', 'Family', '#4a9e7f', 'Family Activity');
  EV.run('Photography Workshop 2026', 'Amara Osei leads a masterclass across the Wetlands and Rainforest.', '2026-08-08', '8:00 AM - 6:00 PM', 'Wetlands & Rainforest', 'Workshop', '#9b6bc5', 'Conservation Talk');
  EV.run('Arctic Awareness Week 2026', 'Polar bear enrichment, climate talks and exclusive beluga viewing.', '2026-09-07', '9:00 AM - 6:00 PM', 'Arctic Tundra', 'Week', '#5b8fa8', 'Conservation Talk');
  EV.run('Halloween 2026', 'Torch-lit tours, reptile encounters and Haunted Habitat trail.', '2026-10-31', '5:00 PM - 9:30 PM', 'Reptile World', 'Seasonal', '#c05050', 'Seasonal Celebration');
  EV.run('Rainforest After Dark 2026', 'Torchlit walks, nocturnal animal spotting and sound installations.', '2026-11-21', '6:30 PM - 9:30 PM', 'Rainforest Canopy', 'Exclusive', '#2d6a4f', 'Seasonal Celebration');
  EV.run('Winter Conservation Gala', 'Annual fundraising gala supporting our international conservation projects.', '2026-12-05', '6:00 PM - 10:00 PM', 'Visitor Centre', 'Gala', '#c9963a', 'Conservation Talk');
  EV.finalize();

  const F = db.prepare('INSERT INTO faqs (question,answer,category) VALUES (?,?,?)');
  F.run('What are the opening hours?', 'WildVista is open every day including bank holidays and Christmas from 9:00 AM to 6:00 PM. Last entry 5:00 PM.', 'Your Visit');
  F.run('Is the park open on Christmas Day?', 'Yes, every day of the year. 9:00 AM to 6:00 PM, 365 days a year.', 'Your Visit');
  F.run('How long does a visit take?', 'Most visitors spend 4 to 6 hours. We recommend a full day to see everything comfortably.', 'Your Visit');
  F.run('Can I bring a picnic?', 'Yes. Picnic areas are throughout the park. We also have three cafes and a restaurant.', 'Your Visit');
  F.run('Is there parking on site?', 'Yes, a large free car park is next to the main entrance with Blue Badge spaces.', 'Getting Here');
  F.run('How do I get here by public transport?', 'WildVista is a 10-minute walk from the nearest train station. Several bus routes stop at the entrance.', 'Getting Here');
  F.run('Are pets allowed?', 'Pets are not permitted. Registered assistance dogs are welcome throughout.', 'Your Visit');
  F.run('Is the park wheelchair accessible?', 'Yes. All main pathways are paved and accessible. Complimentary wheelchair loan at reception.', 'Accessibility');
  F.run('Are there baby changing facilities?', 'Baby changing facilities are in all toilet blocks. A family feeding room is in the visitor centre.', 'Accessibility');
  F.run('Can I take photographs?', 'Personal photography is encouraged. Commercial use or drones require prior written permission.', 'Facilities');
  F.run('How does WildVista support conservation?', '15% of all income funds international conservation projects and European breeding programmes.', 'Conservation');
  F.run('Can I adopt an animal?', 'Yes. Our Adopt An Animal programme offers symbolic adoption with certificate and keeper updates.', 'Conservation');
  F.finalize();

  console.log('Database seeded successfully.');
});

db.close();
