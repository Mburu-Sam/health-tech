const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');
const billingRoutes = require('./routes/billing');
require('dotenv').config();

const app = express();
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const io = socketio(server, {
  cors: { origin: process.env.FRONTEND_URL || '*' }
});


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/billing', billingRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running");
});


io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('subscribe', room => socket.join(room));
});


app.set('io', io);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthtech';

connectDB(MONGO_URI)
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
