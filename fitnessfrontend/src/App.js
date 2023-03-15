import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import './index.css'
import { Home, Register, Login, Profile, Activities } from "./routes";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    //errorElement: <NotFound/>,
    children: [
      {
        path: "Login",
        element:  <Login/>,
      },
      {
        path: "Register",
        element: <Register />,
      },
      {
        path: "Profile",
        element: <Profile />,
      },
      {
        path: "Activities",
        element: <Activities/>
      }

    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
