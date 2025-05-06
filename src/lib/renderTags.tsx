import { Badge, colors, Colors } from '@/components/Badge'

export function RenderTags({ tags }: { tags: string[] }) {
  const getRandomColorClass = (): Colors => {
    const colorKeys = Object.keys(colors)
    const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)]
    return randomKey as Colors
  }

  return tags.map((tag, index) => (
    <span className="text-white" key={index}>
      <Badge color={getRandomColorClass()}>{tag}</Badge>
    </span>
  ))
}
