'use client'

import { Bars3Icon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-gray-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-800" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-300 hover:text-gray-100"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-800" aria-hidden="true" />

          {/* Profile */}
          <button
            type="button"
            className="-m-1.5 flex items-center p-1.5 text-gray-300 hover:text-gray-100"
          >
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-4 text-sm font-semibold leading-6 text-gray-100" aria-hidden="true">
                Pharmacist
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}