import GradientBackground from '@/components/GradientBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GradientShowcase() {
  return (
    <>
      <GradientBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-[#1b1833]">
              Animated Gradient Background
            </h1>
            <p className="text-lg text-[#1b1833]/80">
              A smooth, modern gradient that softly blends between colors in a continuous loop
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-[#1b1833]">Smooth Animation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1b1833]/70">
                  15-second animation cycle with ease-in-out timing for a natural feel
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-[#1b1833]">No Flickering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1b1833]/70">
                  Carefully tuned gradient positions prevent harsh transitions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-[#1b1833]">Modern Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1b1833]/70">
                  Aesthetic palette: #FBFBFB, #CDC1FF, #A294F9
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-[#1b1833]">Full Screen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1b1833]/70">
                  Fixed positioning ensures the gradient covers the entire viewport
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Color Palette */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1b1833]">Color Palette</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg bg-[#fbfbfb] border-2 border-[#1b1833]/20" />
                <p className="text-sm font-mono text-[#1b1833]">#FBFBFB</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg bg-[#cdc1ff] border-2 border-[#1b1833]/20" />
                <p className="text-sm font-mono text-[#1b1833]">#CDC1FF</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg bg-[#a294f9] border-2 border-[#1b1833]/20" />
                <p className="text-sm font-mono text-[#1b1833]">#A294F9</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#1b1833] hover:bg-[#1b1833]/90 text-white">
              Get Started
            </Button>
            <Button variant="outline" className="border-[#1b1833] text-[#1b1833]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
