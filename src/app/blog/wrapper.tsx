import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { MDXComponents } from '@/components/MDXComponents'
import { NavBar } from '@/components/NavBar'
import { PageLinks } from '@/components/PageLinks'
import { formatDate } from '@/lib/formatDate'
import {
  type Article,
  type MDXEntry,
  loadArticles,
  loadSections,
} from '@/lib/mdx'

export default async function BlogArticleWrapper({
  article,
  children,
}: {
  article: MDXEntry<Article>
  children: React.ReactNode
}) {
  let allArticles = await loadArticles()
  let allSections = await loadSections('CrossFit')
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
          </header>
        </FadeIn>

        <div className="h-11" />

        <NavBar sections={allSections} />

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
