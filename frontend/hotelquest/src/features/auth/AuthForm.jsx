'use client'

import React, { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState('login')
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-3 px-6 text-center font-medium transition-all duration-200 ${
            activeTab === 'login' 
              ? "bg-black text-white rounded-full" 
              : "bg-gray-50 text-gray-700"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-3 px-6 text-center font-medium transition-all duration-200 ${
            activeTab === 'signup' 
              ? "bg-black text-white rounded-full" 
              : "bg-gray-50 text-gray-700"
          }`}
        >
          Sign Up
        </button>
      </div>
      {/* Tab content */}
      <div className="px-1">
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}