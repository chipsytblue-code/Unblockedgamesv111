import React, { useState } from 'react';
import { Menu, Bell, Lock, ArrowLeft } from 'lucide-react';

export const PanicDecoy = ({ onDismiss }) => {
  const [activeTab, setActiveTab] = useState('stream');

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 font-sans flex flex-col overflow-y-auto select-text">
      {/* Google Classroom Decoy Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              AP
            </div>
            <div>
              <h1 className="font-semibold text-gray-800 text-base leading-tight">
                AP Computer Science & Calculus AB
              </h1>
              <p className="text-xs text-gray-500">Period 4 • Room 214</p>
            </div>
          </div>
        </div>

        {/* Classroom Center Tabs */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('stream')}
            className={`py-2 border-b-2 transition-all ${
              activeTab === 'stream' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Stream
          </button>
          <button 
            onClick={() => setActiveTab('classwork')}
            className={`py-2 border-b-2 transition-all ${
              activeTab === 'classwork' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Classwork
          </button>
          <button 
            onClick={() => setActiveTab('people')}
            className={`py-2 border-b-2 transition-all ${
              activeTab === 'people' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            People
          </button>
        </div>

        {/* Right tools & Secret Resume */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            S
          </div>

          {/* Secret Exit Decoy button */}
          <button
            id="btn-exit-panic"
            onClick={onDismiss}
            className="ml-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 border border-gray-300"
            title="Return to Unblocked Hub (or press ESC)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Body */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 flex-1">
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-emerald-700 to-teal-800 rounded-xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">AP Computer Science & Calculus</h2>
            <p className="text-emerald-100 text-sm mt-1">Instructor: Dr. Anderson • Fall Semester</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs backdrop-blur-xs">
              <Lock className="w-3.5 h-3.5" /> Class Code: <span className="font-mono font-bold">x8q92m</span>
            </div>
          </div>
        </div>

        {/* Grid stream */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Upcoming */}
          <div className="md:col-span-1 border border-gray-200 rounded-xl p-4 bg-gray-50 h-fit">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Upcoming</h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-gray-800">Due Friday, 11:59 PM</p>
                <p className="text-gray-600">Unit 4: Recursion & Binary Search Trees</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Due Monday</p>
                <p className="text-gray-600">Derivatives & Optimization Lab 3</p>
              </div>
            </div>
          </div>

          {/* Announcements & Stream posts */}
          <div className="md:col-span-3 space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  DA
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Dr. Anderson</h4>
                  <p className="text-xs text-gray-400">Yesterday at 2:15 PM</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                Hello class, please make sure you have reviewed chapter 7 on time complexity analysis and Big-O notation. We will have a group programming assignment next Tuesday. Check the class drive folder for reference notes.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  DA
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Dr. Anderson posted a new assignment: Unit 4 Lab</h4>
                  <p className="text-xs text-gray-400">Aug 28</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Complete the problem set in the attached PDF. Write test cases for sorting algorithms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
