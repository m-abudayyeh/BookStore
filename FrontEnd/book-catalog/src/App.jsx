import React from "react";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

const App = () => {
  return (
    <div>
      <BookForm />
      <BookList />
    </div>
  );
};

export default App;