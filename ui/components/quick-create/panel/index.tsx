import {
  Bars3CenterLeftIcon,
  BookOpenIcon,
  NewspaperIcon,
  UsersIcon,
} from '@heroicons/react/16/solid'
import RecipeIcon from '@/components/ui/icons/recipe'
import { Block } from '@blocknote/core'
import { QuickCreateOptions } from '@/libs/utils/note'

type QuickCreatePanelProps = {
  onQuickCreate: (
    dom: Block[],
    focusId?: string,
    focusPlacement?: 'end' | 'start'
  ) => unknown
}

const QuickCreatePanel = ({ onQuickCreate }: QuickCreatePanelProps) => {
  return (
    <div className='animate-in slide-in-from-bottom no-scrollbar absolute inset-x-0 bottom-0 overflow-scroll flex items-center space-x-2 py-2 pl-3 pr-2'>
      <span className='text-sm text-zinc-500 shrink-0'>quick create:</span>
      {QuickCreateOptions.map((option) => (
        <QuickButton
          key={option.label}
          icon={option.icon}
          onClick={() =>
            onQuickCreate(option.dom, option.focusId, option.focusPlacement)
          }
        >
          {option.label}
        </QuickButton>
      ))}
      <QuickButton icon={<Bars3CenterLeftIcon className='h-4 text-zinc-500' />}>
        meeting notes
      </QuickButton>
      <QuickButton icon={<UsersIcon className='h-4 text-zinc-500' />}>
        1:1 notes
      </QuickButton>
      <QuickButton icon={<NewspaperIcon className='h-4 text-zinc-500' />}>
        project plan
      </QuickButton>
      <QuickButton icon={<RecipeIcon className='h-3 text-zinc-500' />}>
        recipe
      </QuickButton>
      <QuickButton icon={<BookOpenIcon className='h-4 text-zinc-500' />}>
        book recommendation
      </QuickButton>
    </div>
  )
}

const QuickButton = ({
  icon,
  children,
  onClick,
}: React.PropsWithChildren<{
  icon: React.ReactNode
  onClick?: () => unknown
}>) => {
  return (
    <button
      type='button'
      onClick={() => onClick?.()}
      className='inline-flex shrink-0 text-xs justify-center items-center space-x-1.5 rounded-full bg-zinc-900 px-2.5 py-1 font-semibold text-zinc-500 shadow-sm ring-1 ring-inset ring-zinc-800 hover:shadow hover:bg-zinc-950'
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default QuickCreatePanel
