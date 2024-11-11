import { type Block } from '@blocknote/core'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import QuoteIcon from '@/components/ui/icons/quote'
import {
  Bars3CenterLeftIcon,
  NewspaperIcon,
  SunIcon,
  UsersIcon,
} from '@heroicons/react/16/solid'
import dayjs from 'dayjs'
import TodoIcon from '@/components/ui/icons/todo'

export const useQuickCreateOptions = (userName: string) => {
  return useQuery({
    queryFn: () => {
      return [
        quote(),
        dailyPlanner(),
        meetingNotes(),
        todoList(),
        oneOnOneNotes(userName),
        projectPlan(userName),
      ]
    },
    queryKey: ['quick-create-options', { userName }],
    staleTime: Infinity,
  })
}

export interface QuickCreateOption {
  label: string
  icon: React.ReactNode
  dom: Block[]
  focusOptions?: {
    id: string
    placement: 'start' | 'end'
  }
}

const projectPlan = (name: string): QuickCreateOption => {
  return {
    label: 'project plan',
    icon: <NewspaperIcon className='h-4 text-zinc-500' />,
    focusOptions: {
      id: '2e1b53d4-e33e-44d0-9354-8e2c77394fdc',
      placement: 'end',
    },
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Add a project title',
            type: 'text',
          },
        ],
        id: '2e1b53d4-e33e-44d0-9354-8e2c77394fdc',
        props: {
          backgroundColor: 'default',
          level: 2,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: `Status: Draft\nProject owner: ${name}\nStart date: ${dayjs().format('D MMMM YYYY')}\nEstimated end date: `,
            type: 'text',
          },
        ],
        id: '368ccff8-d94a-49dc-8437-b657da8e9740',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '30e62349-d68e-4660-9009-0c68e247c256',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Overview',
            type: 'text',
          },
        ],
        id: 'cd06f076-fc0a-428a-b1ab-9fba5df8e9b8',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {
              italic: true,
            },
            text: 'Background on the project and links to relevant material',
            type: 'text',
          },
        ],
        id: '7a23bd33-adc5-47dc-b636-dbc9479626a4',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '2c6fbf33-99e1-4b14-ae72-8ef86caefc34',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
      {
        children: [],
        content: [],
        id: '8fdb7fb1-592d-4e95-af30-f20a36de6f07',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Team Members',
            type: 'text',
          },
        ],
        id: '0cf3745b-bf22-44b3-96d9-0d28283a1a9b',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {
              italic: true,
            },
            text: 'The people bringing this project to life',
            type: 'text',
          },
        ],
        id: '93e318ea-4b8d-49d8-be5c-7d6e7c27710c',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '386f7f85-87f4-4974-b500-f9cc4a3c7bed',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
      {
        children: [],
        content: [],
        id: '1182a0ef-c3d6-4097-a463-d77cd4def250',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Goals',
            type: 'text',
          },
        ],
        id: '13bc833e-d937-4d3a-9b52-14fef9a32b2f',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {
              italic: true,
            },
            text: 'These are the measurable objectives of the project',
            type: 'text',
          },
        ],
        id: 'e7535fea-a6c0-43a1-b8fe-a5ec104a8cd7',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '94f8d481-e5e2-4b3e-8e55-8c29fa306cd4',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'numberedListItem',
      },
      {
        children: [],
        content: [],
        id: 'a4535394-44a0-42b9-81a5-dc0382f73a75',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Non-goals',
            type: 'text',
          },
        ],
        id: 'dce48747-41e1-4c6e-a0b9-07eb45c078a7',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: "These are the things we're explicitly not optimizing for",
            type: 'text',
          },
        ],
        id: '7285c1dd-c0e4-40ad-bbda-64e970a471a3',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '171f4d74-83af-4d24-82b3-1301072482fe',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'numberedListItem',
      },
      {
        children: [],
        content: [],
        id: '827c101c-0538-44de-a9ca-a7472e33da5e',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Milestones',
            type: 'text',
          },
        ],
        id: '1004868e-bd7b-48ea-8518-d3180842a3cf',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {
              italic: true,
            },
            text: 'These are the key milestones (with target dates) for the project',
            type: 'text',
          },
        ],
        id: '5949af4e-b5ce-4371-a6ed-83032d177122',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '175ee873-6437-49bd-8b51-74b8be0cdf35',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'numberedListItem',
      },
      {
        children: [],
        content: [],
        id: '7dcd4146-7aa2-4eb1-b79a-18818aa0e820',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Risks & Mitigations',
            type: 'text',
          },
        ],
        id: '1276bd0d-0490-4c8a-b915-bc00b436a5c0',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {
              italic: true,
            },
            text: 'These are the key risks and their proposed mitigation strategies',
            type: 'text',
          },
        ],
        id: 'ee71adb8-c6f5-4c19-aa1d-d5cb214ea7c6',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '7196d71c-055d-4f71-9a22-84ccc2b3b5a8',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'numberedListItem',
      },
      {
        children: [],
        content: [],
        id: 'a632275d-b178-451a-a911-3221a35f9a12',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '10bdb3e2-1e80-4151-b6b4-4a2ce7e72c67',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: 'c9566451-ee89-417c-be10-8a3738a92ff0',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '7e574967-6bc6-4cb9-8042-5180596a727f',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
    ],
  }
}

