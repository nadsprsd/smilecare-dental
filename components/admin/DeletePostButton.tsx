"use client";
import { useRouter } from "next/navigation";
import { useState }  from "react";
import { Trash2, Eye, EyeOff } from "lucide-react";

// ── Delete Post Button ──
export default function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;

    setLoading(true);
    try {
      const res  = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert("Failed to delete.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-[10px] font-bold px-2.5 py-1.5 border border-red-200 transition-colors"
      title="Delete post"
    >
      <Trash2 size={11} />
      {loading ? "..." : "Del"}
    </button>
  );
}

// ── Toggle Status Button (Publish / Unpublish) ──
export function ToggleStatusButton({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: "published" | "draft";
}) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const newStatus = currentStatus === "published" ? "draft" : "published";

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/blog/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={currentStatus === "published" ? "Unpublish" : "Publish"}
      className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 border transition-colors disabled:opacity-50 ${
        currentStatus === "published"
          ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
          : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      }`}
    >
      {loading ? (
        "..."
      ) : currentStatus === "published" ? (
        <><EyeOff size={11} /> Draft</>
      ) : (
        <><Eye size={11} /> Publish</>
      )}
    </button>
  );
}

