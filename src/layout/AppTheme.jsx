import { useState, useEffect } from 'react';
import { FaMoon } from "react-icons/fa";
import { BsFillSunFill } from "react-icons/bs";

export default function AppTheme() {

    const savedDarkMode = localStorage.getItem('darkmode') === 'true';

    const [isDarkMode, setIsDarkMode] = useState(savedDarkMode);

    useEffect(() => {
        const body = document.body;
        if(isDarkMode) {
            body.classList.add('dark', 'bg-stone-900');
            body.classList.remove('bg-white');
            document.querySelector('body').setAttribute('data-theme', 'dark');
        } else {
             body.classList.remove('dark', 'bg-stone-900');
            body.classList.add('bg-white');
            document.querySelector('body').setAttribute('data-theme', 'light');
        }
        localStorage.setItem('darkmode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    }

    return (
        <div className='dark_mode'>

             <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="focus:outline-none"
      >
        {isDarkMode ? (
          <BsFillSunFill className="w-6 h-6 text-yellow-400 hover:text-yellow-500 dark:text-yellow-300 dark:hover:text-yellow-200 cursor-pointer" />
        ) : (
          <FaMoon className="w-6 h-6 text-blue-900 hover:text-blue-950 cursor-pointer" />
        )}
      </button>
        </div>
    )
}
