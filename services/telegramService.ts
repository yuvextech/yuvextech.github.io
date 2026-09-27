import { BlogPost, TelegramConfig, TelegramDispatchLog, TelegramTarget } from '../types';

/**
 * Escapes HTML characters for Telegram HTML parse_mode
 */
export function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Strips markdown and HTML formatting for clean preview
 */
export function stripFormatting(str: string = ''): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`#]/g, '')
    .trim();
}

/**
 * Formats a user-friendly error message from Telegram API response
 */
function parseTelegramError(status: number, data: any): string {
  const desc = data?.description || '';
  if (status === 401 || desc.includes('Unauthorized')) {
    return 'Invalid Telegram Bot Token. Please check your token from @BotFather.';
  }
  if (desc.includes('chat not found')) {
    return 'Chat not found. Please verify the channel @username (e.g. @mychannel) or group ID (e.g. -100...)';
  }
  if (desc.includes('not enough rights') || desc.includes('have no rights to send a message') || desc.includes('bot is not an admin')) {
    return 'Permission denied: Please add your Bot as an Administrator in your Telegram Channel/Group with "Post Messages" permission.';
  }
  if (desc.includes('bot was kicked') || desc.includes('bot was blocked')) {
    return 'Bot was removed or blocked from this Telegram group/channel.';
  }
  if (desc.includes('wrong file identifier/HTTP URL')) {
    return 'The image URL could not be retrieved by Telegram servers.';
  }
  return desc || `Telegram API error (Status ${status})`;
}

/**
 * Verifies that a Telegram Bot Token is valid
 */
export async function testTelegramBotToken(botToken: string): Promise<{
  ok: boolean;
  username?: string;
  name?: string;
  error?: string;
}> {
  const token = (botToken || '').trim();
  if (!token) {
    return { ok: false, error: 'Telegram Bot Token is required.' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (data.ok && data.result) {
      return {
        ok: true,
        username: data.result.username,
        name: data.result.first_name || data.result.username
      };
    } else {
      return {
        ok: false,
        error: parseTelegramError(res.status, data)
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      error: `Network error connecting to Telegram Bot API: ${err.message || 'Check internet connection'}`
    };
  }
}

/**
 * Verifies bot access to a specific Telegram chat (Channel or Group)
 */
export async function testTelegramChatAccess(
  botToken: string,
  chatId: string
): Promise<{
  ok: boolean;
  title?: string;
  type?: string;
  error?: string;
}> {
  const token = (botToken || '').trim();
  const chat = (chatId || '').trim();
  if (!token) return { ok: false, error: 'Bot token is missing.' };
  if (!chat) return { ok: false, error: 'Target chat ID or @username is missing.' };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(chat)}`);
    const data = await res.json();
    if (data.ok && data.result) {
      return {
        ok: true,
        title: data.result.title || data.result.username || chat,
        type: data.result.type
      };
    } else {
      return {
        ok: false,
        error: parseTelegramError(res.status, data)
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      error: `Network error verifying Telegram chat: ${err.message || 'Failed to reach API'}`
    };
  }
}

/**
 * Sends a text message to a Telegram Channel or Group
 */
export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  htmlText: string,
  options: { disablePreview?: boolean } = {}
): Promise<{ ok: boolean; messageId?: number; error?: string }> {
  const token = (botToken || '').trim();
  const chat = (chatId || '').trim();
  if (!token) return { ok: false, error: 'Bot token is not configured.' };
  if (!chat) return { ok: false, error: 'Target chat ID is required.' };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: !!options.disablePreview
      })
    });

    const data = await res.json();
    if (data.ok && data.result) {
      return { ok: true, messageId: data.result.message_id };
    } else {
      return { ok: false, error: parseTelegramError(res.status, data) };
    }
  } catch (err: any) {
    return {
      ok: false,
      error: `Failed to dispatch Telegram message: ${err.message || 'Network error'}`
    };
  }
}

