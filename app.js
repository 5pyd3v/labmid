const express = require('express');
const path = require('path');
 
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
 
let events = [
  { id: 1, name: 'Tech Conference 2026', date: '2026-12-10', venue: 'Islamabad' },
  { id: 2, name: 'Music Night', date: '2026-12-20', venue: 'Lahore' }
];
let nextId = 3;
 
app.get('/health', (req, res) => res.json({ status: 'UP' }));
 
app.get('/api/events', (req, res) => res.json(events));
 
app.post('/api/events', (req, res) => {
  const { name, date, venue } = req.body;
  if (!name || !date || !venue) {
    return res.status(400).json({ error: 'name, date and venue are required' });
  }
  const event = { id: nextId++, name, date, venue };
  events.push(event);
  res.status(201).json(event);
});
 
app.delete('/api/events/:id', (req, res) => {
  events = events.filter((e) => e.id !== Number(req.params.id));
  res.json({ deleted: true });
});
 
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log('Event app running on port ' + PORT));
}
module.exports = app;
