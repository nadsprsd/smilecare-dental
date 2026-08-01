"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface Props {
  value:    string;
  onChange: (val: string) => void;
}

function ToolBtn({
  label, title, onClick, danger = false, wide = false,
}: {
  label:   React.ReactNode;
  title:   string;
  onClick: () => void;
  danger?:  boolean;
  wide?:    boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`inline-flex items-center justify-center h-8 rounded text-[12px] font-medium transition-all border select-none
        ${wide ? "px-3 gap-1" : "w-8"}
        ${danger
          ? "text-red-500 border-red-200 bg-white hover:bg-red-50"
          : "text-gray-700 border-gray-200 bg-white hover:bg-gray-100 hover:border-gray-400"
        }`}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editorRef   = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [wordCount, setWordCount] = useState(0);
  const [linkPopup, setLinkPopup] = useState(false);
  const [imgPopup,  setImgPopup]  = useState(false);
  const [linkVal,   setLinkVal]   = useState("");
  const [imgVal,    setImgVal]    = useState("");

  useEffect(() => {
    if (!initialized.current && editorRef.current) {
      editorRef.current.innerHTML = value || "<p><br></p>";
      initialized.current = true;
      countWords(value);
    }
  }, []);

  const countWords = (html: string) => {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    setWordCount(text ? text.split(" ").filter(Boolean).length : 0);
  };

  const sync = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      countWords(html);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        document.execCommand("insertLineBreak");
      } else {
        e.preventDefault();
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range     = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const block     = container.nodeType === 1
          ? container as Element
          : container.parentElement;

        // Exit heading on Enter
        const isHeading = block && /^H[1-6]$/.test(block.tagName);
        if (isHeading && block) {
          const p   = document.createElement("p");
          p.innerHTML = "<br>";
          block.insertAdjacentElement("afterend", p);
          const r2 = document.createRange();
          r2.setStart(p, 0);
          r2.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r2);
        } else {
          range.deleteContents();
          const p = document.createElement("p");
          p.innerHTML = "<br>";
          range.insertNode(p);
          const r2 = document.createRange();
          r2.setStart(p, 0);
          r2.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r2);
        }
        sync();
      }
    }
    if ((e.ctrlKey || e.metaKey) && ["b","i","u"].includes(e.key.toLowerCase())) {
      setTimeout(sync, 10);
    }
  }, [sync]);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    sync();
  };

  const block = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    sync();
  };

  const insert = (html: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const tpl  = document.createElement("div");
      tpl.innerHTML = html;
      const frag = document.createDocumentFragment();
      let last: Node | null = null;
      while (tpl.firstChild) { last = frag.appendChild(tpl.firstChild); }
      range.insertNode(frag);
      if (last) {
        const r2 = document.createRange();
        r2.setStartAfter(last);
        r2.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r2);
      }
    } else if (editorRef.current) {
      editorRef.current.innerHTML += html;
    }
    sync();
  };

  const doLink = () => {
    if (!linkVal) return;
    editorRef.current?.focus();
    const url = linkVal.startsWith("http") ? linkVal : "https://" + linkVal;
    document.execCommand("createLink", false, url);
    sync();
    setLinkVal(""); setLinkPopup(false);
  };

  const doImg = () => {
    if (!imgVal) return;
    // Insert as actual <img> tag — not as text
    insert(`<p><img src="${imgVal}" alt="Article image" style="max-width:100%;height:auto;border-radius:8px;margin:8px 0;display:block;" /></p><p><br></p>`);
    setImgVal(""); setImgPopup(false);
  };

  return (
    <div className="border-2 border-gray-200 focus-within:border-[#0D1117] transition-colors overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <ToolBtn label={<b>B</b>}   title="Bold (Ctrl+B)"       onClick={() => exec("bold")} />
        <ToolBtn label={<i>I</i>}   title="Italic (Ctrl+I)"     onClick={() => exec("italic")} />
        <ToolBtn label={<u>U</u>}   title="Underline (Ctrl+U)"  onClick={() => exec("underline")} />
        <div className="w-px h-5 bg-gray-300" />
        <ToolBtn label="H2"  title="Heading 2"       onClick={() => block("h2")}  wide />
        <ToolBtn label="H3"  title="Heading 3"       onClick={() => block("h3")}  wide />
        <ToolBtn label="¶ P" title="Normal paragraph" onClick={() => block("p")}   wide />
        <div className="w-px h-5 bg-gray-300" />
        <ToolBtn label="• List"  title="Bullet list"    onClick={() => exec("insertUnorderedList")} wide />
        <ToolBtn label="1. List" title="Numbered list"  onClick={() => exec("insertOrderedList")}   wide />
        <div className="w-px h-5 bg-gray-300" />

        {/* Link */}
        <div className="relative">
          <ToolBtn label="🔗 Link" title="Insert link"
            onClick={() => { setLinkPopup(v => !v); setImgPopup(false); }} wide />
          {linkPopup && (
            <div className="absolute top-10 left-0 z-50 bg-white shadow-xl border border-gray-200 rounded p-3 flex gap-2 w-72">
              <input autoFocus type="url" value={linkVal}
                onChange={e => setLinkVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLink()}
                placeholder="https://..."
                className="flex-1 border border-gray-200 text-sm px-2 py-1.5 outline-none focus:border-[#0D1117] rounded" />
              <button type="button" onMouseDown={e => { e.preventDefault(); doLink(); }}
                className="bg-[#0D1117] text-white text-xs font-bold px-3 rounded">
                Add
              </button>
            </div>
          )}
        </div>

        {/* Image URL */}
        <div className="relative">
          <ToolBtn label="🖼 Image" title="Insert image from URL"
            onClick={() => { setImgPopup(v => !v); setLinkPopup(false); }} wide />
          {imgPopup && (
            <div className="absolute top-10 left-0 z-50 bg-white shadow-xl border border-gray-200 rounded p-3 flex flex-col gap-2 w-80">
              <p className="text-[11px] text-gray-500 font-semibold">Paste image URL (Google Drive, Unsplash, etc.)</p>
              <div className="flex gap-2">
                <input autoFocus type="url" value={imgVal}
                  onChange={e => setImgVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && doImg()}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 border border-gray-200 text-sm px-2 py-1.5 outline-none focus:border-[#0D1117] rounded" />
                <button type="button" onMouseDown={e => { e.preventDefault(); doImg(); }}
                  className="bg-[#0D1117] text-white text-xs font-bold px-3 rounded">
                  Insert
                </button>
              </div>
              <p className="text-[10px] text-gray-400">
                💡 Tip: Use <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">unsplash.com</a> for free dental images
              </p>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-300" />
        <ToolBtn label="✕ Clear" title="Remove formatting" onClick={() => exec("removeFormat")} danger wide />
      </div>

      {/* ── Quick Insert ── */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 bg-blue-50 border-b border-blue-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">
          Quick Insert:
        </span>
        {[
          {
            label: "📌 Heading",
            html:  `<h2 style="font-size:1.4em;font-weight:bold;color:#111;margin:20px 0 8px;">Your Section Heading Here</h2><p><br></p>`,
          },
          {
            label: "📝 Paragraph",
            html:  `<p>Write your paragraph here. Replace this with your content.</p><p><br></p>`,
          },
          {
            label: "✅ Bullet List",
            html:  `<ul style="padding-left:20px;margin:8px 0 16px;"><li>First point here</li><li>Second point here</li><li>Third point here</li></ul><p><br></p>`,
          },
          {
            label: "🔢 Numbered List",
            html:  `<ol style="padding-left:20px;margin:8px 0 16px;"><li>First step here</li><li>Second step here</li><li>Third step here</li></ol><p><br></p>`,
          },
          {
            label: "💡 Tip Box",
            html:  `<div style="background:#f0f7ff;border-left:4px solid #00A3E0;padding:14px 18px;margin:16px 0;border-radius:0 6px 6px 0;"><strong>💡 Tip:</strong> Write your tip here.</div><p><br></p>`,
          },
          {
            label: "📅 Book Appointment",
            // Uses a real <a> tag with proper href
            html:  `<div style="background:#0D1117;color:white;padding:18px 24px;text-align:center;margin:20px 0;border-radius:6px;"><p style="color:white;margin:0 0 8px;font-weight:bold;">Ready to fix your dental issue?</p><a href="/appointment" style="display:inline-block;background:#C9A96E;color:white;padding:10px 24px;text-decoration:none;font-weight:bold;border-radius:4px;margin-top:4px;">Book Free Appointment →</a></div><p><br></p>`,
          },
          {
            label: "❝ Quote",
            html:  `<blockquote style="border-left:4px solid #C9A96E;padding:10px 18px;margin:16px 0;color:#555;font-style:italic;background:#fffbf5;border-radius:0 6px 6px 0;">Write a patient quote or an important statement here.</blockquote><p><br></p>`,
          },
          {
            label: "─ Divider",
            html:  `<hr style="border:none;border-top:2px solid #e5e7eb;margin:24px 0;" /><p><br></p>`,
          },
        ].map(btn => (
          <button key={btn.label} type="button"
            onMouseDown={e => { e.preventDefault(); insert(btn.html); }}
            className="text-[11px] font-medium px-2.5 py-1.5 bg-white border border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-400 rounded transition-colors">
            {btn.label}
          </button>
        ))}
      </div>

      {/* ── Editable area ── */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onKeyDown={handleKeyDown}
        className="min-h-[380px] max-h-[600px] overflow-y-auto px-6 py-5 outline-none text-gray-800"
        style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif", fontSize: "15px", lineHeight: "1.8" }}
      />

      {/* ── Footer bar ── */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
        <div className="flex gap-3 flex-wrap">
          <span><kbd className="bg-gray-200 px-1 rounded text-[10px]">Ctrl+B</kbd> Bold</span>
          <span><kbd className="bg-gray-200 px-1 rounded text-[10px]">Ctrl+I</kbd> Italic</span>
          <span><kbd className="bg-gray-200 px-1 rounded text-[10px]">Ctrl+Z</kbd> Undo</span>
          <span><kbd className="bg-gray-200 px-1 rounded text-[10px]">Enter</kbd> New paragraph</span>
          <span><kbd className="bg-gray-200 px-1 rounded text-[10px]">Shift+Enter</kbd> Line break</span>
        </div>
        <span className={`font-semibold ${wordCount >= 300 ? "text-green-600" : "text-orange-500"}`}>
          {wordCount} words {wordCount >= 300 ? "✓" : "(aim for 300+)"}
        </span>
      </div>

      <style>{`
        div[contenteditable]:empty:before {
          content: "Click here and start writing your article...";
          color: #bbb; pointer-events: none; display: block;
        }
        div[contenteditable] p          { margin: 0 0 12px; min-height: 1.4em; }
        div[contenteditable] p:empty    { min-height: 1.4em; }
        div[contenteditable] h2         { font-size:1.5em; font-weight:700; color:#0D1117; margin:20px 0 8px; }
        div[contenteditable] h3         { font-size:1.25em; font-weight:700; color:#0D1117; margin:16px 0 6px; }
        div[contenteditable] h4         { font-size:1.1em; font-weight:600; color:#0D1117; margin:12px 0 4px; }
        div[contenteditable] ul         { list-style:disc; padding-left:24px; margin:0 0 12px; }
        div[contenteditable] ol         { list-style:decimal; padding-left:24px; margin:0 0 12px; }
        div[contenteditable] li         { margin:5px 0; line-height:1.7; }
        div[contenteditable] blockquote { border-left:4px solid #C9A96E; padding:10px 18px; margin:12px 0; color:#555; font-style:italic; background:#fffbf5; }
        div[contenteditable] hr         { border:none; border-top:2px solid #e5e7eb; margin:20px 0; }
        div[contenteditable] a          { color:#00A3E0; text-decoration:underline; }
        div[contenteditable] img        { max-width:100%; height:auto; border-radius:6px; margin:8px 0; display:block; }
        div[contenteditable] strong     { font-weight:700; }
        div[contenteditable] em         { font-style:italic; }
      `}</style>
    </div>
  );
}

