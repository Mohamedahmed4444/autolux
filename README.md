# 🚗 AutoLux — Premium Car Showroom
**Web Development Course — Final Project**

---

## 📁 Project Structure

```
car-showroom/
│
├── index.html          ← Home page
├── cars.html           ← Cars listing + search/filter
├── about.html          ← About the showroom
├── contact.html        ← Contact form & test drive booking
│
├── style.css           ← All styles (one shared stylesheet)
├── data.js             ← Static car data (frontend demo)
├── main.js             ← Shared JS (navbar, cards, modal)
│
└── backend/
    ├── server.js       ← Node.js + Express backend
    ├── schema.sql      ← MySQL database schema + seed data
    └── package.json    ← Node dependencies
```

---

## ✅ Project Requirements Coverage

| Requirement | Status | Detail |
|---|---|---|
| HTML, CSS, JavaScript | ✅ | 4 HTML pages, 1 CSS file, 2 JS files |
| Node.js Backend | ✅ | Express REST API in `backend/server.js` |
| Multiple Webpages | ✅ | Home, Cars, About, Contact |
| MySQL Database | ✅ | `cars` table + `inquiries` table in `schema.sql` |
| Clean UI | ✅ | Luxury dark theme with gold accents |
| Pairs Project | ✅ | Designed for 2-person submission |

---

## 🚀 How to Run

### 1. Set Up the Database
```bash
# Open MySQL and run the schema file
mysql -u root -p < backend/schema.sql
```

### 2. Configure Database Connection
Open `backend/server.js` and update lines 22–26:
```js
const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',        // your MySQL username
  password: 'yourpassword', // your MySQL password
  database: 'autolux_db'
});
```

### 3. Install & Start Backend
```bash
cd backend
npm install
node server.js
# Server runs at http://localhost:3000
```

### 4. View the Frontend
- Place the HTML/CSS/JS files in `backend/public/` folder, OR
- Simply open `index.html` directly in a browser to view the frontend with static data.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | Get all cars |
| GET | `/api/cars?brand=BMW` | Filter by brand |
| GET | `/api/cars?type=SUV` | Filter by type |
| GET | `/api/cars?min_price=30000&max_price=70000` | Filter by price |
| GET | `/api/cars?search=mercedes` | Search by keyword |
| GET | `/api/cars/:id` | Get single car |
| POST | `/api/cars` | Add a new car |
| PUT | `/api/cars/:id` | Update a car |
| DELETE | `/api/cars/:id` | Delete a car |
| POST | `/api/contact` | Submit inquiry/test drive |
| GET | `/api/inquiries` | View all inquiries |

---

## 🗃️ Database Tables

### `cars` table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| brand | VARCHAR | Car brand (BMW, Toyota…) |
| name | VARCHAR | Model name |
| year | YEAR | Model year |
| type | ENUM | Luxury / Sport / SUV / Sedan / Hatchback |
| price | DECIMAL | Price in USD |
| mileage | INT | Kilometers driven |
| engine | VARCHAR | Engine description |
| horsepower | INT | HP rating |
| transmission | VARCHAR | Gearbox type |
| color | VARCHAR | Exterior color |
| fuel | ENUM | Petrol / Diesel / Electric / Hybrid |
| seats | TINYINT | Number of seats |
| description | TEXT | Full car description |
| features | JSON | Array of key features |

### `inquiries` table
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| fname, lname | VARCHAR | Customer name |
| email | VARCHAR | Customer email |
| phone | VARCHAR | Customer phone |
| subject | ENUM | Reason for contact |
| car_id | INT | Foreign key → cars.id |
| message | TEXT | Customer message |
| status | ENUM | new / read / replied |

---

## 🎨 Design Choices
- **Theme:** Dark luxury with gold accents — inspired by premium automotive branding
- **Fonts:** Bebas Neue (display) + DM Sans (body)
- **Animations:** CSS keyframes on page load, scroll-triggered card reveals
- **Responsive:** Full mobile support with hamburger nav

---

## 👥 Team
- Student 1: ___________________
- Student 2: ___________________
- Course: Web Development
- Submission Date: ___________________
