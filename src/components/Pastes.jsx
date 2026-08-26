import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromPastes, fetchPastes, updateToPastes, toggleShare } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router';

const Pastes = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [sharingPaste, setSharingPaste] = useState(null);
  const shareUrl = sharingPaste ? `${window.location.origin}/share/${sharingPaste._id}` : null;

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);

  const filteredData = pastes.filter((paste) => paste.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <input
        className='w-full sm:w-96 px-4 py-2.5 rounded-lg bg-ink-soft text-paper placeholder-graphite border border-brass-dark/30 focus:border-brass focus:outline-none transition-colors'
        type='search'
        placeholder='search here'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8'>
        {
          filteredData.length === 0 &&
          <p className='text-graphite font-display text-sm col-span-full'>No pastes yet. Go create one.</p>
        }
        {
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

                  <div className='flex flex-wrap items-center gap-3 mt-4 text-xs font-display uppercase tracking-wide'>
                    <button className='text-ink/70 hover:text-brass-dark'>
                      <NavLink to={`/?pasteId=${paste?._id}`}>Edit</NavLink>
                    </button>

                    <button className='text-ink/70 hover:text-brass-dark'>
                      <NavLink to={`/pastes/${paste?._id}`}>View</NavLink>
                    </button>

                    <button
                      onClick={() => handleDelete(paste?._id)}
                      className='text-rust hover:text-rust/70 ml-auto'
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paste?.content);
                        toast.success("copied to clipboard");
                      }}
                      className='text-ink/70 hover:text-brass-dark'
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => handleShare(paste)}
                      className='text-ink/70 hover:text-brass-dark'
                    >
                      Share
                    </button>
                  </div>

                  <p className='text-[12px] text-ink/70 mt-3 font-display'>
                    {dateFormat(paste.createdAt)}
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
