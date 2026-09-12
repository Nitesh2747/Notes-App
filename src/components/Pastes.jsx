import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromPastes, fetchPastes, updateToPastes, toggleShare } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router';

const Pastes = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const status = useSelector((state) => state.paste.status);
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [sharingPaste, setSharingPaste] = useState(null);
  const shareUrl = sharingPaste ? `${window.location.origin}/share/${sharingPaste._id}` : null;
  const allTags = [...new Set(pastes.flatMap((p) => p.tags || []))];

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);

  const filteredData = pastes
    .filter((paste) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        paste.title.toLowerCase().includes(term) ||
        paste.content.toLowerCase().includes(term);
      const matchesTag = !activeTag || (paste.tags && paste.tags.includes(activeTag));
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      return 0;
    });

  function handleDelete(pasteId) {
    dispatch(removeFromPastes(pasteId));
  }

  async function handleShare(paste) {
    if (paste.isPublic) {
      setSharingPaste(paste);
      return;
    }
    const result = await dispatch(toggleShare({ pasteId: paste._id, isPublic: true }));
    if (toggleShare.fulfilled.match(result)) {
      setSharingPaste(result.payload);
    }
  }

  async function handleStopSharing() {
    const result = await dispatch(toggleShare({ pasteId: sharingPaste._id, isPublic: false }));
    if (toggleShare.fulfilled.match(result)) {
      setSharingPaste(null);
    }
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(shareUrl);
    toast.success("link copied to clipboard");
  }

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: 'y', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count}${interval.label} ago`;
    }

    return 'just now';
  }

  function dateFormat(date) {
    const formatted = new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return formatted;
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-10'>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className='w-full sm:w-96 px-4 py-2.5 rounded-lg bg-ink-soft text-paper placeholder-graphite border border-brass-dark/30 focus:border-brass focus:outline-none transition-colors'
          type='search'
          placeholder='search title or content'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className='px-3 py-2 rounded-lg bg-ink-soft text-paper text-sm border border-brass-dark/30 focus:border-brass focus:outline-none'
        >
          <option value='newest'>Newest first</option>
          <option value='oldest'>Oldest first</option>
          <option value='az'>Title A–Z</option>
          <option value='za'>Title Z–A</option>
        </select>
      </div>

      {allTags.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-4'>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wide transition-colors ${activeTag === tag
                ? 'bg-brass text-ink'
                : 'bg-ink-soft text-graphite border border-brass-dark/30 hover:text-paper'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8'>
        {status === 'loading' && (
          <div className='col-span-full flex justify-center py-10'>
            <div className='w-6 h-6 border-2 border-brass border-t-transparent rounded-full animate-spin' />
          </div>
        )}

        {status === 'succeeded' && filteredData.length === 0 && (
          <p className='text-graphite font-display text-sm col-span-full'>No pastes yet. Go create one.</p>
        )}

        {status !== 'loading' &&
          filteredData.map(
            (paste) => {
              return (
                <div
                  key={paste?._id}
                  className='relative bg-paper rounded-lg pl-6 pr-5 py-5 overflow-hidden shadow-sm hover:-translate-y-0.5 transition-transform'
                >
                  <span className='absolute left-0 top-0 h-full w-1.5 bg-brass' />

                  <h3 className='font-display font-semibold text-ink truncate pr-2'>
                    {paste.title || "Untitled"}
                  </h3>

                  <p className='font-mono-paste text-xs text-ink/70 mt-2 line-clamp-3 whitespace-pre-wrap'>
                    {paste.content}
                  </p>

                  {paste.tags && paste.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-3'>
                      {paste.tags.map((tag) => (
                        <span
                          key={tag}
                          className='py-0.5 rounded bg-amber-200 text-black font-bold text-[11px] border border-brass-dark px-2'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='flex flex-wrap items-center gap-3 mt-4 text-xs font-display uppercase tracking-wide'>
                    <button className='text-ink hover:text-brass-dark border border-brass-dark/30 rounded px-1.5'>
                      <NavLink to={`/?pasteId=${paste?._id}`}>Edit</NavLink>
                    </button>

                    <button className='text-ink hover:text-brass-dark border border-brass-dark/30 rounded px-1.5'>
                      <NavLink to={`/pastes/${paste?._id}`}>View</NavLink>
                    </button>

                    <button
                      onClick={() => handleDelete(paste?._id)}
                      className='text-rust hover:text-rust/70 ml-auto border border-brass-dark/30 rounded px-1.5'
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paste?.content);
                        toast.success("copied to clipboard");
                      }}
                      className='text-ink hover:text-brass-dark border border-brass-dark/30 rounded px-1.5'
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => handleShare(paste)}
                      className='text-ink hover:text-brass-dark border border-brass-dark/30 rounded px-1.5'
                    >
                      Share
                    </button>
                  </div>

                  <p className='text-[12px] text-ink mt-3 font-display'>
                    Created: {dateFormat(paste.createdAt)}
                  </p>
                  <p className='text-[12px] text-ink mt-3 font-display'>
                    Edited: {timeAgo(paste.updatedAt)}
                  </p>
                </div>
              )
            }
          )
        }
      </div>

      {
        shareUrl &&
        <div
          className='fixed inset-0 bg-ink/80 flex items-center justify-center px-6 z-20'
          onClick={() => setSharingPaste(null)}
        >
          <div
            className='bg-paper rounded-lg p-6 w-full max-w-md'
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className='font-display font-semibold text-ink'>Share this Note</h4>
            <p className='text-xs text-ink/60 mt-1 font-display'>
              Anyone with this link can open it on this device.
            </p>

            <div className='flex gap-2 mt-4'>
              <input
                className='flex-1 px-3 py-2 rounded-lg bg-ink-soft text-paper font-mono-paste text-xs border border-brass-dark/30 outline-none'
                type='text'
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copyShareUrl}
                className='px-4 py-2 rounded-lg bg-brass hover:bg-brass-dark text-ink font-display text-sm font-medium whitespace-nowrap'
              >
                Copy
              </button>
            </div>

            <button
              onClick={handleStopSharing}
              className='mt-4 text-xs text-rust hover:text-rust/70 font-display uppercase tracking-wide mr-4'
            >
              Stop Sharing
            </button>
            <button
              onClick={() => setSharingPaste(null)}
              className='mt-4 text-xs text-ink/50 hover:text-ink font-display uppercase tracking-wide'
            >
              Close
            </button>

          </div>
        </div>
      }
    </div>
  )
}

export default Pastes
