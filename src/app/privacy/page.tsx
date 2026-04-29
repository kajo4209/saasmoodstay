import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Moodstay",
  description: "سياسة الخصوصية الخاصة بمنصة Moodstay لحجز الشاليهات في قرية غزالة الوادي، الساحل الشمالي.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="rtl">

      {/* Header */}
      <div className="bg-gray-900 text-white py-14 px-6 text-center">
        <Link href="/" className="inline-block mb-6 text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors">
          ← العودة للرئيسية
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-3">سياسة الخصوصية</h1>
        <p className="text-gray-400 text-sm">آخر تحديث: يناير 2025</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            نحن في <strong className="text-gray-800 dark:text-white">Moodstay</strong> نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
            توضح هذه السياسة كيفية جمع المعلومات واستخدامها وحمايتها عند استخدامك لمنصتنا لحجز شاليهات قرية غزالة الوادي على الساحل الشمالي.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            num: "01",
            title: "المعلومات التي نجمعها",
            items: [
              { label: "بيانات الحجز", text: "عند إرسال طلب حجز، نجمع الاسم الكامل ورقم الهاتف وتواريخ الإقامة وعدد الأفراد وأي ملاحظات إضافية تضيفها." },
              { label: "بيانات التواصل", text: "الرسائل التي ترسلها عبر واتساب للتواصل مع الإدارة بشأن الحجز أو الاستفسار عن الشاليهات." },
              { label: "بيانات الزيارة", text: "معلومات تقنية مثل نوع المتصفح والجهاز وعنوان IP بشكل مجهول لتحسين أداء الموقع." },
            ],
          },
          {
            num: "02",
            title: "كيف نستخدم بياناتك",
            items: [
              { label: "تأكيد الحجوزات", text: "نستخدم بياناتك للتواصل معك عبر واتساب لتأكيد الحجز وإرسال تفاصيل الإقامة." },
              { label: "إدارة الحجوزات", text: "تُحفظ بيانات الحجز في نظامنا الداخلي لإدارة التوافر ومنع التعارض في المواعيد." },
              { label: "تحسين الخدمة", text: "نستخدم البيانات المجمعة لتحسين تجربة المستخدم وتطوير خدمات الشاليهات." },
              { label: "التواصل المستقبلي", text: "قد نتواصل معك بشأن عروض موسمية أو مستجدات تخص حجوزاتك السابقة، مع حقك الكامل في الرفض." },
            ],
          },
          {
            num: "03",
            title: "مشاركة البيانات مع أطراف ثالثة",
            items: [
              { label: "لا نبيع بياناتك", text: "لا نبيع أو نؤجر أو نتاجر ببياناتك الشخصية لأي طرف ثالث تحت أي ظرف." },
              { label: "مزودو الخدمة", text: "نستخدم Cloudinary لتخزين صور الشاليهات، وNeon (PostgreSQL) لقاعدة البيانات، وVercel لاستضافة الموقع. هذه الأنظمة تخضع لسياسات خصوصية خاصة بها ولا تصل لبيانات الحجز الشخصية." },
              { label: "المتطلبات القانونية", text: "قد نكشف عن بيانات فقط إذا طُلب منا ذلك بموجب حكم قضائي أو إجراء قانوني نافذ." },
            ],
          },
          {
            num: "04",
            title: "حماية البيانات",
            items: [
              { label: "الأمان التقني", text: "يستخدم موقعنا بروتوكول HTTPS لتشفير جميع البيانات المنقولة. وصول لوحة التحكم محمي بكلمة مرور مشفرة." },
              { label: "الاحتفاظ بالبيانات", text: "نحتفظ ببيانات الحجز لمدة سنة واحدة بعد انتهاء الإقامة لأغراض المحاسبة، ثم يتم حذفها." },
              { label: "الوصول المحدود", text: "لا يصل لبيانات الحجوزات سوى صاحب المنصة عبر لوحة التحكم الخاصة به." },
            ],
          },
          {
            num: "05",
            title: "حقوقك",
            items: [
              { label: "الاطلاع والتصحيح", text: "يحق لك طلب الاطلاع على بياناتك الشخصية المحفوظة لدينا أو تصحيح أي معلومات غير دقيقة." },
              { label: "الحذف", text: "يمكنك طلب حذف بياناتك من قاعدة بياناتنا في أي وقت عبر التواصل معنا مباشرة." },
              { label: "التواصل", text: "لأي استفسار يتعلق بخصوصيتك يمكنك التواصل معنا عبر واتساب أو عبر صفحة التواصل على الموقع." },
            ],
          },
          {
            num: "06",
            title: "ملفات الارتباط (Cookies)",
            items: [
              { label: "الاستخدام المحدود", text: "نستخدم cookie واحدة فقط لجلسة تسجيل دخول الإدارة (httpOnly, secure)، ولا نستخدم cookies للتتبع الإعلاني." },
              { label: "التحكم", text: "يمكنك ضبط متصفحك لرفض الكوكيز، مع العلم أن ذلك لن يؤثر على تجربتك كزائر للموقع." },
            ],
          },
        ].map(section => (
          <div key={section.num} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-lg bg-sky-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                {section.num}
              </span>
              <h2 className="text-lg font-black text-gray-800 dark:text-white">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0"/>
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{item.label}: </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Updates */}
        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-2xl p-6">
          <h2 className="font-black text-gray-800 dark:text-white mb-2">تحديثات هذه السياسة</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ آخر مراجعة.
            استمرارك في استخدام الموقع بعد نشر التغييرات يعني قبولك لها.
          </p>
        </div>

        {/* Footer links */}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-gray-400 text-sm mb-4">© 2025 Moodstay. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">الرئيسية</Link>
            <Link href="/terms" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">الشروط والأحكام</Link>
          </div>
        </div>

      </div>
    </div>
  );
}