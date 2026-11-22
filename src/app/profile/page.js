"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api-client";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest("/api/me").then((result) => {
      setUser(result.data);
      setName(result.data.name || "");
      setImage(result.data.image || "");
    }).catch(() => { window.location.href = "/login"; });
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const result = await apiRequest("/api/me", { method: "PATCH", body: JSON.stringify({ name, image }) });
      const authResult = await authClient.updateUser({ name, image });
      if (authResult.error) throw new Error(authResult.error.message || "Profile saved to LMS but authentication profile update failed");
      setUser(result.data);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function uploadProfileImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Choose a JPG, PNG, WebP or GIF image under 5 MB.");
      return;
    }
    const form = new FormData();
    form.append("image", file);
    try {
      const result = await apiRequest("/api/upload-image", { method: "POST", body: form });
      setImage(result.data.url);
      setMessage("Image uploaded. Save your profile to apply it.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function logout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  if (!user) return <main className="content"><p>Loading profile…</p></main>;
  return (
    <main className="content">
      <div className="auth-card">
        <p className="eyebrow">Profile</p>
        <h1 className="page-title">Your profile</h1>
        {message && <p className="alert" role="status">{message}</p>}
        {image && <img className="profile-image" src={image} alt="Profile" />}
        <form className="form" onSubmit={saveProfile}>
          <label>Name<input className="input" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} /></label>
          <label>Email<input className="input" value={user.email} disabled /></label>
          <label>Profile picture<input className="input" type="file" accept="image/*" onChange={uploadProfileImage} /></label>
          <p><strong>Role:</strong> {user.role}</p>
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
        </form>
        <button className="button button-secondary" type="button" onClick={logout}>Log out</button>
      </div>
    </main>
  );
}
