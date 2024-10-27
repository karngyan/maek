const NotesListPendingPulse = ({ withHeader }: { withHeader?: boolean }) => {
  return (
    <div className='space-y-6'>
      {withHeader && (
        <div className='flex justify-between'>
          <div className='h-8 animate-pulse bg-zinc-800 w-2/12 rounded-lg'></div>
          <div className='h-8 animate-pulse bg-zinc-800 w-2/12 rounded-lg'></div>
        </div>
      )}
      <div className='space-y-4'>
        <div className='h-8 bg-zinc-800 rounded-lg animate-pulse'></div>
        <div className='h-8 bg-zinc-800 rounded-lg animate-pulse'></div>
        <div className='h-8 bg-zinc-800 rounded-lg animate-pulse'></div>
        <div className='h-8 bg-zinc-800 rounded-lg animate-pulse'></div>
        <div className='h-8 bg-zinc-800 rounded-lg animate-pulse'></div>
      </div>
    </div>
  )
}

export default NotesListPendingPulse
