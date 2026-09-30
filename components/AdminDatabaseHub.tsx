import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { copyToClipboard } from '../utils/clipboard';

export const AdminDatabaseHub: React.FC = () => {
  const {
    projects,
    blogPosts,
    teamMembers,
    comments,
    settings,
    userRequests,
    dbConnected,
    syncWithDatabase,
    exportAllData,
    importAllData
  } = useCMS();

  const [activeCollection, setActiveCollection] = useState<'posts' | 'comments' | 'cpanel_settings' | 'team_members' | 'projects' | 'inquiries'>('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [selectedDocJson, setSelectedDocJson] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const collections = [
    { id: 'posts' as const, label: 'posts', count: blogPosts.length, icon: '📰', description: 'Tech news & knowledge base articles' },
    { id: 'comments' as const, label: 'comments', count: comments.length, icon: '💬', description: 'Reader comments and discussion entries' },
    { id: 'cpanel_settings' as const, label: 'cpanel_settings', count: 1, icon: '⚙️', description: 'Global site configuration and notifications' },
    { id: 'team_members' as const, label: 'team_members', count: teamMembers.length, icon: '👥', description: 'Engineering and leadership team profiles' },
    { id: 'projects' as const, label: 'projects', count: projects.length, icon: '💼', description: 'Portfolio applications and case studies' },
    { id: 'inquiries' as const, label: 'inquiries', count: userRequests.length, icon: '📬', description: 'Customer leads and form submissions' }
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      await syncWithDatabase();
      setSyncFeedback('✓ Cloud Database synchronized successfully! All tables verified.');
    } catch (e: any) {
      setSyncFeedback(`⚠️ Sync notice: ${e.message || 'Check connection'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  const handleDownloadDump = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuvex_cloud_db_dump_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importAllData(content);
        if (ok) {
          setSyncFeedback('✓ Backup successfully restored to memory and cloud cache!');
          setTimeout(() => setSyncFeedback(null), 3500);
        } else {
          setSyncFeedback('❌ Failed to restore backup: Invalid JSON schema');
          setTimeout(() => setSyncFeedback(null), 3500);
        }
      }
    };
    reader.readAsText(file);
  };

  // Active data records for table preview
  const getActiveRecords = () => {
    let list: any[] = [];
    switch (activeCollection) {
      case 'posts':
        list = blogPosts;
        break;
      case 'comments':
        list = comments;
        break;
      case 'cpanel_settings':
        list = [settings];
        break;
      case 'team_members':
        list = teamMembers;
        break;
      case 'projects':
        list = projects;
        break;
      case 'inquiries':
        list = userRequests;
        break;
    }

    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(item => JSON.stringify(item).toLowerCase().includes(q));
  };

  const records = getActiveRecords();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cloud Database Status Card */}
      <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-3 h-3 rounded-full ${dbConnected ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-blue-400">
                Managed Cloud Database • PostgreSQL &amp; Firestore
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Cloud Database &amp; <span className="text-gradient">Storage Engine</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Real-time persistent data storage for technical blog posts, reader comments, control panel settings, engineering team profiles, portfolio projects, and user inquiries.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
              <span className="px-3 py-1 rounded-xl bg-gray-950 border border-gray-800 text-gray-300">
                Database: <strong className="text-emerald-400">Active</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 truncate max-w-xs">
                Project ID: <strong className="text-blue-400">gen-lang-client-0266107086</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-gray-950 border border-gray-800 text-gray-300">
                Mode: <strong className="text-purple-400">Real-Time Sync + Local Cache</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Syncing Tables...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Sync &amp; Seed Database</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadDump}
              className="px-4 py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Download entire database dump as JSON"
            >
              <span>💾</span>
              <span>Export SQL/JSON</span>
            </button>

            <label className="px-4 py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer">
              <span>📤</span>
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleUploadBackup} className="hidden" />
            </label>
          </div>
        </div>

        {syncFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono">
            {syncFeedback}
          </div>
        )}
      </div>

      {/* Database Collections Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Database Tables &amp; Collections</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
              6 Tables Defined
            </span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">Click a collection to inspect records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const isSelected = activeCollection === col.id;
            return (
              <button
                key={col.id}
                onClick={() => {
                  setActiveCollection(col.id);
                  setSearchTerm('');
                  setSelectedDocJson(null);
                }}
                className={`p-5 rounded-3xl text-left transition-all border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center text-lg">
                    {col.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-950 border border-gray-800 text-gray-300'
                  }`}>
                    {col.count} {col.count === 1 ? 'doc' : 'docs'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono mb-1">
                  /{col.label}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {col.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Table Record Viewer */}
      <div className="p-6 md:p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs uppercase font-mono font-bold text-blue-400">
              Live Table Explorer
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Collection: /{activeCollection}</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-950 border border-gray-800 text-xs font-mono text-gray-400">
                {records.length} Records Shown
              </span>
            </h3>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search in ${activeCollection}...`}
              className="px-4 py-2 pl-9 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
            <span className="absolute left-3 top-2.5 text-gray-500 text-xs">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table representation */}
        {records.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No records found matching your filter in this table.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-4">Primary Identifier</th>
                  <th className="py-3 px-4">Key Summary Fields</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {records.map((item, idx) => {
                  const id = item.id || `doc_${idx}`;
                  const title = item.title || item.name || item.author || (item.siteName ? `Site Settings: ${item.siteName}` : id);
                  return (
                    <tr key={id} className="hover:bg-gray-950/60 transition-colors">
                      <td className="py-3.5 px-3 text-gray-500">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                        <span className="text-blue-400 mr-2">●</span>
                        <span>{title}</span>
                        <span className="block text-[10px] text-gray-500 font-mono">ID: {id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300 max-w-md truncate">
                        {item.category && <span className="mr-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">{item.category}</span>}
                        {item.role && <span className="mr-2 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">{item.role}</span>}
                        {item.email && <span className="mr-2 text-gray-400 text-[11px]">{item.email}</span>}
                        <span className="text-gray-400 text-[11px]">
                          {item.excerpt || item.bio || item.message || item.text || item.heroSubtitle || item.siteDescription || ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedDocJson(JSON.stringify(item, null, 2))}
                          className="px-3 py-1.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-[11px] text-blue-400 font-bold hover:text-white transition-all"
                        >
                          View JSON 👁️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Raw JSON Document Inspection */}
        {selectedDocJson && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-gray-950 border border-gray-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <h4 className="text-sm font-bold text-white font-mono">
                  Document JSON Inspector
                </h4>
                <button
                  onClick={() => setSelectedDocJson(null)}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>

              <pre className="p-4 bg-black rounded-2xl text-emerald-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-gray-900">
                <code>{selectedDocJson}</code>
              </pre>

              <div className="flex justify-end pt-2">
                <button
                  onClick={async () => {
                    if (selectedDocJson) {
                      await copyToClipboard(selectedDocJson);
                      setCopiedJson(true);
                      setTimeout(() => setCopiedJson(false), 2000);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>{copiedJson ? '✓' : '📋'}</span>
                  <span>{copiedJson ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDatabaseHub;
