import React from "react";


const Navbar = () => {
    
    return <nav className="w-full fixed top-0 flex justify-between items-center px-8 py-4 bg-white z-10">
      <div className="flex items-center gap-2">
        <img
            src="/path/to/your-logo.png"  // Replace with your logo path
            alt="Logo"
            className="w-8 h-8"  // Adjust size as needed
        />
        <a href="/" className="site-title">inquiro</a>
    </div>
        <ul className="flex space-x-4">
            <li>
                <a href="/profile"> {/* Link to the user's profile page */}
                    <img
                        src="/path/to/profile-image.jpg"  // Replace with actual image path or URL
                        alt="Profile"
                        className="w-10 h-10  object-cover cursor-pointer"
                    />
                </a>
            </li>
        </ul>
    </nav>

}   

export default Navbar;