const express = require("express");

const fs = require("fs");                          

const path = require("path");
const app = express();

const PORT = 7000;                                 // THIS IS PORT NUMBER OF LOCALHOST

const DATA_PATH = path.join(__dirname, "BOOK_DATA.json");
let books = require(DATA_PATH);

app.use(express.json());                          //Middleware


        // SaveBooks function helps in saving the new books to the file.


function saveBooks(res, callback) {
  fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), (err) => {
    if (err) {
      return res.json({ success: false, message: err.message });
    }
    callback();
  });
}


        //ENDPOINT 1.0)  "GET" Method    (gives all books info).


app.get("/api/books", (req, res) => {
  res.json({ success: true, data: books });
});

       //Endpoint 1.1) GET BY ID   (gives the info desired book by using id as reference).


app.get("/api/book/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.json({ success: false, message: `Book with ID ${id} not found.` });
  }
  res.json({ success: true, data: book });
});


       //ENDPOINT 1.1) gives books author list


app.get("/api/books/html", (req, res) => {
  const html = `
    <h1>All Book Authors</h1>
    <ul>
      ${books.map((book) => `<li>${book.author}</li>`).join("")}
    </ul>
  `;
  res.send(html);
});


      // ENDPOINT 2.0) "POST" Method  (create a new book)


app.post("/api/books", (req, res) => {
  const { title, author, price, publication_date } = req.body;
  if (!title || !author || !price || !publication_date) {
    return res.json({ success: false, message: "All fields are required." });
  }

  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
    price,
    publication_date,
  };

  books.push(newBook);
  saveBooks(res, () => {
    res.json({ success: true, message: "Book added", data: newBook });
  });
});


         // ENDPOINT 3.0) "PUT" Method  (helps in making changing in the exsisting  book/item).
         // url: /api/books/:id   (makes changes to desired book by using id as reference).


app.put("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.json({ success: false, message: `Book with ID ${id} not found.` });
  }

  const { title, author, price, publication_date } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (price) book.price = price;
  if (publication_date) book.publication_date = publication_date;

  saveBooks(res, () => {
    res.json({ success: true, message: "Book updated", data: book });
  });
});


          //endpoint 4.0) "DELETE" Method  (deletes the item/book).
          ///url: /api/books/:id     (deletes the desired item by using id reference of the book).


app.delete("/api/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.json({ success: false, message: `Book with ID ${id} not found.` });
  }

  const removed = books.splice(index, 1)[0];
  saveBooks(res, () => {
    res.json({ success: true, message: "Book deleted", data: removed });
  });
});


           //Displays the server running message along with the port number.


app.listen(PORT, () => {console.log(`Server running at http://localhost:${PORT}`);
});
