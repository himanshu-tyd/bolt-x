

import { motion } from "framer-motion"

const frameworks = [
  { name: "Next.js", icon: "N" },
  { name: "React", icon: "R" },
  { name: "Vue", icon: "V" },
  { name: "Nuxt", icon: "N" },
  { name: "Angular", icon: "A" },
  { name: "Svelte", icon: "S" },
  { name: "TypeScript", icon: "TS" },
]

export function FrameworkGrid() {
  return (
    <div className="mt-20 text-center">
      <p className="text-sm text-muted-foreground mb-8">or start a blank app with your favorite stack</p>
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto md:grid-cols-7">
        {frameworks.map((framework, i) => (
          <motion.div
            key={framework.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <span className="font-mono text-sm">{framework.icon}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

