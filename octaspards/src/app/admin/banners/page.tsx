"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import type { BannerDto } from "@/lib/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState("octaspards-admin");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New banner form state
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [imageUrl, setImageUrl] = useState("/banners/custom.jpg");
  const [linkUrl, setLinkUrl] = useState("/search?q=brake");
  const [sortOrder, setSortOrder] = useState(10);

  const fetchBanners = () => {
    setLoading(true);
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBanners(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          title,
          titleAr: titleAr || null,
          subtitle: subtitle || null,
          subtitleAr: subtitleAr || null,
          imageUrl,
          linkUrl: linkUrl || null,
          sortOrder: Number(sortOrder),
          active: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create banner");
      }

      setStatusMessage("Banner created successfully!");
      setTitle("");
      setTitleAr("");
      setSubtitle("");
      setSubtitleAr("");
      fetchBanners();
    } catch (err: unknown) {
      setStatusMessage(err instanceof Error ? err.message : "Error creating banner");
    }
  };

  const handleToggleActive = async (bannerId: number, currentActive: boolean) => {
    try {
      const res = await fetch("/api/banners", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          id: bannerId,
          active: !currentActive,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update banner");
      }

      setStatusMessage(`Banner #${bannerId} status updated!`);
      fetchBanners();
    } catch (err: unknown) {
      setStatusMessage(err instanceof Error ? err.message : "Error updating banner");
    }
  };

  const handleDeleteBanner = async (bannerId: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await fetch(`/api/banners?id=${bannerId}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": adminToken,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete banner");
      }

      setStatusMessage(`Banner #${bannerId} deleted successfully!`);
      fetchBanners();
    } catch (err: unknown) {
      setStatusMessage(err instanceof Error ? err.message : "Error deleting banner");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopNav />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mb-1"
            >
              ← Back to Catalogue
            </Link>
            <h1 className="text-2xl font-black text-heading">Promo Banners Administration</h1>
            <p className="text-xs text-placeholder">
              Manage promotional carousel banners displayed on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Admin Token:</label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="px-2.5 py-1 text-xs rounded border border-border bg-white"
            />
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-lg text-xs font-semibold bg-blue-50 text-primary border border-blue-200">
            {statusMessage}
          </div>
        )}

        {/* Existing Banners Table */}
        <div className="bg-white rounded-xl border border-cardBorder shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-heading">Active Carousel Banners</h2>

          {loading ? (
            <div className="py-8 text-center text-xs text-placeholder">Loading banners...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                  <tr>
                    <th className="p-2.5 text-start">Order</th>
                    <th className="p-2.5 text-start">Title (EN)</th>
                    <th className="p-2.5 text-start">Title (AR)</th>
                    <th className="p-2.5 text-start">Link</th>
                    <th className="p-2.5 text-start">Status</th>
                    <th className="p-2.5 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono">{b.sortOrder}</td>
                      <td className="p-2.5 font-bold text-slate-900">{b.title}</td>
                      <td className="p-2.5 text-slate-600">{b.titleAr || "—"}</td>
                      <td className="p-2.5 font-mono text-primary truncate max-w-[150px]">
                        {b.linkUrl || "—"}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.active
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {b.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-2.5 text-end space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(b.id, b.active)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          {b.active ? "Pause" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(b.id)}
                          className="px-2 py-1 rounded text-[11px] font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Banner Form */}
        <div className="bg-white rounded-xl border border-cardBorder shadow-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-heading">Add New Promo Banner</h2>

          <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Performance Ceramic Brakes"
                  className="w-full h-9 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Title (Arabic)
                </label>
                <input
                  type="text"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: فحمات سيراميك عالية الأداء"
                  className="w-full h-9 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none text-end"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle (English)
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  placeholder="Short marketing description..."
                  className="w-full p-2.5 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle (Arabic)
                </label>
                <textarea
                  value={subtitleAr}
                  onChange={(e) => setSubtitleAr(e.target.value)}
                  rows={2}
                  placeholder="وصف تسويقي مختصر..."
                  className="w-full p-2.5 rounded border border-border text-xs focus:border-primary focus:outline-none text-end"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image URL / Asset Path *
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/banners/brakes.jpg or https://..."
                  className="w-full h-9 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Link URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="/search?mode=number&q=04465-02220"
                  className="w-full h-9 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded border border-border text-xs focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold transition-colors shadow-sm"
            >
              Save New Banner
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
