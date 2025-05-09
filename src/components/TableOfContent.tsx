import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import { SectionHeading } from '@/components/SectionHeading'
import { Section } from '@/lib/mdx'
import { Link } from './Link'

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
                      <ol
                        role="list"
                        className="mt-8 divide-y divide-neutral-600/30 rounded-2xl px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7"
                      >
                        {section.child.map(({ id, title }, index) => (
                          <li
                            key={title}
                            className="flex justify-between py-3"
                            aria-label={`${title} on page ${index}`}
                          >
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
                              {indexSection + '.' + index}
                            </span>
                          </li>
                        ))}
                      </ol>
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
