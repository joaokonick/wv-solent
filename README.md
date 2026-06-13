🌿 WildVista — Eco-Adventure Wildlife Park

A fully server-rendered promotional website for a fictional eco-adventure wildlife park, built as a university web development assessment.
Features


6 Wildlife Habitats — Rainforest Canopy, Savannah Plains, Reptile World, Ocean Discovery, Arctic Tundra, Wetlands & Marshes
16 Experiences & Exhibits — each linked to a habitat with full detail pages
Events System — filterable by year and category using AJAX (no page reload)
Animal Explorer Game — interactive tile-reveal guessing game for younger visitors
AJAX Search — real-time search across habitats and experiences from the navbar
Contact Form — server-side validated, saves to SQLite database
FAQ Page — accordion layout grouped by category
Dark / Light Mode — toggle with localStorage persistence
Fully Responsive — mobile, tablet and desktop layouts
Accessible — semantic HTML, ARIA attributes, skip link, keyboard navigation



Tech Stack

LayerTechnologyServerNode.js + ExpressTemplatingEJSDatabaseSQLite3FrontendVanilla HTML, CSS, JavaScriptFontsGoogle Fonts (Playfair Display + Inter)ImagesPexels (free licence)


No Bootstrap, Tailwind or jQuery — pure CSS and vanilla JS only.




Getting Started

Prerequisites


Node.js v18 or higher


Installation

bash# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/wildvista.git
cd wildvista

# 2. Install dependencies
npm install

# 3. Seed the database
node database/seed.mjs

# 4. Start the server
node index.mjs

Open your browser at http://localhost:5000


macOS users: If port 5000 is blocked, go to System Settings → General → AirDrop & Handoff → disable AirPlay Receiver, then try again.




Project Structure

wildvista/
├── index.mjs                  # Express server and all routes
├── package.json
├── database/
│   ├── seed.mjs               # Creates and populates the database
│   └── wildlife.db            # SQLite database file
├── public/
│   ├── css/
│   │   └── style.css          # All styles — single stylesheet
│   └── js/
│       └── script.js          # All client-side JS including AJAX
└── views/
    ├── partials/
    │   ├── header.ejs
    │   └── footer.ejs
    └── pages/
        ├── index.ejs          # Homepage
        ├── habitats.ejs       # All habitats listing
        ├── habitat-details.ejs
        ├── activity.ejs       # Experience detail
        ├── events.ejs         # Events with AJAX filter
        ├── event-detail.ejs
        ├── explore.ejs        # Animal Explorer game
        ├── faq.ejs
        ├── contact.ejs
        └── 404.ejs


Database Schema

Five tables — all content is database-driven.

habitats          experiences           events
────────          ───────────           ──────
id (PK)           id (PK)               id (PK)
name              habitat_id (FK)       title
tagline           name                  description
description       type                  event_date
long_desc         description           event_time
icon              long_desc             location
color             duration              badge
bg_color          difficulty            badge_color
image_url         image_url             category
sort_order

faqs              contact_messages
────              ────────────────
id (PK)           id (PK)
question          name
answer            email
category          subject
                  message
                  created_at


Pages & Routes

RoutePageGET /HomepageGET /habitatsAll habitatsGET /habitats/:idHabitat detailGET /activity/:idExperience detailGET /eventsEvents (AJAX filtered)GET /events/:idEvent detailGET /exploreAnimal Explorer gameGET /faqFAQ accordionGET /contactContact formPOST /contactForm submission → saved to DBGET /api/searchAJAX — search habitats & experiencesGET /api/eventsAJAX — filter events by year & category


AJAX Features

Search

The navbar search sends a fetch() request to /api/search?q= with a 300ms debounce. The server queries both the habitats and experiences tables and returns JSON. Results are rendered in the DOM without any page reload.

Events Filter

The Events page uses fetch() to call /api/events?year=&category= whenever the year dropdown or category buttons change. The server queries the database with parameterised SQL and returns JSON. The client renders event cards dynamically.


Security


All database queries use parameterised statements — no SQL injection risk
Server-side validation on all contact form fields before DB insertion
EJS uses <%= %> which HTML-encodes output by default, preventing XSS
The database/ directory is not served as a static file



Accessibility


Semantic HTML5 elements throughout (main, nav, section, article, aside)
All images have descriptive alt attributes
Skip navigation link as first focusable element
ARIA attributes on accordion, burger menu and search (aria-expanded, aria-controls, aria-label)
Keyboard navigable throughout
Colour contrast meets WCAG AA standards



Assessment Context

Built for a Web Development module at Solent University. Requirements included:


Node.js + Express + EJS + SQLite3 only
No Bootstrap, Tailwind or jQuery
Database-driven content
AJAX for search and events filtering
Client-side JavaScript validation
Interactive activity page
W3C valid HTML



Images

All photography sourced from Pexels under the Pexels Licence which permits free use without attribution (attribution included as good practice).


Licence

This project was created for educational purposes as part of a university assessment




