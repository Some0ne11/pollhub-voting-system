import { Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white py-8 relative overflow-hidden border-t border-gray-200">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Main message */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-gray-700 font-medium">
                            Created with
                        </span>
                        <Heart className="text-red-500 animate-pulse" size={18} fill="currentColor" />
                        <span className="text-gray-700 font-medium">
                            by Ammar Danial
                        </span>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-600">
                        <span>© {currentYear} All rights reserved.</span>
                    </div>

                    {/* Divider line */}
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-4"></div>
                    
                    {/* Additional message */}
                    <div className="text-xs text-gray-500 mt-3 italic">
                        "Building the future, one line of code at a time"
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;