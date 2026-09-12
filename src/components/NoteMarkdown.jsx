import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NoteMarkdown = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => <h1 className='text-xl font-display font-semibold mt-4 mb-2 first:mt-0'>{children}</h1>,
                h2: ({ children }) => <h2 className='text-lg font-display font-semibold mt-4 mb-2 first:mt-0'>{children}</h2>,
                h3: ({ children }) => <h3 className='text-base font-display font-semibold mt-3 mb-1 first:mt-0'>{children}</h3>,
                p: ({ children }) => <p className='mb-3 whitespace-pre-wrap'>{children}</p>,
                strong: ({ children }) => <strong className='font-semibold text-brass'>{children}</strong>,
                del: ({ children }) => <del className='text-graphite'>{children}</del>,
                ul: ({ children }) => <ul className='list-disc list-outside pl-5 mb-3 space-y-1'>{children}</ul>,
                ol: ({ children }) => <ol className='list-decimal list-outside pl-5 mb-3 space-y-1'>{children}</ol>,
                li: ({ children, className }) => {
                    if (className?.includes('task-list-item')) {
                        return (
                            <li className='list-none relative'>
                                {children}
                            </li>
                        );
                    }
                    return <li>{children}</li>;
                },
                input: ({ checked }) => (
                    <input
                        type='checkbox'
                        checked={checked}
                        disabled
                        className='accent-brass absolute -left-5 top-1'
                    />
                ),
                code: ({ children }) => <code className='bg-ink px-1.5 py-0.5 rounded text-brass text-xs'>{children}</code>,
                pre: ({ children }) => <pre className='bg-ink rounded-lg p-4 overflow-x-auto mb-3 text-xs'>{children}</pre>,
                blockquote: ({ children }) => (
                    <blockquote className='border-l-2 border-brass pl-4 italic text-paper/70 my-3'>{children}</blockquote>
                ),
                hr: () => <hr className='border-brass-dark/30 my-4' />,
                table: ({ children }) => <table className='w-full text-xs border-collapse mb-3'>{children}</table>,
                thead: ({ children }) => <thead className='border-b border-brass-dark/40'>{children}</thead>,
                th: ({ children }) => <th className='text-left px-2 py-1 font-display'>{children}</th>,
                td: ({ children }) => <td className='px-2 py-1 border-t border-brass-dark/20'>{children}</td>,
                a: ({ children, href }) => <a href={href} target='_blank' rel='noreferrer' className='text-brass underline hover:text-brass-dark'>{children}</a>,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default NoteMarkdown;
