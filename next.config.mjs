import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import nextMDX from '@next/mdx'
import { Parser } from 'acorn'
import jsx from 'acorn-jsx'
import escapeStringRegexp from 'escape-string-regexp'
import * as path from 'path'
import { recmaImportImages } from 'recma-import-images'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkGfm from 'remark-gfm'
import { remarkRehypeWrap } from 'remark-rehype-wrap'
import { createCssVariablesTheme, createHighlighter } from 'shiki'
import { unifiedConditional } from 'unified-conditional'
import { recmaPlugins } from './src/mdx/recma.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
}

function remarkMDXLayout(source, props = {}) {
  let parser = Parser.extend(jsx())
  let parseOptions = { ecmaVersion: 'latest', sourceType: 'module' }

  return (tree) => {
    let imp = `import _Layout from '${source}'`

    let propsString = Object.entries(props)
      .map(([key, value]) => `${key}={${value}}`)
      .join(' ')

    let exp = `export default function Layout(props) {
      return <_Layout {...props} ${propsString} />
    }`

    tree.children.push(
      {
        type: 'mdxjsEsm',
        value: imp,
        data: { estree: parser.parse(imp, parseOptions) },
      },
      {
        type: 'mdxjsEsm',
        value: exp,
        data: { estree: parser.parse(exp, parseOptions) },
      },
    )
  }
}

export default async function config() {
  const cssVariablesTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    fontStyle: true,
  })

  const highlighter = await createHighlighter({
    themes: [cssVariablesTheme],
    langs: ['bash', 'css', 'html', 'javascript', 'json', 'markdown', 'shell', 'typescript'],
  })

  let withMDX = nextMDX({
    extension: /\.mdx$/,
    options: {
      recmaPlugins: [recmaImportImages, recmaPlugins],
      rehypePlugins: [
        [rehypeShikiFromHighlighter, highlighter, { theme: 'css-variables' }],
        rehypeUnwrapImages,
        [
          remarkRehypeWrap,
          {
            node: { type: 'mdxJsxFlowElement', name: 'Typography' },
            start: ':root > :not(mdxJsxFlowElement)',
            end: ':root > mdxJsxFlowElement',
          },
        ],
      ],
      remarkPlugins: [
        remarkGfm,
        remarkPlugins,
        [
          unifiedConditional,
          [
            new RegExp(`^${escapeStringRegexp(path.resolve('src/app/blog'))}`),
            [
              [
                remarkMDXLayout,
                '@/app/blog/wrapper',
                { article: 'article', sections: 'sections' },
              ],
            ],
          ],
          [
            new RegExp(`^${escapeStringRegexp(path.resolve('src/app/work'))}`),
            [[remarkMDXLayout, '@/app/work/wrapper', 'caseStudy']],
          ],
        ],
      ],
    },
  })

  return withMDX(nextConfig)
}
