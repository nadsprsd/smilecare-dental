"use client";
import { useRouter } from "next/navigation";
import { useState }  from "react";
import { Trash2 }    from "lucide-react";

export default function DeletePostButton({
  id, title,
}: {
  id:    string;
  title: string;
}) {
  const router    = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setLoading(true);
    try {
      const res  = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) router.refresh();
      else alert("Failed to delete post.");
    } catch { alert("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <button onClick={handleDelete} disabled={loading}
      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-[10px] font-bold px-2.5 py-1.5 border border-red-200 transition-colors"
      title="Delete post">
      <Trash2 size={11} />
      {loading ? "..." : "Del"}
    </button>
  );
}

