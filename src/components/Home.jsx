import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router'
import { addToPastes, updateToPastes, fetchPastes } from '../redux/pasteSlice';

const Home = () => {
  const dispatch = useDispatch();
  const loadedPasteIdRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const status = useSelector((state) => state.paste.status);
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);

  useEffect(() => {
    if (pasteId && allPastes.length && loadedPasteIdRef.current !== pasteId) {
      const paste = allPastes.find((p) => p._id === pasteId)
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
        setTags(paste.tags || []);
        setIsDirty(false);
        loadedPasteIdRef.current = pasteId;
      }
    }
  }, [pasteId, allPastes])

  useEffect(() => {
    if (!pasteId) {
      setTitle('');
      setValue('');
      setTags([]);
      setLastSaved(null);
      setIsDirty(false);
      loadedPasteIdRef.current = null;
    }
  }, [pasteId]);

  useEffect(() => {
    if (!pasteId) return;
    if (!isDirty) return;
    if (!title && !value) return;

    const timer = setTimeout(async () => {
      const result = await dispatch(updateToPastes({ _id: pasteId, title, content: value, tags, silent: true }));
      if (updateToPastes.fulfilled.match(result)) {
        setLastSaved(new Date());
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, value, tags]);

  function handleAddTag(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setIsDirty(true);
    }
    setTagInput('');
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  }

  function createPaste() {
    const paste = {
      title: title,
      content: value,
      tags: tags,
      _id: pasteId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    }

    if (pasteId) {
      dispatch(updateToPastes(paste));
    }
    else {
      dispatch(addToPastes(paste));
    }

    setTitle('');
    setValue('');
    setTags([]);
    setSearchParams({});
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      {pasteId && status === 'loading' && (
        <p className='text-graphite font-display text-sm mb-4'>Loading note...</p>
      )}
      <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
        <input
          className='flex-1 px-4 py-3 rounded-lg bg-paper text-ink placeholder-graphite font-display border border-transparent focus:border-brass focus:outline-none transition-colors'
          type="text"
          placeholder='enter title here'
          value={title}
          onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
        />

        <button
          className='px-5 py-3 rounded-lg bg-brass hover:bg-brass-dark text-ink font-display font-medium transition-colors whitespace-nowrap'
          onClick={createPaste}>
          {
            pasteId ? "update note" : "create note"
          }
        </button>

        {pasteId && lastSaved && (
          <p className='text-xs text-graphite mt-2'>
            Saved {lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, })}
          </p>
        )}

      </div>

      <div className='mt-4'>
        <input
          className='w-full px-4 py-2 rounded-lg bg-paper text-ink placeholder-graphite font-display border border-transparent focus:border-brass focus:outline-none transition-colors text-sm inline-48'
          type='text'
          placeholder='add tags, press enter'
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
        />
        {tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='flex items-center gap-1 px-2 py-1 rounded bg-ink-soft text-paper text-xs border border-brass-dark/30'
              >
                {tag}
                <button type='button' onClick={() => handleRemoveTag(tag)} className='text-graphite hover:text-rust'>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

      </div>

      <div>
        <button
          type='button'
          onClick={() => setShowGuide((prev) => !prev)}
          className='text-xs text-graphite hover:text-brass font-display uppercase tracking-wide mt-3 border border-brass-dark/50 rounded px-2'
        >
          {showGuide ? 'Hide markdown guide' : 'Markdown guide'}
        </button>

        {showGuide && (
          <div className='mt-2 rounded-lg bg-ink-soft border border-brass-dark/30 p-4 text-xs text-paper/80 font-mono-paste grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5'>
            <div><span className='text-brass'># </span>Heading 1</div>
            <div><span className='text-brass'>## </span>Heading 2</div>
            <div><span className='text-brass'>**bold**</span></div>
            <div><span className='text-brass'>*italics*</span></div>
            <div><span className='text-brass'>~~strikethrough~~</span></div>
            <div><span className='text-brass'>- item</span> — bullet list</div>
            <div><span className='text-brass'>1. item</span> — numbered list</div>
            <div><span className='text-brass'>{'- [ ] task'}</span> — checkbox</div>
            <div><span className='text-brass'>{'- [x] task'}</span> — checked box</div>
            <div><span className='text-brass'>{'> quote'}</span> — blockquote</div>
            <div><span className='text-brass'>---</span> — divider</div>
            <div><span className='text-brass'>`code`</span> — inline code</div>
            <div><span className='text-brass'>[text](url)</span> — link</div>
            <div className='sm:col-span-2'><span className='text-brass'>```</span> ... <span className='text-brass'>```</span> — multi-line code block (fences on their own line)</div>
            <div className='sm:col-span-2'><span className='text-brass'>| a | b |</span> then <span className='text-brass'>|---|---|</span> then rows — table</div>
          </div>
        )}
      </div>

      <div>
        <textarea
          className='w-full mt-6 rounded-lg p-5 bg-ink-soft text-paper font-mono-paste text-sm leading-relaxed border border-brass-dark/30 focus:border-brass focus:outline-none resize-none transition-colors min-h-[40vh] sm:min-h-[50vh]'
          value={value}
          placeholder='enter content here'
          onChange={(e) => { setValue(e.target.value); setIsDirty(true); }}
          autoCorrect='off'
          autoCapitalize='off'
          autoComplete='off'
          spellCheck='false'
        />
      </div>
    </div>
  )
}

export default Home
