const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require('cors'); 


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); 

const app = express();
const port = 3000;
app.use(cors()); 

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const filePath = "./mockdata.json";
//Helper func

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
// ================ Itinerary API Endpoints ==================

// 1. Get all itinerary items for a specific trip (by tripId)
app.get("/itinerary/:tripId", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  res.json(trip.itinerary);

});

// 2. Get a specific itinerary item by tripId and itinerary ID
app.get("/itinerary/:tripId/:id", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.itinerary.find((i) => i.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ message: "Itinerary item not found" });
  }

  res.json(item);
});

// 3. Add a new itinerary item to a specific trip
app.post("/itinerary/:tripId", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId);
  const trip = data.find((t) => t.id === tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const { title, location, date, time, category, priority, status } = req.body;

  const requiredFields = ['title', 'location', 'date', 'time', 'category', 'priority', 'status'];
  const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === "");

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: "Missing or empty required fields", 
      missingFields: missingFields 
    });
  }

  const maxId = trip.itinerary.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const newId = maxId + 1;

  const newItem = {
    id: newId,
    title,
    location,
    date,
    time,
    category,
    priority,
    status
  };

  trip.itinerary.push(newItem);
  writeData(data);

  res.status(201).json({
    message: "Itinerary created successfully",
    data: newItem
  });
});
// 4. Update an existing itinerary item by tripId and itinerary ID
// note: các fields ko thay đổi cũng cần được gửi lên để tránh lỗi thiếu field nha mng <3
app.put("/itinerary/:tripId/:id", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId); 
  const itemId = parseInt(req.params.id);

  const trip = data.find((t) => t.id === tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const index = trip.itinerary.findIndex((i) => i.id === itemId);
  if (index === -1) {
    return res.status(404).json({ message: "Itinerary item not found" });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Update data cannot be empty" });
  }

  const requiredFields = ['title', 'location', 'date', 'time', 'category', 'priority', 'status'];
  
   const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === "");

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: "Missing or empty required fields", 
      missingFields: missingFields 
    });
  }

  const { id, ...updateData } = req.body;
  trip.itinerary[index] = { ...trip.itinerary[index], ...updateData, id: itemId };

  writeData(data);
  res.json(trip.itinerary[index]);
});

// 5. Delete an itinerary item by tripId and itinerary ID
app.delete("/itinerary/:tripId/:id", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const index = trip.itinerary.findIndex(
    (i) => i.id === parseInt(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({ message: "Itinerary item not found" });
  }

  const deletedItem = trip.itinerary.splice(index, 1);
  writeData(data);

  res.json(deletedItem);
});
// ================ Packing List API Endpoints ==================

const VALID_PACKING_CATEGORIES = ["Clothes", "Documents", "Electronics", "Medicine", "Personal", "Other"];
const VALID_REQUIRED_STATUS    = ["Required", "Optional"];
const VALID_PACKED_STATUS      = ["Packed", "Not Packed"];

// 1. Get all packing items for a specific trip
app.get("/packing/:tripId", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  res.json(trip.packingList);
});

// 2. Get a specific packing item by tripId and item ID
app.get("/packing/:tripId/:id", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.packingList.find((i) => i.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ message: "Packing item not found" });
  }

  res.json(item);
});

