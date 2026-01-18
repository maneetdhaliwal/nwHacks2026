import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg transition-all group-hover:scale-105">
            <img src="/mockr_logo.png" alt="Mockr Logo" className="w-full h-full" />
          </div>
          <span className="text-xl font-semibold text-foreground">Mockr</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/interview" 
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Start Interview
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
