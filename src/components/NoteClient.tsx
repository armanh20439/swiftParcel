// components/NotesClient.tsx (client component)
"use client";

import { useEffect, useState } from "react";

type Note = { _id: string; title: string; content?: string; createdAt?: string };

export default function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setNotes(data.data);
      });
  }, []);

  async function addNote() {
    if (!title.trim()) return;
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const json = await res.json();
    if (json.success) {
      // simple reload — real app would update state from returned doc
      window.location.reload();
    } else {
      alert("Error: " + json.error);
    }
  }

  return (
    <div>
      <h3>Notes</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addNote}>Add</button>
      <ul>
        {notes.map((n) => (
          <li key={n._id}>{n.title}</li>
        ))}
      </ul>
    </div>
  );
}
