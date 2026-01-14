import { useState } from "react";
import { Home, Briefcase, GraduationCap, Leaf, Building2, CreditCard, ChevronDown, ChevronUp, Phone, Mail, MapPin } from "lucide-react";
import heroIllustration from "@/assets/logI.png";

const Landingpage = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const products = [
    { icon: Home, title: "Home Loan" },
    { icon: CreditCard, title: "Personal Loan" },
    { icon: GraduationCap, title: "Education Loan" },
    { icon: Leaf, title: "Agriculture Loan" },
    { icon: Building2, title: "Business Loan" },
    { icon: Briefcase, title: "Commercial Loan" },
  ];

  const howItWorks = [
    { step: 1, title: "Select a product from our wide", description: "Choose the loan type that best fits your needs from our comprehensive range of financial products." },
    { step: 2, title: "Fill out a quick online form", description: "Complete our simple application form with your basic details and requirements." },
    { step: 3, title: "Get a Decision within 24 hours", description: "Our team reviews your application and provides a decision quickly." },
    { step: 4, title: "Get Approved", description: "Once approved, receive your funds directly in your account." },
  ];

  const keyFeatures = [
    "Multiple Offers - Compare offers from approved lenders",
    "Fast Processing - Receive decisions in 24 hours",
    "Low Rates - Find loans with the lowest interest rates",
    "End to End - Enjoy a simple quick approval process",
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
                Get the Funds You Need, When You Need Them
              </h1>
              <p className="text-gray-500 text-lg mb-8">
                Quick, hassle-free loans tailored to fit your needs.
              </p>
              <button className="bg-teal-600 text-white px-8 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors">
                Get Started
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src={heroIllustration} 
                alt="Financial services illustration" 
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {products.map((product, index) => (
              <div key={index} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                  <product.icon className="w-10 h-10 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-teal-600 font-medium">{product.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Loan Types */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Explore Loan Types That Suit Your Needs
          </h2>
          <p className="text-gray-500 mb-4">
            Home loan types are available for everyone to purchase home.
          </p>
          <p className="text-gray-500 mb-8">
            Financia is your one-stop platform for compare loans from trusted banks and apply online in minutes. We help you find the best rates, check your eligibility, and get approved fast.
          </p>

          {/* How it works */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">How we works</h3>
            <div className="space-y-3">
              {howItWorks.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium text-sm">
                        {item.step}
                      </span>
                      <span className="text-gray-800 font-medium text-left">{item.title}</span>
                    </div>
                    {openAccordion === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {openAccordion === index && (
                    <div className="px-4 pb-4 pt-2 bg-gray-50">
                      <p className="text-gray-500 pl-11">{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
            <ul className="space-y-2">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-500">
                  <span className="text-teal-600 mt-1">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landingpage;
