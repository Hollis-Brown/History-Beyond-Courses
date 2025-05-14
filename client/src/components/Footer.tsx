import { Link } from "wouter";
import { Heart } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <Link href="/">
            <div className="text-white text-xl font-bold mb-4">
              <span className="text-white">History</span>
              <span className="text-primary">Beyond</span>
            </div>
          </Link>
          
          <p className="text-neutral-medium text-center mb-6 flex items-center">
            Made with <Heart className="text-accent h-4 w-4 mx-1 inline" fill="currentColor" /> by HB
          </p>
          
          <div className="flex items-center space-x-6 mb-6">
            <a href="#" className="text-neutral-medium hover:text-white transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="text-neutral-medium hover:text-white transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="text-neutral-medium hover:text-white transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="text-neutral-medium hover:text-white transition-colors">
              <FaYoutube />
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center">
            <a href="#" className="text-neutral-medium hover:text-white mx-3 mb-2 text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-medium hover:text-white mx-3 mb-2 text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-medium hover:text-white mx-3 mb-2 text-sm">FAQ</a>
            <a href="#" className="text-neutral-medium hover:text-white mx-3 mb-2 text-sm">Help Center</a>
          </div>
          
          <p className="text-neutral-medium text-xs mt-6">
            &copy; {new Date().getFullYear()} History Beyond Headlines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
