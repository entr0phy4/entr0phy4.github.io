import { type Metadata } from 'next'
import Image from 'next/image'
import { Octokit } from 'octokit'

import { Border } from '@/components/Border'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { PageIntro } from '@/components/PageIntro'
import { formatDate } from '@/lib/formatDate'
import { RenderTags } from '@/lib/renderTags'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Changelog',
}

export default async function Changelog() {
  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
  })

  const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: 'entr0phy4',
    repo: 'entr0phy4.github.io',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
  })

  const commitsWithDetails = await Promise.all(
    commits.map(async (commit) => {
      const { data: details } = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
        owner: 'entr0phy4',
        repo: 'entr0phy4.github.io',
        ref: commit.sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        },
      })
      return details
    })
  )

  return (
    <>
      <PageIntro eyebrow="Changelog" title="Recent Changes & Updates">
        <p>Track the evolution of this website through its commit history—see how features and improvements have been added over time.</p>
      </PageIntro>

      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div>
          {commitsWithDetails.map((commit, index) => (
            <FadeIn key={index}>
              <article>
                <Border className="pt-16">
                  <div className="relative lg:-mx-4 lg:flex lg:justify-end">
                    <div className="pt-10 lg:w-2/3 lg:flex-none lg:px-4 lg:pt-0">
                      <p className="mt-6 max-w-2xl text-base text-neutral-600">
                        <RenderTags tags={[commit.commit?.message?.split(':')[0] || '']} />
                      </p>
                      <dl className="lg:absolute lg:top-0 lg:left-0 lg:w-1/3 lg:px-4">
                        <dt className="sr-only">Published</dt>
                        <dd className="absolute top-0 left-0 text-sm text-[#00ff00] lg:static">
                          <time dateTime={commit.commit?.author?.date?.split('T')[0]}>
                            {formatDate(commit.commit?.author?.date?.split('T')[0] || '')}
                          </time>
                        </dd>

                        <dt className="sr-only">Author</dt>
                        <dd className="mt-6 flex gap-x-4">
                          <div className="flex-none overflow-hidden rounded-xl bg-black">
                            <Image
                              alt=""
                              width={48}
                              height={48}
                              src={commit.committer?.avatar_url || ''}
                              className="h-12 w-12 object-cover grayscale"
                            />
                          </div>
                          <div className="mb-4 text-sm text-white">
                            <div className="font-semibold">
                              {commit.author?.login}
                            </div>
                            <div>{commit.commit?.author?.name}</div>
                          </div>
                        </dd>
                      </dl>
                      
                      <h2 className="font-display text-2xl font-semibold text-white">
                        <Link href={commit.html_url || ''}>{commit.commit?.message?.split(':')[1]}</Link>
                      </h2>

                      <div className="mt-4 text-sm text-neutral-400">
                          {commit.files?.[0]?.patch?.split('\n').map((line, i) => (
                            <div 
                              key={i} 
                              className={`font-mono text-sm py-0.5 ${
                                line.startsWith('+') 
                                  ? 'text-[#00ff00] bg-[#002200]' 
                                  : line.startsWith('-') 
                                    ? 'text-[#ff0000] bg-[#220000]'
                                    : 'text-neutral-400'
                              }`}
                            >
                              <code className="px-2">{line}</code>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Border>
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>

      {/* <ContactSection /> */}
    </>
  )
}