// 3. Add a new packing item to a specific trip
app.post("/packing/:tripId", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId);
  const trip = data.find((t) => t.id === tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const { name, category, quantity, requiredStatus, packedStatus } = req.body;

  const requiredFields = ["name", "category", "quantity", "requiredStatus", "packedStatus"];
  const missingFields = requiredFields.filter(
    (field) => !req.body[field] && req.body[field] !== 0 || req.body[field]?.toString().trim() === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({ message: "Missing or empty required fields", missingFields });
  }

  if (!VALID_PACKING_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Must be one of: ${VALID_PACKING_CATEGORIES.join(", ")}`,
    });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: "Quantity must be a positive integer (>= 1)" });
  }

  if (!VALID_REQUIRED_STATUS.includes(requiredStatus)) {
    return res.status(400).json({
      message: `Invalid requiredStatus. Must be one of: ${VALID_REQUIRED_STATUS.join(", ")}`,
    });
  }

  if (!VALID_PACKED_STATUS.includes(packedStatus)) {
    return res.status(400).json({
      message: `Invalid packedStatus. Must be one of: ${VALID_PACKED_STATUS.join(", ")}`,
    });
  }

  const maxId = trip.packingList.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const newItem = {
    id: maxId + 1,
    name: name.trim(),
    category,
    quantity: qty,
    requiredStatus,
    packedStatus,
  };

  trip.packingList.push(newItem);
  writeData(data);

  res.status(201).json({ message: "Packing item created successfully", data: newItem });
});

// 4. Update an existing packing item by tripId and item ID
// note: all fields (even unchanged ones) must be included in the request body
app.put("/packing/:tripId/:id", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId);
  const itemId = parseInt(req.params.id);

  const trip = data.find((t) => t.id === tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const index = trip.packingList.findIndex((i) => i.id === itemId);
  if (index === -1) {
    return res.status(404).json({ message: "Packing item not found" });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Update data cannot be empty" });
  }

  const { name, category, quantity, requiredStatus, packedStatus } = req.body;

  const requiredFields = ["name", "category", "quantity", "requiredStatus", "packedStatus"];
  const missingFields = requiredFields.filter(
    (field) => !req.body[field] && req.body[field] !== 0 || req.body[field]?.toString().trim() === ""
  );

  if (missingFields.length > 0) {
    return res.status(400).json({ message: "Missing or empty required fields", missingFields });
  }

  if (!VALID_PACKING_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Invalid category. Must be one of: ${VALID_PACKING_CATEGORIES.join(", ")}`,
    });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ message: "Quantity must be a positive integer (>= 1)" });
  }

  if (!VALID_REQUIRED_STATUS.includes(requiredStatus)) {
    return res.status(400).json({
      message: `Invalid requiredStatus. Must be one of: ${VALID_REQUIRED_STATUS.join(", ")}`,
    });
  }

  if (!VALID_PACKED_STATUS.includes(packedStatus)) {
    return res.status(400).json({
      message: `Invalid packedStatus. Must be one of: ${VALID_PACKED_STATUS.join(", ")}`,
    });
  }

  trip.packingList[index] = { id: itemId, name: name.trim(), category, quantity: qty, requiredStatus, packedStatus };
  writeData(data);

  res.json(trip.packingList[index]);
});

// 5. Delete a packing item by tripId and item ID
app.delete("/packing/:tripId/:id", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const index = trip.packingList.findIndex((i) => i.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Packing item not found" });
  }

  const deletedItem = trip.packingList.splice(index, 1);
  writeData(data);

  res.json(deletedItem);
});

// ============================Trip API Endpoints========================================
// 1. Get all trips
app.get("/trips", (req, res) => {
  const data = readData();
  res.json(data); // Trả về tất cả dữ liệu trips
});
// 2. Get a specific trip by tripId
app.get("/trips/:tripId", (req, res) => {
  const data = readData();
  const trip = data.find((t) => t.id === parseInt(req.params.tripId));

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  res.json(trip);
});
// 3. Create a new trip
app.post("/trips", (req, res) => {
  const data = readData();
  const { tripName, budget } = req.body;

  if (!tripName || !budget) {
    return res.status(400).json({ 
      message: "Missing required fields: tripName and budget" 
    });
  }

  const maxId = data.reduce((max, trip) => (trip.id > max ? trip.id : max), 0);
  const newTrip = {
    id: maxId + 1,  
    tripName,
    budget,
    itinerary: [],  
    packingList: [], 
    budgetItems: []  
  };

  data.push(newTrip);
  writeData(data);

  res.status(201).json({
    message: "Trip created successfully",
    data: newTrip
  });
});
// 4. Update a specific trip by tripId
app.put("/trips/:tripId", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId);
  const trip = data.find((t) => t.id === tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const { tripName, budget } = req.body;

  if (!tripName || !budget) {
    return res.status(400).json({ 
      message: "Missing required fields: tripName and budget" 
    });
  }

  trip.tripName = tripName || trip.tripName;
  trip.budget = budget || trip.budget;
  
  writeData(data); 

  res.json({
    message: "Trip updated successfully",
    data: trip
  });
});
// 5. Delete a specific trip by tripId
app.delete("/trips/:tripId", (req, res) => {
  const data = readData();
  const tripId = parseInt(req.params.tripId);
  const tripIndex = data.findIndex((t) => t.id === tripId);

  if (tripIndex === -1) {
    return res.status(404).json({ message: "Trip not found" });
  }

  // Xóa trip khỏi mảng
  const deletedTrip = data.splice(tripIndex, 1);
  writeData(data);

  res.json({
    message: "Trip deleted successfully",
    data: deletedTrip
  });
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
