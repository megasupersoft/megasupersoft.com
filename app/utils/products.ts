export interface Product {
  name: string
  slug: string
  repo: string // owner/repo
  website?: string
  color: string
  icon: string // material symbol
  type: 'software' | 'game'
  released: boolean
  description: string
}

export const products: Product[] = [
  {
    name: 'FFFFinance',
    slug: 'ffffinance',
    repo: 'DangerDrome/FFFFinance_app',
    website: 'https://ffffinance.org',
    color: '#00d4aa',
    icon: 'account_balance',
    type: 'software',
    released: true,
    description: 'Local-first personal finance for New Zealand',
  },
  {
    name: 'OpenComp',
    slug: 'opencomp',
    repo: 'megasupersoft/OpenComp',
    color: '#5a7a96',
    icon: 'layers',
    type: 'software',
    released: false,
    description: 'Open-source image compositor for VFX artists',
  },
  {
    name: 'NodeUI',
    slug: 'nodeui',
    repo: 'megasupersoft/NodeUI',
    color: '#5a7a96',
    icon: 'hub',
    type: 'software',
    released: false,
    description: 'Multimedia canvas for creative work',
  },
  {
    name: 'FileUI',
    slug: 'fileui',
    repo: 'megasupersoft/FileUI',
    color: '#5a7a96',
    icon: 'folder_open',
    type: 'software',
    released: false,
    description: 'Cross-platform file browser for artists',
  },
  {
    name: 'Vampire Runners',
    slug: 'vampire-runners',
    repo: 'megasupersoft/VampireRunners',
    color: '#7ab89e',
    icon: 'sprint',
    type: 'game',
    released: false,
    description: '2D roguelike arcade game',
  },
  {
    name: 'Renegade Cop',
    slug: 'renegade-cop',
    repo: 'megasupersoft/RenegadeCop',
    color: '#7ab89e',
    icon: 'local_police',
    type: 'game',
    released: false,
    description: '3D single-player adventure RPG',
  },
  {
    name: 'NeverEverland',
    slug: 'nevereverland',
    repo: 'megasupersoft/NeverEverland',
    color: '#7ab89e',
    icon: 'explore',
    type: 'game',
    released: false,
    description: 'Isometric Zelda-like adventure',
  },
]

export const releasedProducts = products.filter((p) => p.released)
export const softwareProducts = products.filter((p) => p.type === 'software')
export const gameProducts = products.filter((p) => p.type === 'game')
