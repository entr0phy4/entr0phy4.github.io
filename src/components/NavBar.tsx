'use client'

import { useEffect, useRef, useState } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'
import { FadeIn } from './FadeIn'
import { Section } from '@/lib/mdx'

function MenuIcon({
  open,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  open: boolean
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d={open ? 'M17 7 7 17M7 7l10 10' : 'm15 16-3 3-3-3M15 8l-3-3-3 3'}
      />
    </svg>
  )
}

interface Props {
  sections: Section[]
}

export function NavBar({ sections }: Props) {
  let navBarRef = useRef<React.ElementRef<'div'>>(null)
  let [activeIndex, setActiveIndex] = useState<number | null>(null)
  let mobileActiveIndex = activeIndex === null ? 0 : activeIndex

  useEffect(() => {
    function updateActiveIndex() {
      if (!navBarRef.current) {
        return
      }

      let newActiveIndex = null
      let elements = sections
        .map(({ id }) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
      let bodyRect = document.body.getBoundingClientRect()
      let offset = bodyRect.top + navBarRef.current.offsetHeight + 1

      if (window.scrollY >= Math.floor(bodyRect.height) - window.innerHeight) {
        setActiveIndex(sections.length - 1)
        return
      }

      for (let index = 0; index < elements.length; index++) {
        if (
          window.scrollY >=
          elements[index].getBoundingClientRect().top - offset
        ) {
          newActiveIndex = index
        } else {
          break
        }
      }

      setActiveIndex(newActiveIndex)
    }

    updateActiveIndex()

    window.addEventListener('resize', updateActiveIndex)
    window.addEventListener('scroll', updateActiveIndex, { passive: true })

    return () => {
      window.removeEventListener('resize', updateActiveIndex)
      window.removeEventListener('scroll', updateActiveIndex)
    }
  }, [sections])

  return (
    <div ref={navBarRef} className="sticky top-0 z-50">
      <Popover className="sm:hidden">
        {({ open }) => (
          <>
            <FadeIn>
              <div
                className={clsx(
                  'relative flex items-center px-4 py-3',
                  !open &&
                    'bg-white/95 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-black/30 [@supports(backdrop-filter:blur(0))]:backdrop-blur-sm',
                )}
              >
                {!open && (
                  <>
                    <span
                      aria-hidden="true"
                      className="font-mono text-sm text-[#00ff00]"
                    >
                      {(mobileActiveIndex).toString().padStart(2, '0')}
                    </span>
                    <span className="ml-4 text-base font-medium text-white">
                      {sections[mobileActiveIndex].title}
                    </span>
                  </>
                )}
                <PopoverButton
                  className={clsx(
                    '-mr-1 ml-auto flex h-8 w-8 items-center justify-center',
                    open && 'relative z-10',
                  )}
                  aria-label="Toggle navigation menu"
                >
                  {!open && (
                    <>
                      {/* Increase hit area */}
                      <span className="absolute inset-0" />
                    </>
                  )}
                  <MenuIcon open={open} className="h-6 w-6 stroke-[#00ff00]" />
                </PopoverButton>
              </div>
            </FadeIn>
            <PopoverPanel className="absolute inset-x-0 top-0 left-0 py-3.5 shadow-sm [@supports(backdrop-filter:blur(0))]:bg-black/30 [@supports(backdrop-filter:blur(0))]:backdrop-blur-sm">
              {sections.map((section, sectionIndex) => (
                <PopoverButton
                  as="a"
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center px-4 py-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm text-white"
                  >
                    {(sectionIndex).toString().padStart(2, '0')}
                  </span>
                  <span className="ml-4 text-base font-medium text-neutral-500">
                    {section.title}
                  </span>
                </PopoverButton>
              ))}
            </PopoverPanel>
            <div className="absolute inset-x-0 bottom-full z-10 h-4" />
          </>
        )}
      </Popover>
      <FadeIn>
        <div className="hidden shadow-sm sm:flex sm:h-32 sm:justify-center sm:border-b sm:border-white/10 sm:shadow-white/5 sm:[@supports(backdrop-filter:blur(0))]:bg-transparent sm:[@supports(backdrop-filter:blur(0))]:backdrop-blur-sm">
          <ol
            role="list"
            className="mb-[-2px] grid auto-cols-[minmax(0,15rem)] grid-flow-col text-base font-medium text-white [counter-reset:section_-1]"
          >
            {sections.map((section, sectionIndex) => (
              <li key={section.id} className="flex [counter-increment:section]">
                <a
                  href={`#${section.id}`}
                  className={clsx(
                    'flex w-full flex-col text-center items-center justify-center border-b-2 before:mb-2 before:font-mono before:text-sm before:content-[counter(section,decimal-leading-zero)]',
                    sectionIndex === activeIndex
                      ? 'border-[#00ff00] bg-black/30 text-[#00ff00] before:text-[#00ff00]'
                      : 'border-transparent before:text-neutral-500 hover:bg-white/5 hover:before:text-[#00ff00]',
                  )}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>
    </div>
  )
}
