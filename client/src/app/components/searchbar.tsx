import React from "react";
import axios from "axios";
import { InputAdornment, TextField } from "@mui/material";
import Search from "@mui/icons-material/Search";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  setBlurb: (blurbResult: { blurb: string }) => void;
  setCompanies: (companiesResult: { companies: any[] }) => void;
  setIsLoadingAISearch: (loading: boolean) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  setPage,
  setBlurb,
  setCompanies,
  setIsLoadingAISearch,
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
      setIsLoadingAISearch(true);
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
    setIsLoadingAISearch(false);
  };

  return (
    <div className="w-full bg-none py-3 mt-3">
      <div className="max-w-7xl mx-auto px-4">
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-3xl mx-auto"
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a company or filter by asking a question"
            value={searchTerm}
            onChange={handleInputChange}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <button type="submit" className="flex items-center">
                      <Search className="w-5 h-5 cursor-pointer" />
                    </button>
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "white",
                  borderRadius: "3rem",
                },
              },
            }}
            sx={{
              padding: "0.5rem",
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
