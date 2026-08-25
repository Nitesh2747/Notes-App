import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router'
import { addToPastes, updateToPastes, fetchPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

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
          onChange={(e) => (setTitle(e.target.value))}
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

      <div>
        <textarea
          className='w-full mt-6 rounded-lg p-5 bg-ink-soft text-paper font-mono-paste text-sm leading-relaxed border border-brass-dark/30 resize-none'
          value={paste.content}
          placeholder='enter content here'
          disabled
          onChange={(e) => setValue(e.target.value)}
          rows={20}
        />
      </div>
    </div>
  )
}

export default ViewPastes
