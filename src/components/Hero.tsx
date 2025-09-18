import { Button } from "@/components/ui/button";
import { ArrowRight, Database, BarChart3, Globe } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center hero-gradient pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        {/* Main Hero Content */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
            Democratizing{" "}
            <span className="bg-gradient-ocean bg-clip-text text-transparent">
              Ocean Data
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Access, Query, and Visualize the Ocean like never before.
            Unlock the power of marine data for research, conservation, and discovery.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              variant="ocean" 
              size="xl"
              className="group"
            >
              Explore Ocean Data
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="bg-card/50 backdrop-blur-sm hover:bg-card/80 border-primary/20 hover:border-primary/40"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="group cursor-pointer">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-float transition-all duration-300 hover:-translate-y-2 border border-border/30">
                <Database className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Vast Data Access</h3>
                <p className="text-muted-foreground text-sm">
                  Access comprehensive ocean datasets from sensors worldwide
                </p>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-float transition-all duration-300 hover:-translate-y-2 border border-border/30">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Smart Visualization</h3>
                <p className="text-muted-foreground text-sm">
                  Create stunning visualizations with our advanced tools
                </p>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 hover:shadow-float transition-all duration-300 hover:-translate-y-2 border border-border/30">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Global Reach</h3>
                <p className="text-muted-foreground text-sm">
                  Explore ocean data from every corner of the planet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;