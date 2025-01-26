import { Theme, darkDefaultTheme } from '@blocknote/mantine'
import { monaSansGithub } from '@/fonts'

export const maekDarkTheme = {
  colors: {
    editor: {
      text: '#f4f4f5',
      background: '#18181b',
    },
    menu: {
      text: '#f4f4f5',
      background: '#18181b',
    },
    tooltip: {
      text: '#f4f4f5',
      background: '#09090b',
    },
    hovered: {
      text: '#f4f4f5',
      background: '#09090b',
    },
    selected: {
      text: '#f4f4f5',
      background: 'var(--color-primary-700)',
    },
    disabled: {
      text: '#52525b',
      background: '#09090b',
    },
    shadow: '#09090b',
    border: '#18181b',
    sideMenu: '#71717a',
    highlights: darkDefaultTheme.colors.highlights,
  },
  borderRadius: 6,
  fontFamily: monaSansGithub.style.fontFamily,
} satisfies Theme
