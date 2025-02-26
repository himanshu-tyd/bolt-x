export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Help Center
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Careers
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
        </div>
        <div className="text-sm text-muted-foreground">Powered by BoltX IDE</div>
      </div>
    </footer>
  )
}

