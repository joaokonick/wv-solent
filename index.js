const express = require('express');
const path    = require('path');
const sqlite3 = require('sqlite3').verbose();

const app  = express();
const PORT = 3000;

const db = new sqlite3.Database(
  path.join(__dirname, 'database', 'wildlife.db'),
  err => { if (err) console.error(err.message); else console.log('DB connected.'); }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ── HOME ── */
app.get('/', (req, res) => {
  db.all(
    `SELECT h.*, COUNT(e.id) AS exp_count
     FROM habitats h LEFT JOIN experiences e ON e.habitat_id = h.id
     GROUP BY h.id ORDER BY h.sort_order`,
    [],
    (err, habitats) => {
      if (err) return res.status(500).send(err.message);
      db.all(`SELECT * FROM events ORDER BY event_date LIMIT 3`, [], (err2, events) => {
        if (err2) return res.status(500).send(err2.message);
        res.render('pages/index', { title: 'WildVista — Eco-Adventure Park', habitats, events });
      });
    }
  );
});

/* ── HABITATS LIST ── */
app.get('/habitats', (req, res) => {
  db.all(
    `SELECT h.*, COUNT(e.id) AS exp_count
     FROM habitats h LEFT JOIN experiences e ON e.habitat_id = h.id
     GROUP BY h.id ORDER BY h.sort_order`,
    [],
    (err, habitats) => {
      if (err) return res.status(500).send(err.message);
      res.render('pages/habitats', { title: 'Habitats — WildVista', habitats });
    }
  );
});

/* ── HABITAT DETAIL ── */
app.get('/habitats/:id', (req, res) => {
  db.get('SELECT * FROM habitats WHERE id = ?', [req.params.id], (err, habitat) => {
    if (err || !habitat)
      return res.status(404).render('pages/404', { title: '404 — WildVista' });
    db.all('SELECT * FROM experiences WHERE habitat_id = ? ORDER BY id', [req.params.id], (err2, experiences) => {
      if (err2) return res.status(500).send(err2.message);
      res.render('pages/habitat-details', {
        title: `${habitat.name} — WildVista`, habitat, experiences
      });
    });
  });
});

/* ── ACTIVITY DETAIL ── */
app.get('/activity/:id', (req, res) => {
  db.get(
    `SELECT e.*, h.name AS habitat_name, h.id AS habitat_id, h.color AS habitat_color
     FROM experiences e JOIN habitats h ON e.habitat_id = h.id WHERE e.id = ?`,
    [req.params.id],
    (err, activity) => {
      if (err || !activity)
        return res.status(404).render('pages/404', { title: '404 — WildVista' });
      res.render('pages/activity', { title: `${activity.name} — WildVista`, activity });
    }
  );
});

/* ── EVENTS ── */
app.get('/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY event_date', [], (err, events) => {
    if (err) return res.status(500).send(err.message);
    res.render('pages/events', { title: 'Events — WildVista', events });
  });
});

/* ── FAQ ── */
app.get('/faq', (req, res) => {
  db.all('SELECT * FROM faqs ORDER BY category, id', [], (err, faqs) => {
    if (err) return res.status(500).send(err.message);
    const grouped = {};
    faqs.forEach(f => {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    });
    res.render('pages/faq', { title: 'FAQ — WildVista', grouped });
  });
});

/* ── CONTACT GET ── */
app.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact — WildVista', success: null, errors: [] });
});

/* ── CONTACT POST ── */
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const errors = [];
  if (!name    || name.trim().length < 2)
    errors.push('Please enter your full name (at least 2 characters).');
  if (!email   || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.push('Please enter a valid email address.');
  if (!subject || subject.trim().length < 2)
    errors.push('Please select a subject.');
  if (!message || message.trim().length < 10)
    errors.push('Your message must be at least 10 characters long.');

  if (errors.length) {
    return res.render('pages/contact', {
      title: 'Contact — WildVista', success: null, errors
    });
  }

  db.run(
    `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [name.trim(), email.trim(), subject.trim(), message.trim()],
    function(err) {
      if (err) {
        return res.render('pages/contact', {
          title: 'Contact — WildVista', success: null,
          errors: ['Something went wrong. Please try again.']
        });
      }
      res.render('pages/contact', {
        title: 'Contact — WildVista',
        success: "Thank you! Your message has been received. We'll be in touch within one working day.",
        errors: []
      });
    }
  );
});

/* ── 404 ── */
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 — WildVista' });
});

app.listen(PORT, () => {
  console.log(`WildVista running → http://localhost:${PORT}`);
});
