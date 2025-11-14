import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import usePageTitle from "./hooks/usePageTitle";
import usePageTitle from "./hooks/usePageTitle";
{/* (Dynamic Route) */}
export default function UserProfile() {
  const { id } = useParams(); // هنا بنجيب الـ id من الرابط
  
  // Set page title
  usePageTitle("ملف المستخدم");
  
  // Set page title
  usePageTitle(`منصة رؤى التعليمية - ملف المستخدم ${id}`);
  return (
    <Link to="/user/123">
    <div className="p-4">
      <h1 className="text-xl font-bold">ملف المستخدم</h1>
      <p>الـ ID الخاص بالمستخدم هو: {id}</p>
    </div>
    </Link>
  );
}
