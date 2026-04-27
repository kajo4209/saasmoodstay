"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface Chalet {
  id: number;
  name: string;
  price: number;
  rooms: number;
  description: string;
  features: string;
  type: "family" | "youth";
  images: string[];
  createdAt: string;
}

const emptyForm = {
  name: "",
  price: "",
  rooms: "",
  description: "",
  features: "",
  type: "family" as "family" | "youth",
};

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
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
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

function Modal({
  chalet,
  onClose,
  onSaved,
}: {
  chalet: Chalet | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = chalet !== null;

  const [form, setForm] = useState(
    isEdit
      ? {
          name: chalet.name,
          price: String(chalet.price),
          rooms: String(chalet.rooms),
          description: chalet.description,
          features: chalet.features,
          type: chalet.type,
        }
      : emptyForm
  );

  const [images, setImages] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewUrls = useMemo(() => {
    if (!images || images.length === 0) {
      return isEdit ? chalet.images : [];
    }
    return Array.from(images).map((file) => URL.createObjectURL(file));
  }, [images, isEdit, chalet]);

  useEffect(() => {
    if (!images) return;
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [images, previewUrls]);

  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.rooms || !form.description || !form.features) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (isEdit && chalet) {
        const res = await fetch(`/api/chalets/${chalet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            price: Number(form.price),
            rooms: Number(form.rooms),
            description: form.description,
            features: form.features,
            type: form.type,
          }),
        });

        if (!res.ok) throw new Error("Failed to update chalet");
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("rooms", form.rooms);
        formData.append("description", form.description);
        formData.append("features", form.features);
        formData.append("type", form.type);

        if (images) {
          for (const file of Array.from(images)) {
            formData.append("images", file);
          }
        }

        const res = await fetch("/api/chalets", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to create chalet");
      }

      setSuccess(isEdit ? "تم حفظ التعديلات" : "تمت إضافة الشاليه بنجاح");
      onSaved();
      onClose();
    } catch (err) {
      console.error("Save chalet error:", err);
      setError("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold">{isEdit ? "تعديل الشاليه" : "إضافة شاليه جديد"}</h2>
          <button onClick={onClose} className="text-gray-400 transition hover:text-gray-600">
            <XIcon />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">اسم الشاليه</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">سعر الليلة</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">عدد الغرف</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.rooms}
                onChange={(e) => setForm({ ...form, rooms: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">الوصف</label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">المميزات</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">نوع الشاليه</label>
            <div className="flex gap-3">
              {[
                { val: "family" as const, label: "عائلات" },
                { val: "youth" as const, label: "شباب" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setForm({ ...form, type: opt.val })}
                  className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition ${
                    form.type === opt.val
                      ? "border-sky-600 bg-sky-600 text-white"
                      : "border-gray-200 text-gray-600 hover:border-sky-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">الصور</label>

              {previewUrls.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {previewUrls.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border">
                      <Image src={src} alt="preview" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
              )}

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-6 transition hover:border-sky-400 hover:bg-sky-50">
                <ImageIcon />
                <span className="text-sm text-gray-500">اسحب صورة أو اضغط للرفع</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 rounded-b-2xl border-t bg-gray-50 p-6">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {saving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الشاليه"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

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
    ? chalet.features
        .split(/[-،,]/)
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:flex-row">
      <div className="relative h-40 w-full flex-shrink-0 sm:h-auto sm:w-48">
        <Image src={imgSrc} alt={chalet.name} fill className="object-cover" unoptimized />
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold ${
            chalet.type === "youth" ? "bg-sky-500 text-white" : "bg-amber-400 text-white"
          }`}
        >
          {chalet.type === "youth" ? "شباب" : "عائلات"}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-800">{chalet.name}</h3>
            <span className="whitespace-nowrap text-lg font-black text-sky-600">
              {chalet.price.toLocaleString()} ج
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-500">{chalet.description}</p>

          <div className="mb-3 flex flex-wrap gap-1">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{chalet.rooms} غرف</span>
            {features.slice(0, 3).map((f, i) => (
              <span key={i} className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                {f}
              </span>
            ))}
            {features.length > 3 && <span className="text-xs text-gray-400">+{features.length - 3}</span>}
          </div>
        </div>

        <div className="flex gap-2 border-t border-gray-50 pt-2">
          <button
            onClick={() => onEdit(chalet)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
          >
            <EditIcon /> تعديل
          </button>
          <button
            onClick={() => onDelete(chalet.id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-400 transition hover:bg-red-50"
          >
            <TrashIcon /> حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChaletsPage() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Chalet | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chalets", { cache: "no-store" });
      const data = (await res.json()) as Chalet[];
      setChalets(data);
    } catch (err) {
      console.error("Load chalets error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (c: Chalet) => {
    setEditTarget(c);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشاليه؟")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/chalets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setChalets((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete chalet error:", err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-4xl" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الشاليهات</h1>
          <p className="mt-0.5 text-sm text-gray-500">{chalets.length} شاليه</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          <PlusIcon />
          إضافة شاليه
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : chalets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-4 text-5xl">🏖️</div>
          <h3 className="mb-2 text-lg font-bold text-gray-700">لا توجد شاليهات بعد</h3>
          <p className="mb-5 text-sm text-gray-400">ابدأ بإضافة أول شاليه ليظهر في صفحة الموقع</p>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white"
          >
            <PlusIcon /> إضافة شاليه
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chalets.map((c) => (
            <div key={c.id} className={`transition-opacity ${deleting === c.id ? "pointer-events-none opacity-40" : ""}`}>
              <ChaletRow chalet={c} onEdit={openEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

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
