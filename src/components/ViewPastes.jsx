import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { fetchPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import NoteMarkdown from './NoteMarkdown';

const ViewPastes = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);
  const paste = allPastes.filter((p) => p._id === id)[0];


  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);


  if (!paste) {
    return (
      <div className='max-w-3xl mx-auto px-6 py-10'>
        <p className='text-graphite font-display text-sm'>Paste not found.</p>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
        <input
          className='flex-1 px-4 py-3 rounded-lg bg-paper text-ink font-display border border-transparent opacity-90'
          type="text"
          placeholder='enter title here'
          disabled
          value={paste.title}
        />

        <button
          className='px-5 py-3 rounded-lg bg-brass hover:bg-brass-dark text-ink font-display font-medium transition-colors whitespace-nowrap'
          onClick={() => {
            navigator.clipboard.writeText(paste?.content);
            toast.success("copied to clipboard");
          }}>
          Copy
        </button>
      </div>

      <div className='w-full mt-6 rounded-lg p-5 bg-ink-soft border border-brass-dark/30 text-paper font-mono-paste text-sm leading-relaxed'>
        <NoteMarkdown content={paste.content} />
      </div>
    </div>
  )
}

export default ViewPastes
