"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface Chalet {
  id: number; name: string; price: number; rooms: number;
  description: string; features: string; type: "family" | "youth";
  images: string[]; createdAt: string;
}

const emptyForm = { name: "", price: "", rooms: "", description: "", features: "", type: "family" as "family" | "youth" };

const PlusIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const XIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ImgIcon   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

// ── Image Manager ──────────────────────────────────────────────────────────────
function ImageManager({ existingImages, onExistingChange, newFiles, onNewFilesChange }: {
  existingImages: string[]; onExistingChange: (imgs: string[]) => void;
  newFiles: File[]; onNewFilesChange: (files: File[]) => void;
}) {
  const newPreviews = useMemo(() => newFiles.map(f => URL.createObjectURL(f)), [newFiles]);

  function handlePick(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    onNewFilesChange([...newFiles, ...Array.from(e.target.files)]);
    e.target.value = "";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">الصور</label>
        <span className="text-xs text-gray-400">{existingImages.length + newFiles.length} صورة</span>
      </div>

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-3">
          {existingImages.map((src, i) => (
            <div key={`ex-${i}`} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <Image src={src} alt="" fill className="object-cover" unoptimized/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => onExistingChange(existingImages.filter((_, j) => j !== i))}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow">
                  <XIcon/>
                </button>
              </div>
              <span className="absolute bottom-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-full">محفوظة</span>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-dashed border-sky-300 shadow-sm">
              <Image src={src} alt="" fill className="object-cover" unoptimized/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => onNewFilesChange(newFiles.filter((_, j) => j !== i))}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow">
                  <XIcon/>
                </button>
              </div>
              <span className="absolute bottom-1 right-1 text-[10px] bg-sky-500 text-white px-1.5 py-0.5 rounded-full">جديدة</span>
            </div>
          ))}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 transition hover:border-sky-400 hover:bg-sky-50">
        <ImgIcon/>
        <span className="text-sm text-gray-500">اضغط لإضافة صور جديدة</span>
        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePick}/>
      </label>

      {existingImages.length === 0 && newFiles.length === 0 && (
        <p className="text-xs text-amber-600 mt-2">⚠️ لا توجد صور — سيظهر بصورة افتراضية</p>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ chalet, onClose, onSaved }: { chalet: Chalet | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = chalet !== null;
  const [form, setForm] = useState(isEdit
    ? { name: chalet.name, price: String(chalet.price), rooms: String(chalet.rooms), description: chalet.description, features: chalet.features, type: chalet.type }
    : emptyForm);
  const [keptImages, setKeptImages] = useState<string[]>(isEdit ? chalet.images : []);
  const [newFiles,   setNewFiles]   = useState<File[]>([]);
  const [addImages,  setAddImages]  = useState<FileList | null>(null);
  const addPreviews = useMemo(() => addImages ? Array.from(addImages).map(f => URL.createObjectURL(f)) : [], [addImages]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.rooms || !form.description || !form.features) { setError("يرجى ملء جميع الحقول"); return; }
    setSaving(true); setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name); fd.append("price", form.price); fd.append("rooms", form.rooms);
      fd.append("description", form.description); fd.append("features", form.features); fd.append("type", form.type);

      if (isEdit && chalet) {
        keptImages.forEach(url => fd.append("keptImages", url));
        newFiles.forEach(file => fd.append("newImages", file));
        const res = await fetch(`/api/chalets/${chalet.id}`, { method: "PUT", body: fd });
        if (!res.ok) throw new Error("فشل التعديل");
      } else {
        if (addImages) Array.from(addImages).forEach(f => fd.append("images", f));
        const res = await fetch("/api/chalets", { method: "POST", body: fd });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || "فشل الإنشاء"); }
      }
      onSaved(); onClose();
    } catch (err) { setError(err instanceof Error ? err.message : "حدث خطأ"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" dir="rtl">
        <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? "✏️ تعديل الشاليه" : "➕ إضافة شاليه"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition"><XIcon/></button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">اسم الشاليه</label>
            <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">سعر الليلة (ج)</label>
              <input type="number" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">عدد الغرف</label>
              <input type="number" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.rooms} onChange={e => setForm({...form, rooms: e.target.value})}/>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">الوصف</label>
            <textarea rows={3} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">المميزات</label>
            <input className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="مثال: حمام سباحة - واي فاي - تكييف"
              value={form.features} onChange={e => setForm({...form, features: e.target.value})}/>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">نوع الشاليه</label>
            <div className="flex gap-3">
              {[{val:"family" as const, label:"👨‍👩‍👧 عائلات"},{val:"youth" as const, label:"🏄 شباب"}].map(opt => (
                <button key={opt.val} type="button" onClick={() => setForm({...form, type: opt.val})}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${form.type === opt.val ? "border-sky-600 bg-sky-600 text-white" : "border-gray-200 text-gray-600 hover:border-sky-300"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {isEdit ? (
            <ImageManager existingImages={keptImages} onExistingChange={setKeptImages} newFiles={newFiles} onNewFilesChange={setNewFiles}/>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">الصور</label>
                {addPreviews.length > 0 && <span className="text-xs text-gray-400">{addPreviews.length} صورة</span>}
              </div>
              {addPreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {addPreviews.map((src, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={src} alt="" fill className="object-cover" unoptimized/>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 px-4 py-3 transition hover:border-sky-400 hover:bg-sky-50">
                <ImgIcon/>
                <span className="text-sm text-gray-500">اسحب صور أو اضغط للرفع</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => setAddImages(e.target.files)}/>
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t bg-gray-50 px-6 py-4 rounded-b-2xl sticky bottom-0">
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-60 flex items-center justify-center gap-2 transition">
            {saving ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeOpacity=".3" strokeWidth="4"/><path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>جارٍ الحفظ...</>) : isEdit ? "💾 حفظ التعديلات" : "➕ إضافة الشاليه"}
          </button>
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ── Chalet Row ─────────────────────────────────────────────────────────────────
function ChaletRow({ chalet, onEdit, onDelete }: { chalet: Chalet; onEdit: (c: Chalet) => void; onDelete: (id: number) => void }) {
  const imgSrc = chalet.images?.[0] ?? "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=200";
  const features = chalet.features ? chalet.features.split(/[-،,]/).map(f => f.trim()).filter(Boolean) : [];
  return (
    <div className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full flex-shrink-0 sm:h-auto sm:w-48">
        <Image src={imgSrc} alt={chalet.name} fill className="object-cover" unoptimized/>
        <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold ${chalet.type === "youth" ? "bg-sky-500 text-white" : "bg-amber-400 text-white"}`}>
          {chalet.type === "youth" ? "شباب" : "عائلات"}
        </span>
        {chalet.images.length > 1 && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">📷 {chalet.images.length}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-800">{chalet.name}</h3>
            <span className="whitespace-nowrap text-lg font-black text-sky-600">{chalet.price.toLocaleString()} ج</span>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-gray-500">{chalet.description}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{chalet.rooms} غرف</span>
            {features.slice(0, 3).map((f, i) => <span key={i} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-700">{f}</span>)}
            {features.length > 3 && <span className="text-xs text-gray-400">+{features.length - 3}</span>}
          </div>
        </div>
        <div className="flex gap-2 border-t border-gray-50 pt-3 mt-3">
          <button onClick={() => onEdit(chalet)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition"><EditIcon/> تعديل</button>
          <button onClick={() => onDelete(chalet.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-50 transition"><TrashIcon/> حذف</button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ChaletsPage() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Chalet | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true); setApiError("");
    try {
      const res = await fetch("/api/chalets", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error((data as {error?:string})?.error || "فشل التحميل");
      setChalets(Array.isArray(data) ? data : []);
    } catch (err) { setChalets([]); setApiError(err instanceof Error ? err.message : "تعذر التحميل"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشاليه؟")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/chalets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setChalets(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  return (
    <div className="max-w-4xl" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الشاليهات</h1>
          <p className="mt-0.5 text-sm text-gray-500">{chalets.length} شاليه</p>
        </div>
        <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition">
          <PlusIcon/> إضافة شاليه
        </button>
      </div>

      {apiError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white"/>)}</div>
      ) : chalets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-4 text-5xl">🏖️</div>
          <h3 className="mb-2 text-lg font-bold text-gray-700">لا توجد شاليهات بعد</h3>
          <p className="mb-5 text-sm text-gray-400">ابدأ بإضافة أول شاليه</p>
          <button onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white">
            <PlusIcon/> إضافة شاليه
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chalets.map(c => (
            <div key={c.id} className={`transition-opacity ${deleting === c.id ? "pointer-events-none opacity-40" : ""}`}>
              <ChaletRow chalet={c} onEdit={ch => { setEditTarget(ch); setModalOpen(true); }} onDelete={handleDelete}/>
            </div>
          ))}
        </div>
      )}

      {modalOpen && <Modal chalet={editTarget} onClose={() => setModalOpen(false)} onSaved={load}/>}
    </div>
  );
}