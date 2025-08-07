import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MailKaroLanding = () => { 
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Mail className="w-6 h-6 text-indigo-600 mr-2" /> 
                <span className="text-indigo-600 text-2xl font-bold">MailKaro</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  How It Works
                </a>
                <a href="#contact" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center">
              {/* <button className="bg-gray-100 hover:bg-gray-200 text-indigo-700 font-medium py-2 px-4 rounded-md mr-2">
                Login
              </button> */}
              <button
                onClick={() => navigate('/login')}
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16 pb-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  Introducing
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">MailKaro - Smart</span>
                  <span className="block text-indigo-600">Email Marketing</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Send bulk emails with personalized variables, schedule campaigns, attach files, and leverage our upcoming AI-powered email generation feature.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                {/* <form className="mt-3 sm:flex">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full py-3 text-base rounded-md placeholder-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:flex-1 border-gray-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  /> */}
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-3 w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:flex-shrink-0"
                  >
                    Get Started
                  </button>
                {/* </form> */}
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="image.png"
                    alt="Dashboard screenshot"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
      <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
        Everything you need for effective email campaigns
      </p>
      <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
        Our platform offers all the tools for professional email marketing.
      </p>
    </div>

    <div className="mt-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Feature 1 */}
        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Bulk Email with Variables</h3>
              <p className="mt-5 text-base text-gray-500">
                Send personalized emails to thousands of recipients at once. Use variables like {'{{name}}'}, {'{{company}}'}, and more to customize each email.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Schedule Campaigns</h3>
              <p className="mt-5 text-base text-gray-500">
                Plan your email campaigns in advance. Set the perfect time and date to reach your audience when they're most likely to engage.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </span>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">File Attachments</h3>
              <p className="mt-5 text-base text-gray-500">
                Attach documents, images, and other files to your emails. Make sure your recipients get all the information they need.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4 - AI Mail Generation */}
        <div className="pt-6">
          <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="-mt-6">
              <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                AI Mail Generation 
                <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Coming Soon</span>
              </h3>
              <p className="mt-5 text-base text-gray-500">
                Our upcoming AI feature will help you generate professional and engaging email content tailored to your specific needs and audience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Simple steps to email marketing success
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Create your campaign</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Design your email using our intuitive editor. Add variables, upload your contact list, and personalize your message.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Schedule or send</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose to send immediately or schedule for the perfect time. Add attachments if needed.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Track and optimize</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Analyze campaign performance and make data-driven decisions to improve your future emails.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {/* <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to supercharge</span>
                  <span className="block">your email marketing?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                  Sign up today and get 500 free emails every month. No credit card required.
                </p>
                <a
                  href="#"
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Sign up for free
                </a>
              </div>
            </div>
            <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
              <img
                className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                src="/api/placeholder/640/400"
                alt="App screenshot"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer id="contact" className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <span className="text-white text-2xl font-bold">MailKaro</span>
              {/* <p className="mt-2 text-gray-400">Smart email marketing solutions for businesses of all sizes.</p> */}
              <div className="mt-4 flex space-x-6">
                {/* <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a> */}
                {/* <a href="#" className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a> */}
              </div>
            </div>

            {/* <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Tutorials</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Blog</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">API Reference</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">About</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Careers</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">Terms of Service</a>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="mailto:jatinmahawar08@gmail.com" className="text-gray-400 hover:text-gray-300">
                Contact for any query: jatinmahawar08@gmail.com 
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 MailKaro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MailKaroLanding;