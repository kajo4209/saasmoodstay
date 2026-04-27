"use client";

import { useState } from "react";

export default function ChaletsPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    rooms: "",
    description: "",
    features: "",
    type: "family",
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // 📸 رفع الصور
  const handleImages = (e: any) => {
    const files = Array.from(e.target.files) as File[];

    setImages(files);

    const previewUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(previewUrls);
  };

  // 📝 إرسال البيانات
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("price", form.price);
    data.append("rooms", form.rooms);
    data.append("description", form.description);
    data.append("features", form.features);
    data.append("type", form.type);

    images.forEach((img) => {
      data.append("images", img);
    });

    await fetch("/api/chalets", {
      method: "POST",
      body: data,
    });

    alert("تمت الإضافة ✅");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        نظام إدارة الشاليهات
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow"
      >
        {/* اسم */}
        <input
          placeholder="اسم الشاليه"
          className="input"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* السعر */}
        <input
          type="number"
          placeholder="سعر الليلة"
          className="input"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        {/* الغرف */}
        <input
          type="number"
          placeholder="عدد الغرف"
          className="input"
          onChange={(e) =>
            setForm({ ...form, rooms: e.target.value })
          }
        />

        {/* الوصف */}
        <textarea
          placeholder="وصف الشاليه"
          className="input"
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* المميزات */}
        <input
          placeholder="المميزات (مثال: حمام سباحة - واي فاي - تكييف)"
          className="input"
          onChange={(e) =>
            setForm({
              ...form,
              features: e.target.value,
            })
          }
        />

        {/* النوع */}
        <select
          className="input"
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="family">عائلات</option>
          <option value="youth">شباب</option>
        </select>

        {/* الصور */}
        <div>
          <label className="font-semibold">
            رفع الصور
          </label>
          <input
            type="file"
            multiple
            onChange={handleImages}
          />
        </div>

        {/* preview */}
        <div className="flex gap-2 flex-wrap">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>

        <button className="bg-sky-600 text-white py-2 rounded-lg">
          إضافة الشاليه
        </button>
      </form>
    </div>
  );
}