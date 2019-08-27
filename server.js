const express = require('express');
const connectDB = require('./config/db');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const cors = require('cors');

const app = express();

//Init Middleware
app.use(express.json({ extends: false }));

connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/', users);
app.use('/', require('./routes/api/auth'));
app.use('/', profile);
app.use('/api/posts', posts);

//app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));