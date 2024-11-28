import React from "react";
import axios from "axios";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setBlurb: (blurbResult: { blurb: string }) => void;
  setCompanies: (companiesResult: { companies: any[] }) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  setPage,
  setBlurb,
  setCompanies,
}) => {
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Handle search action on form submission
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      setPage(0); // Reset to the first page

      try {
        // Make API requests to the backend
        const blurbResponse = await axios.post("/api/search", {
          query: searchTerm,
        });
        console.log("Route Response:", blurbResponse.data);

        // Second API call to get relevant companies
        const companiesResponse = await axios.post("/api/searchCompanies", {
          query: searchTerm,
        });
        console.log("Relevant Response:", companiesResponse.data);

        // Update blurb and companies once both responses are received
        setBlurb({ blurb: blurbResponse.data.blurb || "No blurb available" });
        setCompanies({ companies: companiesResponse.data.companies || [] });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.error("No results found for the search term.");
        } else {
          console.error("Error fetching search results:", error);
        }
      }
    }
  };

  return (
    <div className="w-full bg-none py-3 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={searchTerm}
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
