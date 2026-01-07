import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom"; // 이 부분이 빠졌거나 에러가 났을 겁니다.
import { reissueThunk } from "./store/thunks/authThunk"; // 경로 확인 필요
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 앱이 처음 로드될 때 쿠키를 확인하여 로그인을 유지합니다.
    dispatch(reissueThunk());
  }, [dispatch]);

  return (
    <div className="App">
      {/* Router.jsx에서 설정한 구조에 따라 
          ProtectedRoute 또는 MainLayout 등이 이 자리에 렌더링됩니다.
      */}
      <Outlet />
    </div>
  );
}

export default App;
