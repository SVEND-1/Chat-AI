/* ─── Design tokens ──────────────────────── */
:root {
    --bg:           #0b0d14;
    --bg2:          #12151f;
    --bg3:          #1a1e2e;
    --bg4:          #222740;
    --border:       #252a3d;
    --border-light: #2e3550;
    --text:         #dde1f0;
    --muted:        #636b8a;
    --accent:       #5b8af0;
    --accent-dim:   #111d3d;
    --accent-glow:  rgba(91, 138, 240, 0.18);
    --green:        #3ecf72;
    --green-dim:    #0a2018;
    --red:          #f05b5b;
    --red-dim:      #2a0e0e;
    --yellow:       #f0c05b;
    --support-clr:  #c48af5;
    --support-dim:  #1e1030;
    --font-mono:    'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
}

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* ─── App shell ──────────────────────────── */
.app {
    font-family: var(--font-mono);
    background: var(--bg);
    color: var(--text);
    height: 100vh;
    display: grid;
    grid-template-rows: 48px 1fr;
    overflow: hidden;
}

/* ─── Topbar ─────────────────────────────── */
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    flex-shrink: 0;
}

.topbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.topbar-logo {
    color: var(--accent);
    font-size: 13px;
}

.topbar-role {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 99px;
    border: 1px solid var(--border-light);
    color: var(--muted);
    font-weight: 400;
    transition: all 0.3s;
}

.topbar-role.role-user    { border-color: var(--accent); color: var(--accent); }
.topbar-role.role-support { border-color: var(--support-clr); color: var(--support-clr); }
.topbar-role.role-admin   { border-color: var(--yellow); color: var(--yellow); }

/* ─── Status pill ────────────────────────── */
.pill {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 4px 12px;
    border-radius: 99px;
    border: 1px solid var(--border);
    font-size: 10px;
    font-weight: 400;
    color: var(--muted);
    transition: all 0.25s;
}

.pill .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--muted);
    transition: background 0.3s;
}

.pill.ok   { border-color: var(--green); color: var(--green); }
.pill.ok   .dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
.pill.err  { border-color: var(--red); color: var(--red); }
.pill.err  .dot { background: var(--red); }

/* ─── Main layout ────────────────────────── */
.layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    overflow: hidden;
    min-height: 0;
}

/* ─── Sidebar ────────────────────────────── */
.sidebar {
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg2);
}

.section {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.section-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
}

/* ─── Ticket list (support/admin view) ───── */
.ticket-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.ticket-list-header {
    padding: 10px 16px 6px;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}

.ticket-item {
    padding: 11px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.ticket-item:hover { background: var(--bg3); }
.ticket-item.active { background: var(--bg4); border-left: 2px solid var(--accent); }

.ticket-item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ticket-item-id {
    font-size: 9px;
    color: var(--muted);
}

.ticket-item-title {
    font-size: 12px;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ticket-item-meta {
    font-size: 10px;
    color: var(--muted);
}

/* ─── Connection section (user view) ─────── */
.inp {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    padding: 7px 10px;
    outline: none;
    margin-bottom: 8px;
    transition: border-color 0.15s;
}
.inp:focus { border-color: var(--accent); }
.inp:last-of-type { margin-bottom: 0; }

.hint {
    font-size: 10px;
    color: var(--muted);
    line-height: 1.6;
    margin-top: 8px;
}

.btn {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s;
    margin-top: 10px;
}
.btn:hover { background: var(--bg3); border-color: var(--accent); color: var(--accent); }
.btn.btn-red { border-color: var(--red); color: var(--red); }
.btn.btn-red:hover { background: var(--red-dim); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }

/* ─── Event log ──────────────────────────── */
.log-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 12px 16px 4px;
    flex-shrink: 0;
}

.log {
    flex: 1;
    overflow-y: auto;
    padding: 6px 10px;
    font-size: 10.5px;
    line-height: 1.7;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-height: 0;
}

.le {
    padding: 2px 8px;
    border-radius: 3px;
    border-left: 2px solid transparent;
    word-break: break-all;
    color: var(--muted);
}
.le.ok   { border-color: var(--green); color: var(--green); background: var(--green-dim); }
.le.err  { border-color: var(--red); color: var(--red); background: var(--red-dim); }
.le.recv { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.le .t   { opacity: 0.45; margin-right: 5px; }

/* ─── Chat area ──────────────────────────── */
.chat {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
    min-height: 0;
}

.chat-hdr {
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg2);
    flex-shrink: 0;
}

.chat-hdr-info { flex: 1; }
.chat-hdr-id   { font-size: 10px; color: var(--muted); margin-bottom: 2px; }
.chat-hdr-title { font-size: 13px; }

.badge {
    font-size: 9px;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: 0.06em;
    font-weight: 600;
}
.badge.open   { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
.badge.closed { background: var(--bg3); color: var(--muted); border: 1px solid var(--border); }

/* ─── Messages — ИСПРАВЛЕННЫЕ СТИЛИ (мои справа, чужие слева, перенос текста) ───── */
.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
}

.empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    font-size: 12px;
    gap: 10px;
    opacity: 0.5;
}

.empty-icon { font-size: 40px; }

/* РЯД СООБЩЕНИЯ */
.msg-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
}

