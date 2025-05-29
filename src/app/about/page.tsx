import { type Metadata } from 'next'
import Image from 'next/image'

import { Border } from '@/components/Border'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { GridList, GridListItem } from '@/components/GridList'
import { PageIntro } from '@/components/PageIntro'
import { SectionIntro } from '@/components/SectionIntro'
import { loadArticles } from '@/lib/mdx'

function Culture() {
  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro
        eyebrow="Culture"
        title="No balance, I just want to code."
        invert
      >
        <p>
          We are a group of like-minded people who share the same core values.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title="Loyalty" invert>
            Committed to technology, I don&lsquo;t know about you
          </GridListItem>
          {/* <GridListItem title="Trust" invert> */}
          {/*   We don’t care when our team works just as long as they are working */}
          {/*   every waking second. */}
          {/* </GridListItem> */}
          {/* <GridListItem title="Compassion" invert> */}
          {/*   You never know what someone is going through at home and we make */}
          {/*   sure to never find out. */}
          {/* </GridListItem> */}
        </GridList>
      </Container>
    </div>
  )
}

// const team = [
//   {
//     title: 'Leadership',
//     people: [
//       {
//         name: 'Leslie Alexander',
//         role: 'Co-Founder / CEO',
//         image: { src: imageLeslieAlexander },
//       },
//       {
//         name: 'Michael Foster',
//         role: 'Co-Founder / CTO',
//         image: { src: imageMichaelFoster },
//       },
//       {
//         name: 'Dries Vincent',
//         role: 'Partner & Business Relations',
//         image: { src: imageDriesVincent },
//       },
//     ],
//   },
//   {
//     title: 'Team',
//     people: [
//       {
//         name: 'Chelsea Hagon',
//         role: 'Senior Developer',
//         image: { src: imageChelseaHagon },
//       },
//       {
//         name: 'Emma Dorsey',
//         role: 'Senior Designer',
//         image: { src: imageEmmaDorsey },
//       },
//       {
//         name: 'Leonard Krasner',
//         role: 'VP, User Experience',
//         image: { src: imageLeonardKrasner },
//       },
//       {
//         name: 'Blake Reid',
//         role: 'Junior Copywriter',
//         image: { src: imageBlakeReid },
//       },
//       {
//         name: 'Kathryn Murphy',
//         role: 'VP, Human Resources',
//         image: { src: imageKathrynMurphy },
//       },
//       {
//         name: 'Whitney Francis',
//         role: 'Content Specialist',
//         image: { src: imageWhitneyFrancis },
//       },
//       {
//         name: 'Jeffrey Webb',
//         role: 'Account Coordinator',
//         image: { src: imageJeffreyWebb },
//       },
//       {
//         name: 'Benjamin Russel',
//         role: 'Senior Developer',
//         image: { src: imageBenjaminRussel },
//       },
//       {
//         name: 'Angela Fisher',
//         role: 'Front-end Developer',
//         image: { src: imageAngelaFisher },
//       },
//     ],
//   },
// ]

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We believe that our strength lies in our collaborative approach, which puts our clients at the center of everything we do.',
}

export default async function About() {
  let blogArticles = (await loadArticles()).slice(0, 2)

  return (
    <>
      <PageIntro
        eyebrow="About"
        title="Fascinated by the deep understanding of computers."
      >
        {/* <p>fascinated by the deep understanding of computers.</p> */}
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>
          Software Engineering student with more than 2 years of IT experience, oriented towards software development and process automation. He has a strong background in UNIX systems, programming and pipeline development (CI/CD) with a growing focus on cybersecurity. He has worked in environments requiring version control, automated testing, secrets management and secure deployments. Interested in areas such as offensive security, vulnerability analysis and DevSecOps.
          </p>
        </div>
      </PageIntro>

      {/* <Container className="mt-16">
        
          <StatListItem
            value="8 Bytes"
            label="can represent 256 different values."
          />
        </StatList>
      </Container> */}

      {/* <Culture /> */}

      {/* <Team /> */}

      {/* <PageLinks */}
      {/*   className="mt-24 sm:mt-32 lg:mt-40" */}
      {/*   title="From the blog" */}
      {/*   intro="Our team of experienced designers and developers has just one thing on their mind; working on your ideas to draw a smile on the face of your users worldwide. From conducting Brand Sprints to UX Design." */}
      {/*   pages={blogArticles} */}
      {/* /> */}

      {/* <ContactSection /> */}
    </>
  )
}
