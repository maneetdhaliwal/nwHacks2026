import { Link } from "react-router-dom";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Bot, Code2, MessageSquare, Zap, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Voice Interviewer",
    description: "Practice with a realistic AI interviewer that asks follow-up questions and adapts to your responses.",
  },
  {
    icon: Code2,
    title: "Live Coding Sandbox",
    description: "Solve coding challenges in real-time with syntax highlighting and instant code execution.",
  },
  {
    icon: MessageSquare,
    title: "Instant Feedback",
    description: "Get detailed feedback on your communication skills and technical accuracy after each session.",
  },
  {
    icon: Zap,
    title: "Smart Adaptation",
    description: "The AI adjusts difficulty based on your performance to provide the optimal learning experience.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Interview Practice</span>
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-center leading-tight mb-6">
            Practice Technical
            <br />
            <span className="text-gradient">Interviews with AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            Master your next technical interview with our AI-powered mock interviewer. 
            Get real-time feedback, solve coding challenges, and build confidence.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/interview">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary text-base px-8 py-6 hover:opacity-90 transition-opacity">
                Start Mock Interview
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8 py-6">
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-border overflow-hidden shadow-2xl glass">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Intervue — Mock Interview Session</span>
              </div>
              <div className="grid md:grid-cols-2 divide-x divide-border">
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                      Let's start with a classic. Can you explain how you would implement a function to find two numbers in an array that sum to a target value?
                    </div>
                  </div>
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-secondary-foreground">Y</span>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                      I'd use a hash map approach. We iterate through the array once, and for each element, we check if the complement exists in our map...
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-background/50">
                  <div className="text-sm text-muted-foreground mb-3 font-medium">Code Sandbox</div>
                  <div className="font-mono text-sm text-secondary-foreground">
                    <div><span className="text-primary">function</span> <span className="text-info">twoSum</span>(nums, target) {"{"}</div>
                    <div className="pl-4"><span className="text-primary">const</span> map = <span className="text-primary">new</span> <span className="text-info">Map</span>();</div>
                    <div className="pl-4"><span className="text-primary">for</span> (<span className="text-primary">let</span> i = <span className="text-warning">0</span>; i {"<"} nums.length; i++) {"{"}</div>
                    <div className="pl-8"><span className="text-primary">const</span> complement = target - nums[i];</div>
                    <div className="pl-8 text-muted-foreground">// Check if complement exists...</div>
                    <div className="pl-4">{"}"}</div>
                    <div>{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to <span className="text-gradient">ace your interview</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform simulates real technical interviews with advanced AI, 
              helping you practice and improve before the real thing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary group-hover:scale-105 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl gradient-card border border-border p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: 'var(--gradient-glow)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to level up your interview skills?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Start practicing now with our AI interviewer. No sign-up required.
              </p>
              <Link to="/interview">
                <Button size="lg" className="gradient-primary text-primary-foreground glow-primary text-base px-8 py-6 hover:opacity-90 transition-opacity">
                  Start Your First Interview
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Intervue</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Intervue. Practice makes perfect.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