const oneOnOneNotes = (name: string): QuickCreateOption => {
  const firstName = name.split(' ')[0]

  return {
    label: '1:1 notes',
    icon: <UsersIcon className='h-4 text-zinc-500' />,
    focusOptions: {
      id: '863c8092-65ca-470d-92df-32d09709289c',
      placement: 'start',
    },
    dom: [
      {
        id: '863c8092-65ca-470d-92df-32d09709289c',
        children: [],
        content: [
          {
            styles: {},
            text: ` / ${firstName} 1:1 - 27 October 2024`,
            type: 'text',
          },
        ],
        props: {
          backgroundColor: 'default',
          level: 2,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '843f359f-e78b-432f-a712-2838c70c023b',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Next Steps',
            type: 'text',
          },
        ],
        id: '89761b28-84a7-47bd-bb8d-5f01a8adf1b8',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '29e56a8d-6a3c-4aa6-911f-74162aa05ce1',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
      {
        children: [],
        content: [],
        id: 'a5613f51-464c-479d-8dfe-d9eac7402e79',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Agenda',
            type: 'text',
          },
        ],
        id: 'e3ee230f-4552-4b16-907c-25a8fe72d60a',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '4b9c85ac-c3a3-4c08-ac54-7fdcaf702199',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
      {
        children: [],
        content: [],
        id: '04dee639-e148-4e8b-b716-c01307335e8e',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
    ],
  }
}

const todoList = (): QuickCreateOption => {
  return {
    label: 'to-do list',
    icon: <TodoIcon className='h-3 text-zinc-500' />,
    focusOptions: {
      id: '8320befb-c3a4-4164-b0b3-b7732b0f2ff1',
      placement: 'end',
    },
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: `My Tasks - ${dayjs().format('D MMMM YYYY')}`,
            type: 'text',
          },
        ],
        id: '0f14e78c-7e45-4de8-ba79-42309a4244de',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '8320befb-c3a4-4164-b0b3-b7732b0f2ff1',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
    ],
  }
}

const meetingNotes = (): QuickCreateOption => {
  return {
    label: 'meeting notes',
    icon: <Bars3CenterLeftIcon className='h-4 text-zinc-500' />,
    focusOptions: {
      id: 'c54616f5-7b49-44ae-9051-908cf34ffc70',
      placement: 'start',
    },
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: ` - ${dayjs().format('D MMMM YYYY')}`,
            type: 'text',
          },
        ],
        id: 'c54616f5-7b49-44ae-9051-908cf34ffc70',
        props: {
          backgroundColor: 'default',
          level: 2,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Attendees: ',
            type: 'text',
          },
        ],
        id: '0ed01ac4-87a8-4a65-9dec-9456545faf84',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '99e1618e-699a-400a-b0e6-4e0c4d8a53b5',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Next Steps',
            type: 'text',
          },
        ],
        id: '74ad8a46-e5aa-4f88-bc69-23dbc31def27',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: '9f0cfa83-8d4e-41b2-afc6-c50ec86d7b6c',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
      {
        children: [],
        content: [],
        id: 'c98ba6ea-d368-4bba-a922-887ddf1029a9',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Agenda',
            type: 'text',
          },
        ],
        id: '374f6ce1-446b-4725-8cbd-71589dbcdde0',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [],
        id: 'de2182c9-1262-4c56-ab99-311805ac9569',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
    ],
  }
}

const dailyPlanner = (): QuickCreateOption => {
  return {
    label: 'daily planner',
    icon: <SunIcon className='h-4 text-zinc-500' />,
    focusOptions: {
      id: 'b94d5453-cf0c-4d0b-95e3-1e767fc3c7dd',
      placement: 'end',
    },
    dom: [
      {
        children: [],
        content: [
          {
            styles: {},
            text: `${dayjs().format('D MMMM YYYY')} Plan`,
            type: 'text',
          },
        ],
        id: '',
        props: {
          backgroundColor: 'default',
          level: 3,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'heading',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'My tasks',
            type: 'text',
          },
        ],
        id: '0f2d73e4-34a9-4825-b035-cdc2457fc348',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '124ce4ab-52aa-46cd-9f75-ef10820b28d1',
        props: {
          backgroundColor: 'default',
          checked: false,
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'checkListItem',
      },
      {
        children: [],
        content: [],
        id: '419c5544-7ff9-466d-a185-7e0235917f22',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'Schedule',
            type: 'text',
          },
        ],
        id: 'a818aafa-e70d-4bb4-b423-63a5377a921f',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: 'b94d5453-cf0c-4d0b-95e3-1e767fc3c7dd',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'bulletListItem',
      },
    ],
  }
}

const quote = (): QuickCreateOption => {
  return {
    label: 'quote',
    icon: <QuoteIcon className='h-3 text-zinc-500' />,
    focusOptions: {
      id: '04df564a-47c9-490c-ac8d-297d3556d4dd',
      placement: 'end',
    },
    dom: [
      {
        children: [
          {
            children: [],
            content: [
              {
                styles: {},
                text: 'Add a quote',
                type: 'text',
              },
            ],
            id: '04df564a-47c9-490c-ac8d-297d3556d4dd',
            props: {
              backgroundColor: 'default',
              textAlignment: 'left',
              textColor: 'default',
            },
            type: 'paragraph',
          },
        ],
        content: [],
        id: 'ae92379d-c15a-473f-8042-745f8f20ff91',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '9dd202e0-7059-484e-b4de-2802e62c5b05',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'author: ',
            type: 'text',
          },
        ],
        id: '99a4002c-780d-49aa-9871-2fcfeafeed17',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [
          {
            styles: {},
            text: 'source: ',
            type: 'text',
          },
        ],
        id: '20cc9623-6e3b-4eb9-843e-62a0f3197582',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
      {
        children: [],
        content: [],
        id: '397772ba-4fa0-485e-b980-0cce87c6478a',
        props: {
          backgroundColor: 'default',
          textAlignment: 'left',
          textColor: 'default',
        },
        type: 'paragraph',
      },
    ],
  }
}
