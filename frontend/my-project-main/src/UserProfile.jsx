import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
{/* (Dynamic Route) */}
export default function UserProfile() {
  const { id } = useParams(); // هنا بنجيب الـ id من الرابط
  return (
    <Link to="/user/123">
    <div className="p-4">
      <h1 className="text-xl font-bold">ملف المستخدم</h1>
      <p>الـ ID الخاص بالمستخدم هو: {id}</p>
    </div>
    </Link>
  );
}
