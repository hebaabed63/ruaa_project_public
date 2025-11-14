import { Link } from "react-router-dom";
import usePageTitle from "./hooks/usePageTitle";
export default function Home() {
  // Set page title
  usePageTitle("الصفحة الرئيسية");
  return (
    <Link to="/">
    < h1 className="text-xl font-bold p-4">الصفحة الرئيسية</h1>
    </Link>
    );
}
