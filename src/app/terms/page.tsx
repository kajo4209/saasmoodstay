import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | Moodstay",
  description: "شروط وأحكام استخدام منصة Moodstay لحجز شاليهات قرية غزالة الوادي، الساحل الشمالي.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="rtl">

      {/* Header */}
      <div className="bg-gray-900 text-white py-14 px-6 text-center">
        <Link href="/" className="inline-block mb-6 text-sky-400 hover:text-sky-300 text-sm font-semibold transition-colors">
          ← العودة للرئيسية
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mb-3">الشروط والأحكام</h1>
        <p className="text-gray-400 text-sm">آخر تحديث: يناير 2025</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Intro */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            باستخدامك لموقع <strong className="text-gray-800 dark:text-white">Moodstay</strong> أو إرسال طلب حجز، فإنك توافق على الشروط والأحكام التالية.
            يُرجى قراءتها بعناية قبل إتمام أي حجز. تسري هذه الشروط على جميع شاليهات قرية غزالة الوادي، الكيلو 142 الساحل الشمالي.
          </p>
        </div>

        {[
          {
            num: "01",
            title: "عملية الحجز",
            items: [
              { label: "طلب الحجز", text: "يُعدّ الحجز طلباً مبدئياً فقط عند إرساله عبر الموقع. لا يصبح الحجز مؤكداً إلا بعد سداد الإيداع المطلوب وتأكيده من قِبل الإدارة." },
              { label: "التأكيد الرسمي", text: "ستتلقى رسالة تأكيد عبر واتساب من إدارة Moodstay بعد استلام الإيداع والتحقق من توافر الشاليه في التواريخ المطلوبة." },
              { label: "التوافر", text: "يتم تأكيد الحجوزات بحسب الأسبقية في الدفع. مجرد إرسال الطلب لا يضمن حجز التواريخ." },
              { label: "الحد الأدنى للإقامة", text: "الحد الأدنى للإقامة يومان متتاليان. قد يختلف الحد الأدنى خلال المواسم الرسمية والأعياد." },
            ],
          },
          {
            num: "02",
            title: "الإيداع والدفع",
            items: [
              { label: "قيمة الإيداع", text: "يُطلب إيداع 15% من إجمالي قيمة الحجز مقدماً لتأكيد الحجز وحجز التواريخ. يُحسب المبلغ تلقائياً عند اختيار التواريخ." },
              { label: "طريقة الدفع", text: "يتم الدفع حصرياً عبر المحافظ الإلكترونية (Vodafone Cash / InstaPay). سيُزوّدك فريقنا برقم المحفظة عبر واتساب بعد إرسال الطلب." },
              { label: "المبلغ المتبقي", text: "يُسدَّد باقي مبلغ الإيجار (85%) نقداً عند الوصول للشاليه قبل استلام المفتاح." },
              { label: "تأكيد التحويل", text: "يجب إرسال صورة إيصال التحويل عبر واتساب للإدارة. لن يُؤكَّد الحجز بدون استلام وتحقق الإيصال." },
            ],
          },
          {
            num: "03",
            title: "سياسة الإلغاء والاسترداد",
            items: [
              { label: "إلغاء قبل 7 أيام أو أكثر", text: "استرداد كامل قيمة الإيداع المدفوع بدون أي خصومات." },
              { label: "إلغاء من 3 إلى 6 أيام قبل الوصول", text: "استرداد 50% من قيمة الإيداع فقط." },
              { label: "إلغاء خلال أقل من 72 ساعة", text: "لا يُستردّ الإيداع في حالة الإلغاء خلال 72 ساعة من موعد الوصول." },
              { label: "تأجيل الحجز", text: "يُسمح بتأجيل الحجز مرة واحدة مجاناً إذا تم الإخطار قبل 5 أيام على الأقل، وفقاً للتوافر." },
              { label: "الظروف القاهرة", text: "في حالات الطوارئ الموثقة (مرض حاد أو وفاة في العائلة)، تُدرس كل حالة بشكل منفرد ومرن." },
            ],
          },
          {
            num: "04",
            title: "قواعد الإقامة",
            items: [
              { label: "مواعيد الوصول والمغادرة", text: "تسجيل الدخول من الساعة 2 ظهراً، وتسجيل الخروج حتى الساعة 12 ظهراً. يمكن الترتيب لأوقات مختلفة مسبقاً وفقاً للتوافر." },
              { label: "عدد الأشخاص", text: "لا يُسمح بتجاوز الطاقة الاستيعابية المحددة لكل شاليه. أي زيادة في العدد يجب الإخطار بها مسبقاً وقد تستلزم رسوماً إضافية." },
              { label: "الحفلات والمناسبات", text: "يُسمح بالمناسبات العائلية الهادئة. يُمنع إقامة حفلات صاخبة تزعج الجيران أو تخالف لوائح قرية غزالة الوادي." },
              { label: "التدخين", text: "يُمنع التدخين داخل الشاليهات. مخصصة أماكن مفتوحة للتدخين خارج المبنى." },
              { label: "الحيوانات الأليفة", text: "لا يُسمح بإحضار حيوانات أليفة داخل الشاليهات إلا بموافقة مسبقة وصريحة من الإدارة." },
            ],
          },
          {
            num: "05",
            title: "المسؤولية والممتلكات",
            items: [
              { label: "عناية الضيف", text: "المستأجر مسؤول عن الشاليه وجميع محتوياته طوال فترة الإقامة. يُرجى الإبلاغ فوراً عن أي عطل أو ضرر عند الاستلام." },
              { label: "الأضرار", text: "أي أضرار تحدث للشاليه أو محتوياته خلال الإقامة تكون على عاتق المستأجر ويُلزم بتعويض قيمتها." },
              { label: "المقتنيات الشخصية", text: "لا تتحمل إدارة Moodstay أي مسؤولية عن ضياع أو تلف المقتنيات الشخصية للضيوف." },
              { label: "حالات الطوارئ", text: "في حالة أي طارئ، يُرجى التواصل فوراً مع الإدارة عبر واتساب. الإدارة على استعداد للمساعدة على مدار الساعة خلال موسم الصيف." },
            ],
          },
          {
            num: "06",
            title: "الأسعار والتسعير",
            items: [
              { label: "الأسعار الديناميكية", text: "تتغير الأسعار حسب الموسم والطلب. أسعار نهايات الأسبوع (الخميس والجمعة) أعلى من أيام الأسبوع. السعر المعروض عند الحجز هو السعر النهائي." },
              { label: "الموسم الذروة", text: "خلال موسم الذروة (يوليو وأغسطس) والأعياد الرسمية قد تُطبَّق أسعار خاصة مع زيادة الحد الأدنى لليالي." },
              { label: "خصم الإقامة الطويلة", text: "تُطبَّق خصومات تلقائية على الإقامات التي تتجاوز 7 ليالٍ متتالية." },
            ],
          },
          {
            num: "07",
            title: "تعديل الشروط",
            items: [
              { label: "حق التعديل", text: "تحتفظ إدارة Moodstay بحق تعديل هذه الشروط في أي وقت. تسري الشروط المعمول بها وقت إتمام الحجز على العقد المبرم." },
              { label: "الإشعار", text: "سيتم إخطار العملاء بأي تغييرات جوهرية عبر الموقع أو واتساب قبل تطبيقها." },
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

        {/* Important note */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-black text-gray-800 dark:text-white mb-1 text-sm">ملاحظة مهمة</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                إرسال طلب الحجز يعني موافقتك الكاملة على جميع الشروط والأحكام المذكورة أعلاه.
                في حال وجود أي تعارض أو استفسار، يُرجى التواصل مع الإدارة قبل إتمام الحجز.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm text-center">
          <h2 className="font-black text-gray-800 dark:text-white mb-2">هل لديك استفسار؟</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            فريقنا متاح للإجابة على جميع استفساراتك عبر واتساب
          </p>
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            تواصل عبر واتساب
          </a>
        </div>

        {/* Footer links */}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-gray-400 text-sm mb-4">© 2025 Moodstay. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">الرئيسية</Link>
            <Link href="/privacy" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">سياسة الخصوصية</Link>
          </div>
        </div>

      </div>
    </div>
  );
}