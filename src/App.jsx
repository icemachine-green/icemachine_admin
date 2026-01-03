import './App.css';
import SideBar from "./components/sidebar/SideBar.jsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <SideBar />  
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App;
