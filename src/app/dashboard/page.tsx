export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">إدارة الشاليهات</h2>
          <p className="text-gray-600 mt-2">
            إضافة، تعديل، وحذف الشاليهات
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">التقارير</h2>
          <p className="text-gray-600 mt-2">
            عرض الإحصائيات والبيانات
          </p>
        </div>

      </div>
    </div>
  );
}