/* МОИ СООБЩЕНИЯ — СПРАВА */
.msg-row.mine {
    flex-direction: row-reverse;
}

/* ЧУЖИЕ СООБЩЕНИЯ — СЛЕВА (по умолчанию) */
.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
}

.avatar.mine    { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent); }
.avatar.user    { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent); }
.avatar.support { background: var(--support-dim); color: var(--support-clr); border: 1px solid var(--support-clr); }
.avatar.other   { background: var(--bg3); color: var(--muted); border: 1px solid var(--border); }

/* ПУЗЫРЬКИ СООБЩЕНИЙ — с переносом длинных слов */
.bubble {
    max-width: 80%;
    padding: 9px 13px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: normal;
}

/* МОИ СООБЩЕНИЯ (справа) */
.bubble.mine {
    background: var(--accent-dim);
    color: var(--accent);
    border: 1px solid var(--accent);
    border-bottom-right-radius: 3px;
}

/* СООБЩЕНИЯ ПОЛЬЗОВАТЕЛЯ (слева, когда пишешь не ты) */
.bubble.user {
    background: var(--accent-dim);
    color: var(--accent);
    border: 1px solid var(--accent);
    border-bottom-left-radius: 3px;
}

/* СООБЩЕНИЯ ПОДДЕРЖКИ (слева) */
.bubble.support {
    background: var(--support-dim);
    color: var(--support-clr);
    border: 1px solid var(--support-clr);
    border-bottom-left-radius: 3px;
}

/* ДРУГИЕ СООБЩЕНИЯ (слева) */
.bubble.other {
    background: var(--bg3);
    color: var(--text);
    border: 1px solid var(--border);
    border-bottom-left-radius: 3px;
}

/* ВРЕМЯ СООБЩЕНИЯ */
.msg-meta {
    font-size: 10px;
    color: var(--muted);
    margin-top: 4px;
    padding: 0 5px;
}

/* Время у моих сообщений — справа */
.msg-row.mine .msg-meta {
    text-align: right;
}

/* Время у чужих сообщений — слева */
.msg-row:not(.mine) .msg-meta {
    text-align: left;
}

/* СИСТЕМНЫЕ СООБЩЕНИЯ */
.sys-msg {
    text-align: center;
    font-size: 10px;
    color: var(--muted);
    padding: 4px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

/* ─── Input area ─────────────────────────── */
.input-area {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
    background: var(--bg2);
    flex-shrink: 0;
}

.chat-textarea {
    flex: 1;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    padding: 9px 13px;
    resize: none;
    outline: none;
    min-height: 40px;
    max-height: 120px;
    line-height: 1.5;
    transition: border-color 0.15s;
}
.chat-textarea:focus { border-color: var(--accent); }
.chat-textarea:disabled { opacity: 0.4; cursor: not-allowed; }

.send-btn {
    padding: 9px 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.send-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.send-btn:active:not(:disabled) { transform: scale(0.97); }
.send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.close-btn {
    padding: 9px 14px;
    border-radius: 8px;
    border: 1px solid var(--red);
    background: transparent;
    color: var(--red);
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.close-btn:hover:not(:disabled) { background: var(--red-dim); }
.close-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ─── Loading / Error screens ────────────── */
.screen-center {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: var(--bg);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 13px;
}

.screen-center .icon { font-size: 36px; margin-bottom: 6px; }
.screen-center .title { color: var(--text); font-size: 15px; font-weight: 600; }

/* ─── Scrollbars ─────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ─── Адаптивность ───────────────────────── */

/* ─── Бургер-кнопка ─────────────────────── */
.burger-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
}

.burger-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
}

.burger-btn svg {
    stroke: currentColor;
    fill: none;
    width: 16px;
    height: 16px;
}

/* ─── Оверлей для мобилки ────────────────── */
.sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 99;
    backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
.burger-btn {
        display: flex;
    }

.sidebar-overlay.open {
        display: block;
    }

.layout {
        grid-template-columns: 1fr;
    }

.sidebar {
        position: fixed;
        left: -300px;
        top: 48px;
        height: calc(100vh - 48px);
        width: 300px;
        z-index: 100;
        transition: left 0.3s ease;
    }

.sidebar.open {
        left: 0;
    }

.bubble {
        max-width: 88%;
    }

.messages {
        padding: 12px;
    }

.input-area {
        padding: 10px 12px;
    }
}

/* ─── Modal ──────────────────────────────── */
.support-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.support-modal {
    background: var(--bg2);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 24px;
    width: 460px;
    max-width: calc(100vw - 32px);
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.support-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.support-modal-header h2 {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
}

.support-modal-close {
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}
.support-modal-close:hover { color: var(--text); }

.support-modal-hint {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
}

.support-modal-input {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: inherit;
    font-size: 13px;
    padding: 10px 13px;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
}
.support-modal-input:focus { border-color: var(--accent); }

.support-modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 4px;
}

.support-modal-cancel {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
}
.support-modal-cancel:hover { border-color: var(--border-light); color: var(--text); }

.support-modal-submit {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background: var(--accent-dim);
    color: var(--accent);
    font-family: inherit;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}
.support-modal-submit:hover:not(:disabled) { background: var(--accent); color: #fff; }
.support-modal-submit:disabled { opacity: 0.35; cursor: not-allowed; }