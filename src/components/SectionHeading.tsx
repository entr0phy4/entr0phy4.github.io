import clsx from 'clsx'

export function SectionHeading({
  number,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'h2'> & { number: string }) {
  return (
    <div className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32">
      <h2
        className={clsx(
          className,
          'inline-flex items-center rounded-full px-4 py-1 text-[#00ff00] ring-1 ring-[#00ff00] ring-inset',
        )}
        {...props}
      >
        <span className="font-mono text-sm" aria-hidden="true">
          {number.padStart(2, '0')}
        </span>
        <span className="ml-3 h-3.5 w-px bg-[#00ff00]/20" />
        <span className="ml-3 text-base font-medium tracking-tight">
          {children}
        </span>
      </h2>
    </div>
  )
}
