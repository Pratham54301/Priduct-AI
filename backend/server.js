require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

console.log('MONGO_URI:', process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Product.AI backend running');
});

const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const historyRoutes = require('./routes/history');
require('./jobs/dailyReport');

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 