import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("http://localhost:5000/books");
    const data = await response.json();
    setBooks(data);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:5000/books/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchBooks(); // إعادة تحميل الكتب بعد الحذف
    }
  };

  return (
    <div>
      <h1>Book Catalog</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Publication Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{new Date(book.publication_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
