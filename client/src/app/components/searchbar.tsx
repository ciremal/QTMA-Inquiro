import React, { useState } from "react";

const SearchBar = (onSearch: any) => {
  // State to hold the search term
  const [term, setTerm] = useState("");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  // Handle search action on form submission
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (term.trim()) {
      // Optional: check for empty search term
      onSearch(term);
      setTerm(""); // Clear the input after search
    }
  };

  return (
    <div className="w-full bg-none py-3 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <form
          // @ts-ignore
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={term}
            onChange={handleInputChange}
            placeholder="Search for a company or filter by asking a question"
            className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg p-3 transition-colors"
          >
            <img
              src="/path/to/profile-image.jpg"
              alt="Search"
              className="w-6 h-6 rounded-full object-cover cursor-pointer"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
