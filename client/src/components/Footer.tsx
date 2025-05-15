import { Link } from "wouter";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div className="text-white text-xl font-bold mb-4">
              <span className="text-primary">Context. Clarity. Connection.</span>
            </div>
          </Link>
          <p className="text-neutral-medium text-center mb-6 flex items-center">
            Made with <Heart className="text-accent h-4 w-4 mx-1 inline" fill="currentColor" /> by HB
          </p>
          <p className="text-neutral-medium text-xs mt-6">
            &copy; {new Date().getFullYear()} History Beyond Headlines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
