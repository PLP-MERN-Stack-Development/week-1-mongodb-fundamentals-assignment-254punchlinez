# 🗄️ MongoDB Bookstore Assignment - Week 1

This repository contains the complete solution for the MongoDB Data Layer Fundamentals assignment, including database setup, CRUD operations, advanced queries, aggregation pipelines, and indexing.

## 📋 Project Structure

\`\`\`
mongodb-bookstore-assignment/
├── insert_books.js          # Script to populate the database with sample books
├── queries.js              # All MongoDB queries for the assignment tasks
├── README.md               # This file - setup and usage instructions
└── screenshots/            # Screenshots of MongoDB Compass/Atlas (add manually)
\`\`\`

## 🚀 Setup Instructions

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   \`\`\`bash
   # On macOS using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # On Ubuntu
   sudo apt-get install -y mongodb

   # On Windows - Download from MongoDB official website
   \`\`\`

2. **Start MongoDB Service**
   \`\`\`bash
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community

   # On Windows
   net start MongoDB
   \`\`\`

3. **Install MongoDB Shell (mongosh)**
   \`\`\`bash
   # Download from: https://www.mongodb.com/try/download/shell
   # Or install via package manager
   npm install -g mongosh
   \`\`\`

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace `mongodb://localhost:27017` with your Atlas connection string in the commands below

## 🗄️ Database Setup

1. **Create the database and collection**
   \`\`\`bash
   mongosh
   use plp_bookstore
   db.createCollection("books")
   \`\`\`

2. **Populate the database**
   \`\`\`bash
   # Run the insert script
   mongosh plp_bookstore insert_books.js
   \`\`\`

3. **Verify the data**
   \`\`\`bash
   mongosh plp_bookstore
   db.books.countDocuments()  # Should return 15
   db.books.findOne()         # Display one sample document
   \`\`\`

## 🔍 Running the Queries

### Execute All Queries
\`\`\`bash
mongosh plp_bookstore queries.js
\`\`\`

### Execute Individual Query Sections
\`\`\`bash
# Connect to the database first
mongosh plp_bookstore

# Then copy and paste specific sections from queries.js
\`\`\`

## 📊 Assignment Tasks Completed

### ✅ Task 1: MongoDB Setup
- [x] Database `plp_bookstore` created
- [x] Collection `books` created
- [x] Sample data inserted (15 books)

### ✅ Task 2: Basic CRUD Operations
- [x] Insert 15+ book documents with all required fields
- [x] Find books by genre
- [x] Find books published after a specific year
- [x] Find books by author
- [x] Update book price
- [x] Delete book by title

### ✅ Task 3: Advanced Queries
- [x] Complex filtering (in_stock AND published_year)
- [x] Projection (specific fields only)
- [x] Sorting (ascending and descending)
- [x] Pagination with limit and skip

### ✅ Task 4: Aggregation Pipeline
- [x] Average price by genre
- [x] Author with most books
- [x] Books grouped by publication decade

### ✅ Task 5: Indexing
- [x] Single field index on `title`
- [x] Compound index on `author` and `published_year`
- [x] Performance analysis with `explain()`

## 📈 Sample Query Results

### Books by Genre
\`\`\`javascript
// Fiction books
db.books.find({ genre: "Fiction" })
\`\`\`

### Aggregation Example - Average Price by Genre
\`\`\`javascript
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { averagePrice: -1 } }
])
\`\`\`

### Index Performance
\`\`\`javascript
// Before indexing - Collection scan
db.books.find({ title: "The Great Gatsby" }).explain("executionStats")

// After indexing - Index scan (faster)
db.books.createIndex({ title: 1 })
db.books.find({ title: "The Great Gatsby" }).explain("executionStats")
\`\`\`

## 🔧 Troubleshooting

### Common Issues

1. **Connection Error**
   \`\`\`
   Error: couldn't connect to server
   \`\`\`
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - For Atlas: verify connection string and network access

2. **Database Not Found**
   \`\`\`
   Error: Database 'plp_bookstore' not found
   \`\`\`
   - Run `use plp_bookstore` first
   - Execute the insert script to create the database

3. **Permission Denied**
   \`\`\`
   Error: not authorized
   \`\`\`
   - For local MongoDB: ensure proper user permissions
   - For Atlas: check database user credentials

### Verification Commands
\`\`\`javascript
// Check database exists
show dbs

// Check collections
show collections

// Count documents
db.books.countDocuments()

// Check indexes
db.books.getIndexes()
\`\`\`



## 📚 Additional Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🤝 Contributing

This is an educational assignment. Feel free to:
- Add more sample books to the dataset
- Create additional query examples
- Experiment with different aggregation pipelines
- Test various indexing strategies

---
