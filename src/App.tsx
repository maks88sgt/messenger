import React from 'react';
import './App.css';
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {ErrorPage} from "./components/error-page/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <div>
          <h1>Hello World</h1>
        </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
