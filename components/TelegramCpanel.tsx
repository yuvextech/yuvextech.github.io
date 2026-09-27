import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { TelegramTarget } from '../types';
import { escapeHtml, testTelegramBotToken, testTelegramChatAccess } from '../services/telegramService';

interface TelegramCpanelProps {
  onNavigateToBlog?: (id: string) => void;
}

export const TelegramCpanel: React.FC<TelegramCpanelProps> = () => {
  const {
    telegramConfig,
    telegramLogs,
    updateTelegramConfig,
    addTelegramTarget,
    updateTelegramTarget,
    deleteTelegramTarget,
    clearTelegramLogs,
    verifyTelegramBotToken,
    testTelegramTarget,
    postQuickMessageToTelegram,
    blogPosts
  } = useCMS();

  // Local form state for bot token
  const [tokenInput, setTokenInput] = useState(telegramConfig.botToken || '');
  const [showToken, setShowToken] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [tokenFeedback, setTokenFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // New Target Form State
  const [showAddTargetForm, setShowAddTargetForm] = useState(false);
  const [newTargetId, setNewTargetId] = useState('');
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetType, setNewTargetType] = useState<'channel' | 'group'>('channel');
  const [targetFormError, setTargetFormError] = useState<string | null>(null);

  // Testing Target State
  const [testingTargetId, setTestingTargetId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ targetId: string; ok: boolean; message: string } | null>(null);

  // Quick Composer State
  const [composerTarget, setComposerTarget] = useState<string>('all');
  const [composerTitle, setComposerTitle] = useState('');
  const [composerText, setComposerText] = useState('');
  const [composerPhotoUrl, setComposerPhotoUrl] = useState('');
  const [isSendingQuick, setIsSendingQuick] = useState(false);
  const [composerFeedback, setComposerFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // Settings Save Notification
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Step-by-Step Guide Collapsible
  const [showGuide, setShowGuide] = useState(!telegramConfig.botToken);

  // Active targets count
  const activeTargetsCount = telegramConfig.targets.filter(t => t.enabled).length;

  // Handle Token Verification & Save
  const handleVerifyToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) {
      setTokenFeedback({ ok: false, message: 'Please enter a Telegram Bot Token.' });
      return;
    }

    setIsVerifyingToken(true);
    setTokenFeedback(null);

    const res = await verifyTelegramBotToken(cleanToken);
    setIsVerifyingToken(false);

    if (res.ok) {
      setTokenFeedback({
        ok: true,
        message: `✓ Connected as @${res.username} (${res.name || 'Bot'})`
      });
      setTimeout(() => setTokenFeedback(null), 5000);
    } else {
      setTokenFeedback({
        ok: false,
        message: res.error || 'Failed to verify bot token. Please check the token string.'
      });
    }
  };

  // Handle Add New Target
  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetFormError(null);

    let cleanId = newTargetId.trim();
    if (!cleanId) {
      setTargetFormError('Target ID or @username is required.');
      return;
    }

    // Auto-prepend @ if user typed a username without @ or -
    if (!cleanId.startsWith('@') && !cleanId.startsWith('-') && isNaN(Number(cleanId))) {
      cleanId = '@' + cleanId;
    }

    const cleanName = newTargetName.trim() || (cleanId.startsWith('@') ? cleanId : `${newTargetType === 'channel' ? 'Channel' : 'Group'} ${cleanId}`);

    addTelegramTarget({
      id: cleanId,
      name: cleanName,
      type: newTargetType,
      enabled: true,
      addedAt: new Date().toISOString()
    });

    setNewTargetId('');
    setNewTargetName('');
    setShowAddTargetForm(false);
  };

  // Handle Test Target
  const handleTestTarget = async (targetId: string) => {
    setTestingTargetId(targetId);
    setTestResult(null);

    const res = await testTelegramTarget(targetId);
    setTestingTargetId(null);

    if (res.ok) {
      setTestResult({
        targetId,
        ok: true,
        message: '✓ Test message delivered successfully to Telegram!'
      });
    } else {
      setTestResult({
        targetId,
        ok: false,
        message: res.error || 'Failed to deliver message. Check bot admin rights.'
      });
    }

    setTimeout(() => {
      setTestResult(prev => prev?.targetId === targetId ? null : prev);
    }, 6000);
  };

  // Handle Quick Broadcast Send
  const handleSendQuickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    if (!telegramConfig.botToken) {
      setComposerFeedback({ ok: false, message: 'Please configure your Telegram Bot Token first.' });
      return;
    }

    const targetIds = composerTarget === 'all' ? ['all'] : [composerTarget];
    setIsSendingQuick(true);
    setComposerFeedback(null);

    const res = await postQuickMessageToTelegram(
      composerText.trim(),
      composerTitle.trim() || 'YUVEX TECH BROADCAST',
      composerPhotoUrl.trim() || undefined,
      targetIds
    );

    setIsSendingQuick(false);

    if (res.successCount > 0) {
      setComposerFeedback({
        ok: true,
        message: `✓ Broadcast dispatched successfully to ${res.successCount} target(s)!`
      });
      setComposerText('');
      setComposerTitle('');
      setComposerPhotoUrl('');
      setTimeout(() => setComposerFeedback(null), 5000);
    } else {
      const err = res.results.find(r => !r.ok)?.error || 'Failed to dispatch broadcast.';
      setComposerFeedback({
        ok: false,
        message: `Failed to dispatch: ${err}`
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-sky-950/70 via-blue-950/70 to-indigo-950/70 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider mb-3 border border-sky-500/30">
            <span className={`w-2 h-2 rounded-full ${telegramConfig.botToken && telegramConfig.botUsername ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{telegramConfig.botToken && telegramConfig.botUsername ? 'Telegram Bot Active' : 'Setup Required'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>✈️</span>
            <span>Telegram Channel & Group Auto-Poster</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-300 max-w-2xl mt-1 leading-relaxed">
            Automatically broadcast new tech articles and site announcements to your chosen Telegram channels and community groups with rich previews, cover photos, and instant deep links.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-4 py-2 rounded-xl bg-gray-900/80 border border-gray-700 hover:bg-gray-800 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5"
          >
            <span>📖</span>
            <span>{showGuide ? 'Hide Setup Guide' : 'Setup Guide'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddTargetForm(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Add Channel / Group</span>
          </button>
        </div>
      </div>

      {/* Setup Guide Collapsible */}
      {showGuide && (
        <div className="p-6 rounded-3xl bg-gray-900 border border-sky-500/20 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-sky-400 text-base">📘</span>
              <span>Quick 3-Step Telegram Integration Guide</span>
            </h3>
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs text-gray-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center font-mono">
                1
              </div>
              <h4 className="font-bold text-white">Create Your Bot</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Open Telegram and message <strong className="text-sky-300">@BotFather</strong>. Send <code className="text-sky-200 font-mono">/newbot</code>, choose a name and username. Copy the generated HTTP API token below.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center font-mono">
                2
              </div>
              <h4 className="font-bold text-white">Add Bot as Admin</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Open your Telegram Channel or Group, go to <strong>Manage &gt; Administrators &gt; Add Administrator</strong>, search for your bot username, and ensure <strong>"Post Messages"</strong> is enabled.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center font-mono">
                3
              </div>
              <h4 className="font-bold text-white">Add Channel / Group ID</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Enter your channel's public handle (e.g. <code className="text-sky-200 font-mono">@yuvextech</code>) or private chat ID (e.g. <code className="text-sky-200 font-mono">-1001234567890</code>). Click "Test" to verify instant delivery!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: BOT TOKEN & CONNECTION */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Telegram Bot Authentication</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Bot API Credentials</h3>
            <p className="text-xs text-gray-400">
              The Telegram Bot API token used to authorize message and photo dispatches.
            </p>
          </div>

          {telegramConfig.botUsername && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>@{telegramConfig.botUsername}</span>
              {telegramConfig.botName && <span className="text-gray-400">({telegramConfig.botName})</span>}
            </div>
          )}
        </div>

        <form onSubmit={handleVerifyToken} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Telegram Bot Token (from @BotFather)
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    setTokenFeedback(null);
                  }}
                  placeholder="e.g. 7123456789:AAHk..._ABCdef"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-sky-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? '🙈' : '👁️'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifyingToken}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingToken ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Verify & Save Bot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {tokenFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              tokenFeedback.ok
                ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                : 'bg-red-950/60 border border-red-800/60 text-red-300'
            }`}>
              <span>{tokenFeedback.ok ? '✓' : '⚠️'}</span>
              <span>{tokenFeedback.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* SECTION 2: CHANNELS & GROUPS MANAGEMENT */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Target Audiences</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Configured Channels & Groups</h3>
            <p className="text-xs text-gray-400">
              Select which channels or groups receive automated posts and announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTargetForm(!showAddTargetForm)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>{showAddTargetForm ? '✕ Cancel' : '+ Add New Target'}</span>
          </button>
        </div>

        {/* Add Target Inline Form */}
        {showAddTargetForm && (
          <form onSubmit={handleAddTarget} className="p-5 rounded-2xl bg-gray-950 border border-indigo-500/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Add Telegram Channel or Group
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Target Type</label>
                <select
                  value={newTargetType}
                  onChange={(e) => setNewTargetType(e.target.value as 'channel' | 'group')}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="channel">📢 Channel (Public or Private)</option>
                  <option value="group">👥 Group / Supergroup</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Chat ID or Username *
                </label>
                <input
                  type="text"
                  required
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  placeholder="e.g. @yuvextech or -1001234567890"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Friendly Label (Name)
                </label>
                <input
                  type="text"
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  placeholder="e.g. Official Announcements"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {targetFormError && (
              <p className="text-xs text-red-400 font-semibold">{targetFormError}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800/80">
              <button
                type="button"
                onClick={() => setShowAddTargetForm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-sm"
              >
                Save Target
              </button>
            </div>
          </form>
        )}

        {/* Targets List */}
        {telegramConfig.targets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-gray-950 border border-gray-800">
            <span className="text-3xl block mb-2">📢</span>
            <h4 className="text-sm font-bold text-white mb-1">No Telegram Targets Added Yet</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
              Add your official channel handle (e.g. @yuvextech) or group ID to start broadcasting updates.
            </p>
            <button
              onClick={() => setShowAddTargetForm(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
            >
              + Add First Channel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {telegramConfig.targets.map(target => (
              <div
                key={target.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  target.enabled
                    ? 'bg-gray-950/80 border-gray-800 hover:border-gray-700'
                    : 'bg-gray-950/40 border-gray-800/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-gray-800 text-gray-300">
                      <span>{target.type === 'channel' ? '📢' : '👥'}</span>
                      <span>{target.type}</span>
                    </span>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={target.enabled}
                        onChange={(e) => updateTelegramTarget(target.id, { enabled: e.target.checked })}
                        className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-0 bg-gray-900 border-gray-700"
                      />
                      <span className={`text-[11px] font-bold ${target.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {target.enabled ? 'Active' : 'Paused'}
                      </span>
                    </label>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-0.5">{target.name}</h4>
                  <div className="font-mono text-xs text-sky-400 font-semibold mb-3">
                    {target.id}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={testingTargetId === target.id || !telegramConfig.botToken}
                    onClick={() => handleTestTarget(target.id)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {testingTargetId === target.id ? (
                      <>
                        <div className="w-3 h-3 border border-sky-400/40 border-t-sky-400 rounded-full animate-spin" />
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>Send Test</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove Telegram target "${target.name}" (${target.id})?`)) {
                        deleteTelegramTarget(target.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete target"
                  >
                    🗑️
                  </button>
                </div>

                {testResult && testResult.targetId === target.id && (
                  <div className={`mt-2.5 p-2 rounded-lg text-[11px] font-medium ${
                    testResult.ok
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      : 'bg-red-950/80 text-red-300 border border-red-800/80'
                  }`}>
                    {testResult.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: AUTOMATION RULES & PREFERENCES */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="pb-4 border-b border-gray-800">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Automation Settings</span>
          <h3 className="text-lg font-bold text-white mt-0.5">Auto-Post Triggers & Formatting</h3>
          <p className="text-xs text-gray-400">
            Define what triggers automatic Telegram posts and how messages are composed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Automatic Triggers</h4>
            
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={telegramConfig.autoPostBlogs}
                onChange={(e) => updateTelegramConfig({ autoPostBlogs: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 bg-gray-900 border-gray-700 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-white block">Auto-post new Blog & Tech News articles</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Whenever an article is published from the CMS or AI Post Generator, immediately broadcast it.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={telegramConfig.autoPostAnnouncements}
                onChange={(e) => updateTelegramConfig({ autoPostAnnouncements: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 bg-gray-900 border-gray-700 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-white block">Auto-post Top Announcement updates</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Whenever the website top banner announcement is updated, broadcast it to the channel.
                </span>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Format & Media</h4>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={telegramConfig.sendWithPhoto}
                onChange={(e) => updateTelegramConfig({ sendWithPhoto: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 bg-gray-900 border-gray-700 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-white block">Attach Cover Image (Photo Card)</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Posts the article cover image with rich HTML caption (falls back to text if unreachable).
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={telegramConfig.includeLink}
                onChange={(e) => updateTelegramConfig({ includeLink: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 focus:ring-0 bg-gray-900 border-gray-700 mt-0.5"
              />
              <div>
                <span className="text-xs font-bold text-white block">Include Direct Article Link</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Embeds clickable website article link pointing to yuvextech.github.io.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Default Destination & Hashtags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Default Target Destination
            </label>
            <select
              value={telegramConfig.selectedTargetId || 'all'}
              onChange={(e) => updateTelegramConfig({ selectedTargetId: e.target.value })}
              className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
            >
              <option value="all">🌟 All Active Channels & Groups ({activeTargetsCount})</option>
              {telegramConfig.targets.map(t => (
                <option key={t.id} value={t.id}>
                  {t.type === 'channel' ? '📢' : '👥'} {t.name} ({t.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Default Hashtags
            </label>
            <input
              type="text"
              value={telegramConfig.defaultHashtags || ''}
              onChange={(e) => updateTelegramConfig({ defaultHashtags: e.target.value })}
              placeholder="#YuvexTech #SoftwareEngineering #TechNews"
              className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <span className="text-xs text-gray-400">
            Settings automatically persist in your local CMS configuration.
          </span>
          <button
            type="button"
            onClick={() => {
              setSettingsSavedNotice(true);
              setTimeout(() => setSettingsSavedNotice(false), 2500);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            {settingsSavedNotice ? '✓ Saved!' : 'Save Automation Rules'}
          </button>
        </div>
      </div>

      {/* SECTION 4: LIVE ANNOUNCEMENT & QUICK COMPOSER */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="pb-4 border-b border-gray-800">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Instant Broadcast</span>
          <h3 className="text-lg font-bold text-white mt-0.5">Live Announcement Composer</h3>
          <p className="text-xs text-gray-400">
            Write and dispatch an instant announcement or custom message directly to Telegram right now.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSendQuickBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Target Channel / Group</label>
              <select
                value={composerTarget}
                onChange={(e) => setComposerTarget(e.target.value)}
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              >
                <option value="all">🌟 All Active Targets ({activeTargetsCount})</option>
                {telegramConfig.targets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.type === 'channel' ? '📢' : '👥'} {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Announcement Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={composerTitle}
                onChange={(e) => setComposerTitle(e.target.value)}
                placeholder="e.g. Major Cloud Platform Architecture Update"
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Announcement Body *
              </label>
              <textarea
                required
                rows={4}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Type your announcement or update here..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Optional Banner Photo URL
              </label>
              <input
                type="url"
                value={composerPhotoUrl}
                onChange={(e) => setComposerPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            {composerFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                composerFeedback.ok
                  ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/60 border border-red-800/60 text-red-300'
              }`}>
                <span>{composerFeedback.ok ? '✓' : '⚠️'}</span>
                <span>{composerFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSendingQuick || !composerText.trim() || !telegramConfig.botToken}
              className="w-full py-3 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSendingQuick ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching to Telegram...</span>
                </>
              ) : (
                <>
                  <span>✈️</span>
                  <span>Dispatch Broadcast to Telegram</span>
                </>
              )}
            </button>
          </form>

          {/* Live Telegram Chat Preview Bubble */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5">
              <span>📱</span>
              <span>Telegram Message Live Preview</span>
            </span>

            <div className="flex-1 p-5 rounded-3xl bg-[#0f141c] border border-gray-800 flex flex-col justify-end">
              <div className="max-w-md bg-[#212d3b] rounded-2xl rounded-bl-sm p-4 text-white text-xs shadow-xl space-y-2 border border-white/5 self-start">
                {composerPhotoUrl ? (
                  <div className="rounded-xl overflow-hidden mb-2 max-h-48 bg-black/40">
                    <img
                      src={composerPhotoUrl}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : null}

                <div className="font-bold text-sky-400 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>{composerTitle || 'YUVEX TECH ANNOUNCEMENT'}</span>
                </div>

                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {composerText || 'Your announcement text will appear here formatted with bold headlines, links, and hashtags.'}
                </div>

                <div className="pt-2 border-t border-white/10 text-[10px] text-gray-400 flex items-center justify-between">
                  <span>yuvextech.github.io</span>
                  <span className="font-mono text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: DISPATCH LOGS */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Broadcast History</span>
            <h3 className="text-lg font-bold text-white mt-0.5">Telegram Dispatch Logs</h3>
            <p className="text-xs text-gray-400">
              Audit trail of messages dispatched via Telegram Bot API.
            </p>
          </div>

          {telegramLogs.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all Telegram dispatch logs?')) {
                  clearTelegramLogs();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-colors"
            >
              Clear Logs
            </button>
          )}
        </div>

        {telegramLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-gray-950 border border-gray-800 text-xs text-gray-400">
            No messages have been dispatched yet. When you publish a post or send an announcement, it will be recorded here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Content / Title</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-sans">
                {telegramLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-950/40">
                    <td className="p-3 text-[11px] text-gray-400 whitespace-nowrap font-mono">
                      {new Date(log.dispatchedAt).toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        log.type === 'blog'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : log.type === 'announcement'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : log.type === 'test'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-white max-w-xs truncate">
                      {log.title}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-sky-400 whitespace-nowrap">
                      {log.targetName} ({log.targetId})
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <span>✓</span>
                          <span>Delivered</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[11px]" title={log.errorMessage}>
                          <span>✕</span>
                          <span className="truncate max-w-[120px]">{log.errorMessage || 'Error'}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default TelegramCpanel;
