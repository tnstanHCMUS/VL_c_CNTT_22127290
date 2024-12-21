server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mqtt = require('mqtt');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); //thay public bằng folder nào chứa script

const MQTT_BROKER = "mqtt://test.mosquitto.org";
const MQTT_TOPIC_alert = "/pet_feeder/alert"; 
const MQTT_TOPIC_release_food = "/pet_feeder/release_food"; 
const MQTT_TOPIC_feed = "/pet_feeder/history";
const MQTT_TOPIC_weight = "/pet_feeder/weight";
//const clientID = "mqtt-explorer-4ed131bc";

//connect mqtt
const client = mqtt.connect(MQTT_BROKER, {
  //clientId: clientID
});

//connect db
const mongoURI = "mongodb+srv://khavinhthuan114:qozEkCoDhSHsIaH6@cluster0.dlkvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // thay bằng tên mongodb
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const UserSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { surname, name, email, password, cfpassword } = req.body;

  if (password !== cfpassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, message: "Email already exists." });
      }

      const newUser = new User({ surname, name, email, password });
      await newUser.save();
      res.status(201).json({ success: true, message: "User created successfully." });
  } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm kiếm người dùng dựa trên email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    // So sánh mật khẩu
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }

    // Nếu thành công
    res.status(200).json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/*client.on('connect', () => {
  console.log("Đã kết nối tới MQTT Broker");

  client.subscribe(MQTT_TOPIC_alert, (err) => {
    if (err) {
      console.error("Không thể subscribe vào topic:", err);
    } else {
      console.log(`Đã subscribe vào topic ${MQTT_TOPIC_alert}`);
    }
  });
  client.subscribe(MQTT_TOPIC_release_food, (err) => {
    if (err) {
      console.error("Không thể subscribe vào topic:", err);
    } else {
      console.log(`Đã subscribe vào topic ${MQTT_TOPIC_release_food}`);
    }
  });
  client.subscribe(MQTT_TOPIC_feed, (err) => {
    if (err) {
      console.error("Không thể subscribe vào topic:", err);
    } else {
      console.log(`Đã subscribe vào topic ${MQTT_TOPIC_feed}`);
    }
  });
  client.subscribe(MQTT_TOPIC_weight, (err) => {
    if (err) {
      console.error("Không thể subscribe vào topic:", err);
    } else {
      console.log(`Đã subscribe vào topic ${MQTT_TOPIC_weight}`);
    }
  });
});

app.post('/feed', (req, res) => {
  const { action } = req.body;

  if (action === 'feed') {
    const message = 'feed';
    client.publish(MQTT_TOPIC_release_food, message, () => {
      console.log('Feed action sent to MQTT broker');
    });

    res.json({ success: true, message: 'Feed action sent to MQTT broker' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid action' });
  }
});*/

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));