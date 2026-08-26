import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { fetchPublicPaste } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const PublicPaste = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { publicPaste, publicStatus } = useSelector((state) => state.paste);

    useEffect(() => {
        dispatch(fetchPublicPaste(id));
    }, [dispatch, id]);

    if (publicStatus === 'loading') {
        return (
            <div className='max-w-3xl mx-auto px-6 py-10'>
                <p className='text-graphite font-display text-sm'>Loading...</p>
            </div>
        )
    }

    if (!publicPaste) {
        return (
            <div className='max-w-3xl mx-auto px-6 py-10'>
                <p className='text-graphite font-display text-sm'>This note isn't available — it may be private or no longer shared.</p>
            </div>
        )
    }

    return (
        <div className='max-w-3xl mx-auto px-6 py-10'>
            <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
                <input
                    className='flex-1 px-4 py-3 rounded-lg bg-paper text-ink font-display border border-transparent opacity-90'
                    type='text'
                    disabled
                    value={publicPaste.title}
                />
                <button
                    className='px-5 py-3 rounded-lg bg-brass hover:bg-brass-dark text-ink font-display font-medium transition-colors whitespace-nowrap'
                    onClick={() => {
                        navigator.clipboard.writeText(publicPaste.content);
                        toast.success('copied to clipboard');
                    }}
                >
                    Copy
                </button>
            </div>

            <textarea
                className='w-full mt-6 rounded-lg p-5 bg-ink-soft text-paper font-mono-paste text-sm leading-relaxed border border-brass-dark/30 resize-none'
                value={publicPaste.content}
                disabled
                rows={20}
            />
        </div>
    )
}

export default PublicPaste
