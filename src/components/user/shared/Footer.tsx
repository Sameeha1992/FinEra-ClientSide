"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-teal-600 rounded-lg">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-green-400">
                Fin<span className="text-white">Era</span>
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Our mission is to empower individuals and businesses by providing them with the financial resources they
              need to achieve their goals.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><span className="text-xs">f</span></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><span className="text-xs">@</span></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><span className="text-xs">in</span></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><span className="text-xs">ig</span></div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">OUR SERVICES</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Personal loan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Business loan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Education loan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auto loan</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">CONTACT US</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2"><span>📞</span><span>+91 99999 99999</span></li>
              <li className="flex items-center space-x-2"><span>✉️</span><span>xyz@gmail.com</span></li>
              <li className="flex items-start space-x-2"><span>📍</span><span>Address line 1,<br />Address line 2,<br />city, state, pin code</span></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
