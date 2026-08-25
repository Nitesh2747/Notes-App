import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router'
import { addToPastes, updateToPastes, fetchPastes } from '../redux/pasteSlice';


const Home = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const allPastes = useSelector((state) => state.paste.pastes);

  useEffect(() => {
    dispatch(fetchPastes());
  }, [dispatch]);

  useEffect(() => {
    if (pasteId && allPastes.length) {
      const paste = allPastes.find((p) => p._id === pasteId)
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId, allPastes])


  function createPaste() {
    const paste = {
      title: title,
      content: value,
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
    setSearchParams({});
  }

  return (
    <div className='max-w-3xl mx-auto px-6 py-10'>
      <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
        <input
          className='flex-1 px-4 py-3 rounded-lg bg-paper text-ink placeholder-graphite font-display border border-transparent focus:border-brass focus:outline-none transition-colors'
          type="text"
          placeholder='enter title here'
          value={title}
          onChange={(e) => (setTitle(e.target.value))}
        />

        <button
          className='px-5 py-3 rounded-lg bg-brass hover:bg-brass-dark text-ink font-display font-medium transition-colors whitespace-nowrap'
          onClick={createPaste}>
          {
            pasteId ? "update note" : "create note"
          }
        </button>
      </div>

      <div>
        <textarea
          className='w-full mt-6 rounded-lg p-5 bg-ink-soft text-paper font-mono-paste text-sm leading-relaxed border border-brass-dark/30 focus:border-brass focus:outline-none resize-none transition-colors'
          value={value}
          placeholder='enter content here'
          onChange={(e) => setValue(e.target.value)}
          rows={20}
        />
      </div>
    </div>
  )
}

export default Home
