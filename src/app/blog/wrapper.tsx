import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MDXComponents } from '@/components/MDXComponents'
import { NavBar } from '@/components/NavBar'
import { PageLinks } from '@/components/PageLinks'
import { formatDate } from '@/lib/formatDate'
import {
  type Article,
  type Section,
  type MDXEntry,
  loadArticles,
} from '@/lib/mdx'
import { RenderTags } from '@/lib/renderTags'

export default async function BlogArticleWrapper({
  article,
  sections,
  children,
}: {
  article: MDXEntry<Article>
  sections: MDXEntry<Section[]>
  children: React.ReactNode
}) {
  let allArticles = await loadArticles()
  let moreArticles = allArticles
    .filter(({ metadata }) => metadata !== article)
    .slice(0, 2)

  return (
    <>
      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <header className="mx-auto flex max-w-5xl flex-col text-center">
            <h1 className="mt-6 font-display text-5xl font-medium tracking-tight [text-wrap:balance] text-[#00ff00] sm:text-6xl">
              {article.title}
            </h1>
            <time
              dateTime={article.date}
              className="order-first text-sm text-white"
            >
              {formatDate(article.date)}
            </time>
            <p className="mt-6 text-sm font-semibold text-white">
              by {article.author.name}, {article.author.role}
            </p>
            <dd className="mt-2">
              <RenderTags tags={article.tags} />
            </dd>
          </header>
        </FadeIn>
      </Container>

      <div className="h-11" />

      <NavBar sections={sections} />

      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn>
          <MDXComponents.wrapper className="mt-24 sm:mt-32 lg:mt-40">
            {children}
          </MDXComponents.wrapper>
        </FadeIn>
      </Container>

      {moreArticles.length > 0 && (
        <PageLinks
          className="mt-24 sm:mt-32 lg:mt-40"
          title="More articles"
          pages={moreArticles}
        />
      )}

      {/* <ContactSection /> */}
    </>
  )
}
