
import { CommandPalette } from "../components/command-palette";
import { Footer } from "../components/footer";
import { FrameworkGrid } from "../components/framework-grid";
import { Navigation } from "../components/navigation";


const Home = () => {
  return (

        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">What do you want to build?</h1>
              <p className="text-lg text-muted-foreground">
                Prompt, run, edit, and deploy full-stack <span className="text-foreground">web</span> and{" "}
                <span className="text-foreground">mobile</span> apps.
              </p>
              <CommandPalette />
            </div>
            <FrameworkGrid />
          </main>
          <Footer />
        </div>
  )
}

export default Home;

