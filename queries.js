queries.js
// MongoDB Queries for PLP Bookstore Assignment
// Run individual sections using mongosh plp_bookstore

// Connect to the database
use("plp_bookstore")

console.log("=== TASK 2: BASIC CRUD OPERATIONS ===\n")

// 1. Find all books in a specific genre (Fiction)
console.log("1. Books in Fiction genre:")
db.books.find({ genre: "Fiction" }).forEach(printjson)

console.log("\n2. Books published after 2000:")
db.books.find({ published_year: { $gt: 2000 } }).forEach(printjson)

console.log("\n3. Books by J.R.R. Tolkien:")
db.books.find({ author: "J.R.R. Tolkien" }).forEach(printjson)

// 4. Update the price of a specific book
console.log("\n4. Updating price of 'The Great Gatsby':")
const updateResult = db.books.updateOne({ title: "The Great Gatsby" }, { $set: { price: 15.99 } })
console.log("Update result:", updateResult)

// Verify the update
console.log("Updated book:")
db.books.findOne({ title: "The Great Gatsby" })

// 5. Delete a book by title (we'll add it back after)
console.log("\n5. Deleting 'Gone Girl':")
const deleteResult = db.books.deleteOne({ title: "Gone Girl" })
console.log("Delete result:", deleteResult)

console.log("\n=== TASK 3: ADVANCED QUERIES ===\n")

// 1. Books that are in stock AND published after 2010
console.log("1. Books in stock and published after 2010:")
db.books
  .find({
    $and: [{ in_stock: true }, { published_year: { $gt: 2010 } }],
  })
  .forEach(printjson)

// 2. Projection - only title, author, and price
console.log("\n2. Books with projection (title, author, price only):")
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).forEach(printjson)

// 3. Sorting by price (ascending)
console.log("\n3. Books sorted by price (ascending):")
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 }).forEach(printjson)

// 4. Sorting by price (descending)
console.log("\n4. Books sorted by price (descending):")
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 }).forEach(printjson)

// 5. Pagination - Page 1 (first 5 books)
console.log("\n5. Pagination - Page 1 (first 5 books):")
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).limit(5).forEach(printjson)

// 6. Pagination - Page 2 (next 5 books)
console.log("\n6. Pagination - Page 2 (next 5 books):")
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).skip(5).limit(5).forEach(printjson)

console.log("\n=== TASK 4: AGGREGATION PIPELINES ===\n")

// 1. Average price of books by genre
console.log("1. Average price by genre:")
db.books
  .aggregate([
    {
      $group: {
        _id: "$genre",
        averagePrice: { $avg: "$price" },
        bookCount: { $sum: 1 },
      },
    },
    {
      $sort: { averagePrice: -1 },
    },
  ])
  .forEach(printjson)

// 2. Author with the most books
console.log("\n2. Authors with book counts:")
db.books
  .aggregate([
    {
      $group: {
        _id: "$author",
        bookCount: { $sum: 1 },
        books: { $push: "$title" },
      },
    },
    {
      $sort: { bookCount: -1 },
    },
  ])
  .forEach(printjson)

// 3. Books grouped by publication decade
console.log("\n3. Books by publication decade:")
db.books
  .aggregate([
    {
      $addFields: {
        decade: {
          $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10],
        },
      },
    },
    {
      $group: {
        _id: "$decade",
        bookCount: { $sum: 1 },
        books: { $push: { title: "$title", year: "$published_year" } },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
  .forEach(printjson)

console.log("\n=== TASK 5: INDEXING ===\n")

// 1. Create index on title field
console.log("1. Creating index on 'title' field:")
const titleIndexResult = db.books.createIndex({ title: 1 })
console.log("Title index result:", titleIndexResult)

// 2. Create compound index on author and published_year
console.log("\n2. Creating compound index on 'author' and 'published_year':")
const compoundIndexResult = db.books.createIndex({
  author: 1,
  published_year: -1,
})
console.log("Compound index result:", compoundIndexResult)

// 3. List all indexes
console.log("\n3. All indexes on books collection:")
db.books.getIndexes().forEach(printjson)

// 4. Performance comparison with explain()
console.log("\n4. Query performance analysis:")

console.log("Query without using index (genre field - no index):")
const explainNoIndex = db.books.find({ genre: "Fiction" }).explain("executionStats")
console.log("Execution stats:", {
  totalDocsExamined: explainNoIndex.executionStats.totalDocsExamined,
  totalDocsReturned: explainNoIndex.executionStats.totalDocsReturned,
  executionTimeMillis: explainNoIndex.executionStats.executionTimeMillis,
})

console.log("\nQuery using title index:")
const explainWithIndex = db.books.find({ title: "The Great Gatsby" }).explain("executionStats")
console.log("Execution stats:", {
  totalDocsExamined: explainWithIndex.executionStats.totalDocsExamined,
  totalDocsReturned: explainWithIndex.executionStats.totalDocsReturned,
  executionTimeMillis: explainWithIndex.executionStats.executionTimeMillis,
  indexUsed: explainWithIndex.executionStats.executionStages.indexName || "COLLSCAN",
})

console.log("\nQuery using compound index (author + published_year):")
const explainCompoundIndex = db.books
  .find({
    author: "J.R.R. Tolkien",
    published_year: { $gte: 1950 },
  })
  .explain("executionStats")
console.log("Execution stats:", {
  totalDocsExamined: explainCompoundIndex.executionStats.totalDocsExamined,
  totalDocsReturned: explainCompoundIndex.executionStats.totalDocsReturned,
  executionTimeMillis: explainCompoundIndex.executionStats.executionTimeMillis,
})
