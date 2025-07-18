import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../services/supabase'

const Navigation: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleLanguageChange = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')
  }

  // Format today's date based on current language
  const formatToday = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    if (i18n.language === 'vi') {
      return today.toLocaleDateString('vi-VN', options)
    } else {
      return today.toLocaleDateString('en-US', options)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="ml-2 text-2xl md:text-3xl font-extrabold tracking-wide uppercase text-primary-700">
            {t('app.title')}
          </span>
        </div>
        {/* Right: Today's Date + Language Switcher + User Menu */}
        <div className="flex items-center space-x-4">
          {/* Today's Date */}
          <div className="hidden sm:block text-sm text-gray-600 font-medium">
            {formatToday()}
          </div>
          <button
            onClick={handleLanguageChange}
            className="px-3 py-1 rounded bg-white text-gray-800 hover:bg-gray-50 text-xs font-semibold border border-gray-300 shadow-sm"
          >
            {i18n.language === 'en' ? 'ENG' : 'VI'}
          </button>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-sm rounded-full bg-white border border-gray-300 px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
            >
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium text-xs">U</span>
              </div>
              <span className="text-gray-800 font-medium">User</span>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 