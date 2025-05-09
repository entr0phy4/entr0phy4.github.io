import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import { SectionHeading } from '@/components/SectionHeading'
import { Section } from '@/lib/mdx'
import { Link } from './Link'

function renderSectionItems(section: Section, parentIndex: string) {
  return (
    <ol
      role="list"
      className="divide-y divide-neutral-600/30 rounded-2xl pl-6 py-3 text-base tracking-tight sm:pl-8 sm:py-7"
    >
      {section.child?.map(({ id, title, child }, index) => {
        const currentIndex = parentIndex ? `${parentIndex}.${index}` : `${index}`
        return (
          <li
            key={title}
            className="flex flex-col py-3"
            aria-label={`${title} on page ${index}`}
          >
            <div className="flex justify-between">
              <Link
                href={'#' + id}
                className="font-medium text-white"
                aria-hidden="true"
              >
                {title}
              </Link>
              <span
                className="font-mono text-[#00ff00]"
                aria-hidden="true"
              >
                {currentIndex}
              </span>
            </div>
            {child && (
              <div className="ml-6">
                {renderSectionItems({ id, title, child }, currentIndex)}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export function TableOfContents({
  description,
  sections,
}: {
  description: string
  sections: Section[]
}) {
  return (
    <section>
      <Container>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-white">
          Get a look at all of the content covered in this guide. Everything you
          need to know is inside.
        </p>
        <p className="mt-4 text-lg tracking-tight text-neutral-400">
          {description}
        </p>
        <Expandable>
          <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
            <ExpandableItems>
              {sections.map(
                (section, indexSection) =>
                  section.child && (
                    <li key={section.title}>
                      <h3 className="font-display text-3xl font-bold tracking-tight text-[#00ff00]">
                        {indexSection + '. ' + section.title}
                      </h3>
                      {renderSectionItems(section, indexSection.toString())}
                    </li>
                  ),
              )}
            </ExpandableItems>
          </ol>
          <ExpandableButton>See more</ExpandableButton>
        </Expandable>
      </Container>
    </section>
  )
}