/**
 * Sends a photo with an HTML caption to a Telegram Channel or Group.
 * Automatically falls back to sendTelegramMessage if image upload/retrieval fails.
 */
export async function sendTelegramPhoto(
  botToken: string,
  chatId: string,
  photoUrl: string,
  captionHtml: string
): Promise<{ ok: boolean; messageId?: number; error?: string }> {
  const token = (botToken || '').trim();
  const chat = (chatId || '').trim();
  if (!token) return { ok: false, error: 'Bot token is not configured.' };
  if (!chat) return { ok: false, error: 'Target chat ID is required.' };

  // Telegram photo captions are limited to 1024 characters
  const trimmedCaption = captionHtml.length > 1020 
    ? captionHtml.substring(0, 1016) + '...' 
    : captionHtml;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        photo: photoUrl,
        caption: trimmedCaption,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();
    if (data.ok && data.result) {
      return { ok: true, messageId: data.result.message_id };
    }

    // Fallback: If Telegram cannot fetch the remote photo URL, fallback to regular message with text
    const fallbackText = `<a href="${photoUrl}">&#8205;</a>${captionHtml}`;
    return await sendTelegramMessage(token, chat, fallbackText, { disablePreview: false });
  } catch (err: any) {
    // Attempt fallback to text message
    try {
      return await sendTelegramMessage(token, chat, captionHtml, { disablePreview: false });
    } catch {
      return {
        ok: false,
        error: `Failed to dispatch Telegram photo: ${err.message || 'Network error'}`
      };
    }
  }
}

/**
 * Formats a Blog Post into a rich, structured Telegram post message
 */
export function formatBlogPostForTelegram(
  post: BlogPost,
  config: Partial<TelegramConfig> = {},
  siteBaseUrl?: string
): { caption: string; fullHtml: string } {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://yuvextech.github.io';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const baseUrl = siteBaseUrl || `${currentOrigin}${currentPath}`;
  const postUrl = `${baseUrl.replace(/\/+$/, '')}/#blog-detail/${post.id}`;

  const categoryEmoji: Record<string, string> = {
    'AI': '🤖',
    'Cloud': '☁️',
    'Architecture': '🏛️',
    'Mobile': '📱',
    'Security': '🛡️',
    'FinTech': '💳',
    'Web': '⚡'
  };

  const emoji = categoryEmoji[post.category] || '💡';
  const hashtags = (config.defaultHashtags || '#YuvexTech #SoftwareEngineering #TechNews').trim();

  // Caption for Photo (concise, <= 1024 chars)
  const caption = 
`${emoji} <b>NEW TECH INSIGHT: ${escapeHtml(post.title)}</b>

📁 <b>Category:</b> ${escapeHtml(post.category)} | ⏱️ ${escapeHtml(post.readTime)}
✍️ <b>Author:</b> ${escapeHtml(post.author)}

<i>"${escapeHtml(post.excerpt)}"</i>

🔗 <a href="${postUrl}">Read Full Technical Breakdown ↗</a>

${hashtags}`;

  // Full HTML for text-only message (can include more detail)
  const fullHtml = 
`🚀 <b>YUVEX TECH INSIGHTS</b>
━━━━━━━━━━━━━━━━━━━
${emoji} <b>${escapeHtml(post.title)}</b>

📁 <b>Category:</b> ${escapeHtml(post.category)}
⏱️ <b>Read Time:</b> ${escapeHtml(post.readTime)}
✍️ <b>Author:</b> ${escapeHtml(post.author)}
📅 <b>Date:</b> ${escapeHtml(post.date)}

<b>Executive Summary:</b>
${escapeHtml(post.excerpt)}

🔗 <b>Read Full Article:</b>
<a href="${postUrl}">${postUrl}</a>
━━━━━━━━━━━━━━━━━━━
${hashtags}`;

  return { caption, fullHtml };
}

/**
 * Formats an Announcement into a clean, high-visibility Telegram message
 */
