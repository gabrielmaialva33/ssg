import { hideLoader } from './loader'

const sections = Array.from(document.querySelectorAll<HTMLElement>('section'))
let previousSection = 'main'

export function switchSection(id?: string) {
  id = id ?? previousSection

  for (const section of sections) {
    if (section.id === `S${id}`) {
      section.style.display = ''
    } else {
      section.style.display = 'none'
    }
  }

  if (id !== 'error') {
    previousSection = id
  }

  return hideLoader()
}
