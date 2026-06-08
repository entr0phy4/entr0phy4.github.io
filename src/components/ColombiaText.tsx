'use client'

import { motion } from 'framer-motion'

export function ColombiaText() {
  return (
    <span className="relative inline-flex items-end">
      <span className="absolute top-0 left-0 text-[0.3em] leading-none text-white">
        from
      </span>
      <motion.span
        className="text-[1.45em] leading-none"
        style={{
          background:
            'linear-gradient(90deg, #FFE999 0%, #FFE999 20%, #A8C8F0 40%, #A8C8F0 60%, #FFB3BA 80%, #FFB3BA 100%, #FFE999 120%)',
          backgroundSize: '250% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        Colombia
      </motion.span>
    </span>
  )
}
