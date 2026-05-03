import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    BoldIcon, ItalicIcon, HeadingIcon, ListIcon, OrderedListIcon,
    LinkIcon, CodeIcon, ImageIcon, VideoIcon, ChevronDownIcon, InfoIcon
} from './Icons';

const prismDarkPlusTheme: Record<string, React.CSSProperties> =
    vscDarkPlus as unknown as Record<string, React.CSSProperties>;

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    lang?: string;
    label?: string;
    uploadHandler?: (file: File) => Promise<string>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder,
    lang = 'en',
    label,
    uploadHandler
}) => {
    const { t } = useTranslation();
    const [isPreview, setIsPreview] = useState(false);
    const [isHeadingMenuOpen, setIsHeadingMenuOpen] = useState(false);
    const [headingLevel, setHeadingLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
    const [showGuide, setShowGuide] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const createdObjectUrls = useRef<string[]>([]);
    const headingMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
                setIsHeadingMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const applyMarkdown = (prefix: string, suffix: string, defaultText: string = '') => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selectedText = value.substring(start, end) || defaultText;

        const newValue =
            value.substring(0, start) +
            prefix + selectedText + suffix +
            value.substring(end);

        onChange(newValue);

        setTimeout(() => {
            el.focus();
            el.setSelectionRange(
                start + prefix.length,
                start + prefix.length + selectedText.length
            );
        }, 0);
    };

    const applyListFormatting = (isOrdered: boolean) => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selectedText = value.substring(start, end);

        if (!selectedText) {
            applyMarkdown(isOrdered ? '1. ' : '- ', '', isOrdered ? 'Item' : 'Item');
            return;
        }

        const lines = selectedText.split('\n');
        const formattedText = lines.map((line, index) => {
            const prefix = isOrdered ? `${index + 1}. ` : '- ';
            return prefix + line;
        }).join('\n');

        const newValue = value.substring(0, start) + formattedText + value.substring(end);
        onChange(newValue);

        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start, start + formattedText.length);
        }, 0);
    };

    const applyHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        applyMarkdown('#'.repeat(level) + ' ', '\n\n', `Heading ${level}`);
    };

    const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const handleFileUpload = async (file: File, isVideo = false) => {
        if (!file) return;
        try {
            let url: string;
            if (typeof (uploadHandler) === 'function') {
                url = await uploadHandler(file);
            } else {
                if (isVideo) {
                    url = URL.createObjectURL(file);
                    createdObjectUrls.current.push(url);
                } else {
                    // save image into sessionStorage and reference by id
                    const dataUrl = await readFileAsDataUrl(file);
                    const id = `wjd_upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                    try {
                        sessionStorage.setItem(id, JSON.stringify({ name: file.name, type: file.type, dataUrl }));
                        url = `session:${id}`;
                    } catch (err) {
                        // fallback to embedding data URL if sessionStorage fails
                        url = dataUrl;
                        console.warn('failed to save image to sessionStorage, falling back to data URL', err);
                    }
                }
            }

            if (isVideo) {
                const videoHtml = `<video controls width="100%">\n  <source src="${url}" type="${file.type}">\n</video>`;
                applyMarkdown(videoHtml, '', '');
            } else {
                // insert a session-referenced markdown image; preview will render filename only
                const el = textareaRef.current;
                const start = el ? el.selectionStart : value.length;
                const end = el ? el.selectionEnd : value.length;
                const insertion = url.startsWith('session:')
                    ? `![${file.name}](about:blank "${url}")`
                    : `![${file.name}](${url})`;
                const newValue = value.substring(0, start) + insertion + value.substring(end);
                onChange(newValue);
                setTimeout(() => {
                    if (!el) return;
                    el.focus();
                    const cursor = start + insertion.length;
                    el.setSelectionRange(cursor, cursor);
                }, 0);
            }
        } catch (err) {
            console.error('file upload failed', err);
        }
    };

    useEffect(() => {
        return () => {
            // cleanup created object URLs
            createdObjectUrls.current.forEach((u) => URL.revokeObjectURL(u));
            createdObjectUrls.current = [];
        };
    }, []);

    return (
        <div className="markdown-editor-wrapper">
            {/* Usage Guide */}
            <div className="editor-guide-header d-flex justify-content-between align-items-center mb-2">
                {label && <label className="form-label mb-0">{label}</label>}
                <button
                    type="button"
                    className={`guide-toggle-btn ${showGuide ? 'active' : ''}`}
                    onClick={() => setShowGuide(!showGuide)}
                >
                    <InfoIcon size={14} className="me-1" />
                    Markdown Guide
                </button>
            </div>

            {showGuide && (
                <div className="editor-guide-panel mb-3 p-3">
                    <div className="row g-3 small">
                        <div className="col-md-4">
                            <h6 className="text-gold mb-2">Basic</h6>
                            <ul className="list-unstyled text-muted mb-0">
                                <li><code>**Bold**</code> for bold</li>
                                <li><code>*Italic*</code> for italic</li>
                                <li><code># H1</code> to <code>###### H6</code></li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6 className="text-gold mb-2">Lists & Links</h6>
                            <ul className="list-unstyled text-muted mb-0">
                                <li><code>- Item</code> for bullets</li>
                                <li><code>1. Item</code> for numbers</li>
                                <li><code>[Text](URL)</code> for links</li>
                            </ul>
                        </div>
                        <div className="col-md-4">
                            <h6 className="text-gold mb-2">Media & Code</h6>
                            <ul className="list-unstyled text-muted mb-0">
                                <li><code>![Alt](URL)</code> for images</li>
                                <li>Fenced blocks for code</li>
                                <li>Video tags supported</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <div className="markdown-tabs">
                    <button
                        type="button"
                        className={`md-tab ${!isPreview ? 'active' : ''}`}
                        onClick={() => setIsPreview(false)}
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        className={`md-tab ${isPreview ? 'active' : ''}`}
                        onClick={() => setIsPreview(true)}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {!isPreview && (
                <div className="md-toolbar">
                    <button type="button" className="toolbar-btn" onClick={() => applyMarkdown('**', '**', 'bold text')} title="Bold">
                        <BoldIcon size={16} />
                    </button>
                    <button type="button" className="toolbar-btn" onClick={() => applyMarkdown('*', '*', 'italic text')} title="Italic">
                        <ItalicIcon size={16} />
                    </button>
                    <div className="toolbar-divider"></div>
                    <div className={`toolbar-heading-split ${isHeadingMenuOpen ? 'is-open' : ''}`} ref={headingMenuRef}>
                        <button
                            type="button"
                            className="toolbar-btn toolbar-heading-main"
                            onClick={() => applyHeading(headingLevel)}
                            title={`H${headingLevel}`}
                            style={{ width: 'auto', minWidth: '48px', padding: '0 8px' }}
                        >
                            <HeadingIcon level={headingLevel} />
                        </button>
                        <button
                            type="button"
                            className="toolbar-btn toolbar-heading-toggle"
                            onClick={() => setIsHeadingMenuOpen((open) => !open)}
                            title="Select heading level"
                        >
                            <ChevronDownIcon size={12} />
                        </button>
                        {isHeadingMenuOpen && (
                            <div className="toolbar-dropdown-menu">
                                {[1, 2, 3, 4, 5, 6].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        className={`toolbar-dropdown-item ${headingLevel === level ? 'is-active' : ''}`}
                                        onClick={() => {
                                            setHeadingLevel(level as 1 | 2 | 3 | 4 | 5 | 6);
                                            setIsHeadingMenuOpen(false);
                                        }}
                                    >
                                        <HeadingIcon level={level as 1 | 2 | 3 | 4 | 5 | 6} />
                                        <span>{'#'.repeat(level)}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="button" className="toolbar-btn" onClick={() => applyListFormatting(false)} title="Bullet List">
                        <ListIcon size={16} />
                    </button>
                    <button type="button" className="toolbar-btn" onClick={() => applyListFormatting(true)} title="Numbered List">
                        <OrderedListIcon size={16} />
                    </button>
                    <div className="toolbar-divider"></div>
                    <button type="button" className="toolbar-btn" onClick={() => applyMarkdown('[', '](url)', 'link text')} title="Link">
                        <LinkIcon size={16} />
                    </button>
                    <div className="toolbar-divider"></div>
                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => imageInputRef.current?.click()}
                        title="Image"
                    >
                        <ImageIcon size={16} />
                    </button>
                    <input
                        ref={imageInputRef}
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files && e.target.files[0];
                            if (f) handleFileUpload(f, false);
                            // reset so same file can be picked again
                            if (e.target) e.currentTarget.value = '';
                        }}
                    />

                    <button
                        type="button"
                        className="toolbar-btn"
                        onClick={() => videoInputRef.current?.click()}
                        title="Video"
                    >
                        <VideoIcon size={16} />
                    </button>
                    <input
                        ref={videoInputRef}
                        style={{ display: 'none' }}
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const f = e.target.files && e.target.files[0];
                            if (f) handleFileUpload(f, true);
                            if (e.target) e.currentTarget.value = '';
                        }}
                    />
                    <button type="button" className="toolbar-btn" onClick={() => applyMarkdown('```javascript\\n', '\\n```', 'console.log("hello");')} title="Code">
                        <CodeIcon size={16} />
                    </button>
                </div>
            )}

            {isPreview ? (
                <div className="markdown-preview glass-input w-100">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img({ src, alt, title, ...props }) {
                                // For session metadata or data sources, avoid loading the image and show filename with an icon
                                const sessionKey = typeof title === 'string' && title.startsWith('session:') ? title : '';
                                let imgDataUrl = '';
                                let name = alt || 'image';
                                if (sessionKey) {
                                    if (sessionKey) {
                                        const id = sessionKey.replace('session:', '');
                                        try {
                                            const raw = sessionStorage.getItem(id);
                                            if (raw) {
                                                const parsed = JSON.parse(raw);
                                                name = parsed.name || name;
                                                imgDataUrl = parsed.dataUrl || '';
                                            }
                                        } catch (e) {
                                            // ignore
                                            console.warn('failed to retrieve image info from sessionStorage', e);
                                        }
                                    }
                                    return <img src={imgDataUrl || (src as string)} alt={alt as string} {...props} />;
                                }
                                return (
                                    <span className="uploaded-filename d-inline-flex align-items-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2" aria-hidden>
                                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" fill="rgba(0,0,0,0.08)" />
                                            <path d="M7 13l3-4 5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        <span>{name}</span>
                                    </span>
                                );
                            },
                            code({ className, children, style: _style, ref: _ref, ...props }) {
                                void _style; void _ref;
                                const match = /language-(\w+)/.exec(className || '');
                                const isCodeBlock = className?.includes('language-') || String(children).includes('\\n');
                                return isCodeBlock ? (
                                    <SyntaxHighlighter
                                        style={prismDarkPlusTheme}
                                        language={match ? match[1] : 'text'}
                                        PreTag="div"
                                        showLineNumbers={true}
                                        wrapLongLines={true}
                                        codeTagProps={{
                                            style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>{children}</code>
                                );
                            }
                        }}
                    >
                        {value || "*Nothing to preview*"}
                    </ReactMarkdown>
                </div>
            ) : (
                <textarea
                    ref={textareaRef}
                    className="glass-input"
                    rows={10}
                    required
                    spellCheck={true}
                    lang={lang}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    title={t('contact.validation_required_message')}
                ></textarea>
            )}
        </div>
    );
};

export default MarkdownEditor;
