

import {Link} from "react-router-dom"
import { Button } from "../components/ui/button"
import { Bolt } from "lucide-react"

export function Navigation() {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Bolt className="h-6 w-6" />
          <span className="font-bold">BoltX ppIDE</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            We&apos;re hiring!
          </Link>
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </nav>
      </div>
    </header>
  )
}

