import React from 'react';
import RegistrationForm from '@/components/vendor/VendorRegister';
import logl from '@/assets/logI.png';

const VendorRegistrationPage: React.FC = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">

        {/* Left: Form */}
        <section className="flex flex-col justify-center items-center px-5 py-10 lg:px-2 ml-6">
          <div className="mt-6 w-full max-w-md">
            <RegistrationForm />
          </div>
        </section>

        {/* Right: Illustration */}
        <aside className="relative hidden lg:flex items-center justify-start bg-gray-100 pl-4">
          <img
            src={logl}
            alt="Finance growth illustration"
            className="w-full max-w-xl object-contain drop-shadow-lg mx-auto -mt-8"
          />
        </aside>

      </div>
    </main>
  );
};

export default VendorRegistrationPage;
