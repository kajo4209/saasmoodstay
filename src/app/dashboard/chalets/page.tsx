"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Chalet {
  id: number;
  name: string;
  price: number;
  rooms: number;
  description: string;
  features: string;
  type: string;
  images: string[];
  createdAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ─── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = { name: "", price: "", rooms: "", description: "", features: "", type: "family" };

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  chalet,
  onClose,
  onSaved,
}: {
  chalet: Chalet | null;          // null = add new
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = chalet !== null;

  const [form, setForm] = useState(
    isEdit
      ? {
          name:        chalet.name,
          price:       String(chalet.price),
          rooms:       String(chalet.rooms),
          description: chalet.description,
          features:    chalet.features,
          type:        chalet.type,
        }
      : emptyForm
  );

  const [images, setImages]   = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>(
    isEdit ? chalet.images : []
  );
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.rooms || !form.description) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (isEdit && images.length === 0) {
        // تعديل بدون صور جديدة → JSON
        const res = await fetch(`/api/chalets/${chalet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:        form.name,
            price:       Number(form.price),
            rooms:       Number(form.rooms),
            description: form.description,
            features:    form.features,
            type:        form.type,
          }),
        });
        if (!res.ok) throw new Error();
      } else {
        // إضافة أو تعديل مع صور → FormData
        const fd = new FormData();
        fd.append("name",        form.name);
        fd.append("price",       form.price);
        fd.append("rooms",       form.rooms);
        fd.append("description", form.description);
        fd.append("features",    form.features);
        fd.append("type",        form.type);
        images.forEach((img) => fd.append("images", img));

        const url    = isEdit ? `/api/chalets/${chalet.id}` : "/api/chalets";
        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, { method, body: fd });
        if (!res.ok) throw new Error();
      }

      onSaved();
      onClose();
    } catch {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {isEdit ? "تعديل الشاليه" : "إضافة شاليه جديد"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              اسم الشاليه <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="مثال: شاليه النخيل الفاخر"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Price + Rooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                سعر الليلة (جنيه) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="3500"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                عدد الغرف <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="3"
                value={form.rooms}
                onChange={(e) => setForm({ ...form, rooms: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              الوصف <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
              placeholder="وصف مختصر للشاليه..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              المميزات
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="حمام سباحة - واي فاي - تكييف - جاكوزي"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">افصل المميزات بـ " - "</p>
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">نوع الشاليه</label>
            <div className="flex gap-3">
              {[
                { val: "family", label: "عائلات 👨‍👩‍👧" },
                { val: "youth",  label: "شباب 🏄" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setForm({ ...form, type: opt.val })}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition ${
                    form.type === opt.val
                      ? "bg-sky-600 text-white border-sky-600"
                      : "border-gray-200 text-gray-600 hover:border-sky-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">الصور</label>

            {preview.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {preview.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <Image src={src} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}

            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition">
              <ImageIcon />
              <span className="text-sm text-gray-500">
                {preview.length > 0 ? "تغيير الصور" : "اسحب صورة أو اضغط للرفع"}
              </span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60"
          >
            {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الشاليه"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Chalet Row Card ──────────────────────────────────────────────────────────
function ChaletRow({
  chalet,
  onEdit,
  onDelete,
}: {
  chalet: Chalet;
  onEdit: (c: Chalet) => void;
  onDelete: (id: number) => void;
}) {
  const imgSrc =
    chalet.images?.[0] ??
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=200";

  const features = chalet.features
    ? chalet.features.split(/[-،,]/).map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row gap-0">
      {/* Image */}
      <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
        <Image src={imgSrc} alt={chalet.name} fill className="object-cover" />
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
            chalet.type === "youth"
              ? "bg-sky-500 text-white"
              : "bg-amber-400 text-white"
          }`}
        >
          {chalet.type === "youth" ? "شباب" : "عائلات"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-lg">{chalet.name}</h3>
            <span className="text-sky-600 font-black text-lg whitespace-nowrap">
              {chalet.price.toLocaleString()} ج
            </span>
          </div>

          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{chalet.description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {chalet.rooms} غرف
            </span>
            {features.slice(0, 3).map((f, i) => (
              <span key={i} className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
            {features.length > 3 && (
              <span className="text-xs text-gray-400">+{features.length - 3}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-50">
          <button
            onClick={() => onEdit(chalet)}
            className="flex items-center gap-1.5 text-sm text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition font-semibold"
          >
            <EditIcon /> تعديل
          </button>
          <button
            onClick={() => onDelete(chalet.id)}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition font-semibold"
          >
            <TrashIcon /> حذف
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChaletsPage() {
  const [chalets, setChalets]       = useState<Chalet[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Chalet | null>(null);
  const [deleting, setDeleting]     = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/chalets")
      .then((r) => r.json())
      .then((data) => {
        setChalets(data);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (c: Chalet) => { setEditTarget(c); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشاليه؟")) return;
    setDeleting(id);
    await fetch(`/api/chalets/${id}`, { method: "DELETE" });
    setChalets((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  return (
    <div className="max-w-4xl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الشاليهات</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {chalets.length} شاليه — تظهر تلقائياً في صفحة اللاندينج
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
        >
          <PlusIcon />
          إضافة شاليه
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : chalets.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🏖️</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">لا توجد شاليهات بعد</h3>
          <p className="text-gray-400 text-sm mb-5">ابدأ بإضافة أول شاليه ليظهر في صفحة الموقع</p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
          >
            <PlusIcon /> إضافة شاليه
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chalets.map((c) => (
            <div key={c.id} className={`transition-opacity ${deleting === c.id ? "opacity-40 pointer-events-none" : ""}`}>
              <ChaletRow chalet={c} onEdit={openEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          chalet={editTarget}
          onClose={() => setModalOpen(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}