export function formatAnnouncementForTelegram(
  announcement: {
    badge?: string;
    text: string;
    linkText?: string;
    linkUrl?: string;
  },
  siteBaseUrl?: string
): string {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://yuvextech.github.io';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const baseUrl = siteBaseUrl || `${currentOrigin}${currentPath}`;

  let targetUrl = '';
  if (announcement.linkUrl) {
    if (announcement.linkUrl.startsWith('http')) {
      targetUrl = announcement.linkUrl;
    } else {
      const cleanHash = announcement.linkUrl.replace(/^#/, '');
      targetUrl = `${baseUrl.replace(/\/+$/, '')}/#${cleanHash}`;
    }
  }

  const badgeText = announcement.badge ? `[${announcement.badge.toUpperCase()}]` : '[ANNOUNCEMENT]';

  return (
`📢 <b>${escapeHtml(badgeText)} YUVEX TECH UPDATE</b>
━━━━━━━━━━━━━━━━━━━
⚡ <b>${escapeHtml(announcement.text)}</b>

${targetUrl && announcement.linkText ? `👉 <a href="${targetUrl}">${escapeHtml(announcement.linkText)} ↗</a>\n` : ''}${targetUrl && !announcement.linkText ? `👉 <a href="${targetUrl}">${targetUrl}</a>\n` : ''}
━━━━━━━━━━━━━━━━━━━
🌐 <i>Official Yuvex Tech Broadcast • <a href="${baseUrl}">Visit Website</a></i>`
  );
}

/**
 * Formats a custom Quick Announcement / Message
 */
export function formatQuickMessageForTelegram(text: string, title?: string, siteBaseUrl?: string): string {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://yuvextech.github.io';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const baseUrl = siteBaseUrl || `${currentOrigin}${currentPath}`;

  return (
`⚡ <b>${escapeHtml(title || 'YUVEX TECH ANNOUNCEMENT')}</b>
━━━━━━━━━━━━━━━━━━━
${escapeHtml(text)}

━━━━━━━━━━━━━━━━━━━
🌐 <i><a href="${baseUrl}">Yuvex Tech Architecture & Engineering</a></i>`
  );
}

export interface DispatchResult {
  targetId: string;
  targetName: string;
  ok: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Broadcasts a Blog Post to selected or all active Telegram targets
 */
export async function broadcastBlogPost(
  config: TelegramConfig,
  post: BlogPost,
  targetIds?: string[]
): Promise<{
  results: DispatchResult[];
  logs: TelegramDispatchLog[];
  successCount: number;
  failureCount: number;
}> {
  if (!config.botToken) {
    return {
      results: [],
      logs: [],
      successCount: 0,
      failureCount: 0
    };
  }

  // Filter targets: if targetIds provided and does not include 'all', filter by targetIds; otherwise all enabled targets
  const targetsToPost = config.targets.filter(t => {
    if (!t.enabled) return false;
    if (!targetIds || targetIds.length === 0 || targetIds.includes('all')) return true;
    return targetIds.includes(t.id);
  });

  if (targetsToPost.length === 0) {
    return {
      results: [],
      logs: [],
      successCount: 0,
      failureCount: 0
    };
  }

  const { caption, fullHtml } = formatBlogPostForTelegram(post, config);
  const results: DispatchResult[] = [];
  const logs: TelegramDispatchLog[] = [];

  for (const target of targetsToPost) {
    let res: { ok: boolean; messageId?: number; error?: string };

    if (config.sendWithPhoto && post.image) {
      res = await sendTelegramPhoto(config.botToken, target.id, post.image, caption);
    } else {
      res = await sendTelegramMessage(config.botToken, target.id, fullHtml);
    }

    results.push({
      targetId: target.id,
      targetName: target.name,
      ok: res.ok,
      messageId: res.messageId,
      error: res.error
    });

    logs.push({
      id: 'tg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'blog',
      title: post.title,
      targetId: target.id,
      targetName: target.name,
      dispatchedAt: new Date().toISOString(),
      status: res.ok ? 'success' : 'error',
      errorMessage: res.error,
      messageId: res.messageId
    });
  }

  const successCount = results.filter(r => r.ok).length;
  const failureCount = results.filter(r => !r.ok).length;

  return { results, logs, successCount, failureCount };
}

/**
 * Broadcasts an Announcement to selected or all active Telegram targets
 */
export async function broadcastAnnouncement(
  config: TelegramConfig,
  announcement: {
    badge?: string;
    text: string;
    linkText?: string;
    linkUrl?: string;
  },
  targetIds?: string[]
): Promise<{
  results: DispatchResult[];
  logs: TelegramDispatchLog[];
  successCount: number;
  failureCount: number;
}> {
  if (!config.botToken) {
    return { results: [], logs: [], successCount: 0, failureCount: 0 };
  }

  const targetsToPost = config.targets.filter(t => {
    if (!t.enabled) return false;
    if (!targetIds || targetIds.length === 0 || targetIds.includes('all')) return true;
    return targetIds.includes(t.id);
  });

  if (targetsToPost.length === 0) {
    return { results: [], logs: [], successCount: 0, failureCount: 0 };
  }

  const messageText = formatAnnouncementForTelegram(announcement);
  const results: DispatchResult[] = [];
  const logs: TelegramDispatchLog[] = [];

  for (const target of targetsToPost) {
    const res = await sendTelegramMessage(config.botToken, target.id, messageText);

    results.push({
      targetId: target.id,
      targetName: target.name,
      ok: res.ok,
      messageId: res.messageId,
      error: res.error
    });

    logs.push({
      id: 'tg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'announcement',
      title: announcement.text.substring(0, 60),
      targetId: target.id,
      targetName: target.name,
      dispatchedAt: new Date().toISOString(),
      status: res.ok ? 'success' : 'error',
      errorMessage: res.error,
      messageId: res.messageId
    });
  }

  const successCount = results.filter(r => r.ok).length;
  const failureCount = results.filter(r => !r.ok).length;

  return { results, logs, successCount, failureCount };
}

/**
 * Dispatches a quick custom message to Telegram targets
 */
export async function broadcastQuickMessage(
  config: TelegramConfig,
  text: string,
  title?: string,
  photoUrl?: string,
  targetIds?: string[]
): Promise<{
  results: DispatchResult[];
  logs: TelegramDispatchLog[];
  successCount: number;
  failureCount: number;
}> {
  if (!config.botToken) {
    return { results: [], logs: [], successCount: 0, failureCount: 0 };
  }

  const targetsToPost = config.targets.filter(t => {
    if (!t.enabled) return false;
    if (!targetIds || targetIds.length === 0 || targetIds.includes('all')) return true;
    return targetIds.includes(t.id);
  });

  const messageText = formatQuickMessageForTelegram(text, title);
  const results: DispatchResult[] = [];
  const logs: TelegramDispatchLog[] = [];

  for (const target of targetsToPost) {
    let res: { ok: boolean; messageId?: number; error?: string };
    if (photoUrl && photoUrl.trim()) {
      res = await sendTelegramPhoto(config.botToken, target.id, photoUrl.trim(), messageText);
    } else {
      res = await sendTelegramMessage(config.botToken, target.id, messageText);
    }

    results.push({
      targetId: target.id,
      targetName: target.name,
      ok: res.ok,
      messageId: res.messageId,
      error: res.error
    });

    logs.push({
      id: 'tg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: 'quick_message',
      title: (title || text).substring(0, 60),
      targetId: target.id,
      targetName: target.name,
      dispatchedAt: new Date().toISOString(),
      status: res.ok ? 'success' : 'error',
      errorMessage: res.error,
      messageId: res.messageId
    });
  }

  return {
    results,
    logs,
    successCount: results.filter(r => r.ok).length,
    failureCount: results.filter(r => !r.ok).length
  };
}

/**
 * Creates a direct Telegram web share link
 */
export function getTelegramShareUrl(url: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
