-- ============================================================
--  schema.sql — AutoLux Car Showroom Database
--  Run this in MySQL Workbench or the MySQL CLI:
--    mysql -u root -p < schema.sql
-- ============================================================

-- Create & select the database
CREATE DATABASE IF NOT EXISTS autolux_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE autolux_db;

-- ── CARS TABLE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  brand          VARCHAR(100)   NOT NULL,
  name           VARCHAR(150)   NOT NULL,
  year           YEAR           NOT NULL DEFAULT 2024,
  type           ENUM('Luxury','Sport','SUV','Sedan','Hatchback') NOT NULL DEFAULT 'Sedan',
  price          DECIMAL(12,2)  NOT NULL,
  mileage        INT            NOT NULL DEFAULT 0,
  engine         VARCHAR(100),
  horsepower     INT,
  transmission   VARCHAR(100),
  color          VARCHAR(100),
  fuel           ENUM('Petrol','Diesel','Electric','Hybrid') DEFAULT 'Petrol',
  seats          TINYINT        DEFAULT 5,
  badge          VARCHAR(50),
  badge_class    VARCHAR(50),
  description    TEXT,
  features       JSON,          -- stored as JSON array of strings
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── INQUIRIES TABLE ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  fname      VARCHAR(100) NOT NULL,
  lname      VARCHAR(100) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  phone      VARCHAR(30),
  subject    ENUM('test-drive','inquiry','financing','service','other') NOT NULL,
  car_id     INT,
  message    TEXT         NOT NULL,
  status     ENUM('new','read','replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL
);

-- ── SEED DATA — Sample Cars ───────────────────────────────────
INSERT INTO cars (brand, name, year, type, price, mileage, engine, horsepower, transmission, color, fuel, seats, badge, badge_class, description, features) VALUES

('BMW', 'M4 Competition', 2024, 'Sport', 85000.00, 0,
 '3.0L Twin-Turbo I6', 503, '8-Speed Automatic', 'Brooklyn Grey', 'Petrol', 4,
 'New Arrival', 'badge-new',
 'The BMW M4 Competition is the pinnacle of performance engineering. With a 503hp twin-turbo engine, M xDrive all-wheel-drive, and a refined interior packed with tech, it delivers supercar thrills in a usable everyday package.',
 '["Head-Up Display", "Harman Kardon Sound", "M Carbon Seats", "Adaptive M Suspension", "Wireless CarPlay"]'),

('Mercedes', 'C-Class C300', 2024, 'Luxury', 55000.00, 0,
 '2.0L Turbo I4', 255, '9-Speed Automatic', 'Obsidian Black', 'Petrol', 5,
 'Best Seller', 'badge-hot',
 'The new Mercedes C-Class sets the bar for the luxury sedan segment. Its stunning interior is inspired by the flagship S-Class.',
 '["MBUX Infotainment", "Panoramic Sunroof", "Burmester Sound", "64-Color Ambient Lighting", "Driver Assistance Package"]'),

('Porsche', 'Cayenne GTS', 2023, 'SUV', 120000.00, 8000,
 '4.0L Twin-Turbo V8', 460, '8-Speed PDK', 'Carmine Red', 'Petrol', 5,
 'Low Mileage', 'badge-low',
 'The Porsche Cayenne GTS combines the practicality of a premium SUV with the performance DNA of a true sports car.',
 '["Sport Chrono Package", "PASM Air Suspension", "Bose Surround Sound", "Night Vision Assist", "Panoramic Roof System"]'),

('Toyota', 'Land Cruiser 300', 2023, 'SUV', 90000.00, 15000,
 '3.5L Twin-Turbo V6', 409, '10-Speed Automatic', 'Platinum White Pearl', 'Petrol', 7,
 '7 Seats', 'badge-new',
 'The legendary Toyota Land Cruiser 300 Series — more capable, more refined, and more efficient than ever.',
 '["Kinetic Dynamic Suspension", "Multi-Terrain Select", "7-Seat Leather Interior", "JBL Premium Audio", "360-Degree Camera"]'),

('Audi', 'A6 Quattro', 2024, 'Sedan', 62000.00, 0,
 '3.0L TFSI V6', 335, '7-Speed S Tronic', 'Navarra Blue Metallic', 'Petrol', 5,
 'New Arrival', 'badge-new',
 'The Audi A6 is a masterclass in understated luxury. Its Virtual Cockpit Pro, quattro all-wheel-drive, and refined cabin make every journey feel special.',
 '["Audi Virtual Cockpit Pro", "Matrix LED Headlights", "Bang and Olufsen 3D Sound", "Quattro AWD", "Adaptive Cruise Assist"]'),

('Hyundai', 'Tucson N-Line', 2024, 'SUV', 28000.00, 0,
 '1.6L Turbo I4', 180, '7-Speed DCT', 'Shimmering Silver', 'Petrol', 5,
 'Great Value', 'badge-low',
 'The Hyundai Tucson N-Line brings sporty styling and impressive value to the competitive compact SUV segment.',
 '["10.25in Touchscreen", "Digital Cluster", "Blind-Spot Collision Warning", "Safe Exit Assist", "Wireless Charging"]'),

('Ford', 'Mustang GT', 2023, 'Sport', 42000.00, 5000,
 '5.0L V8', 450, '6-Speed Manual', 'Grabber Blue', 'Petrol', 4,
 'Collectors Pick', 'badge-hot',
 'The Ford Mustang GT — an American icon. The thunderous 5.0L Coyote V8 produces 450hp and delivers a visceral driving experience.',
 '["5.0L Coyote V8", "Brembo Brakes", "MagneRide Suspension", "SYNC 4 Infotainment", "Launch Control"]'),

('Mercedes', 'GLE 450 AMG', 2023, 'Luxury', 95000.00, 12000,
 '3.0L Inline-6 Mild Hybrid', 362, '9-Speed Automatic', 'Designo Diamond White Bright', 'Hybrid', 5,
 'Hybrid', 'badge-new',
 'The Mercedes GLE 450 AMG-Line offers executive SUV presence with the efficiency of mild-hybrid technology.',
 '["E-Active Body Control", "MBUX with Augmented Reality", "Burmester Surround Sound", "Parking Package Pro", "AMG Styling Package"]');

-- ── Useful Queries for Reference ─────────────────────────────

-- View all cars:
-- SELECT * FROM cars;

-- Filter by type:
-- SELECT * FROM cars WHERE type = 'SUV';

-- Filter by price range:
-- SELECT * FROM cars WHERE price BETWEEN 30000 AND 70000;

-- View all inquiries with car info:
-- SELECT i.*, c.name AS car_name FROM inquiries i LEFT JOIN cars c ON i.car_id = c.id;

-- Count inquiries by subject:
-- SELECT subject, COUNT(*) AS total FROM inquiries GROUP BY subject;