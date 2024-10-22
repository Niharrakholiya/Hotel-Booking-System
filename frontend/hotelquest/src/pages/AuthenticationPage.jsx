import React from 'react'
import Layout from '@/features/Layout/Layout'
import AuthForm from '../features/auth/Authform'

export default function AuthPage() {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to Our Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please log in or sign up to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
    </Layout>
  )
}