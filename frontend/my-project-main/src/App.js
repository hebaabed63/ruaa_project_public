import AppRoutes from "./routes/AppRoutes";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
<>
  {/* Routes */}
  <AppRoutes/>
  <ToastContainer />
</>
  );
}
export default App;