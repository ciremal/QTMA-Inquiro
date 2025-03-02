"use client"

import { useState, useMemo } from "react";
import { Chip, Popover, List, ListItem, ListItemButton, ListItemText, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";
import getIndustryColor from "@/app/lib/industryColors";
import { CompanyData } from "@/app/api/models";

interface CompanyProps {
    company: CompanyData;
    companies: CompanyData[]; // recieves all data about companies
  }

const Chips = ({ company, companies }: CompanyProps) => {
    const router = useRouter()  // Hook for programmatic navigation
    // Instead of creating show/hide states of the dropdown menu, anchor the popover of the dropdown to the chips
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);    
    // track which type of dropdown is active
    const [dropdownType, setDropdownType] = useState<"industry" | "sector" | null>(null);
    // stores the clicked element and type

    // add filter companies directly to Chips
    const filteredCompanies = useMemo(() => {
        if (!dropdownType) return[]; 

        return companies.filter((comp) =>
            dropdownType === "industry"
                ? comp.industry === company.industry
                : comp.sector === company.sector
        );
    }, [dropdownType, company, companies]);

    const handleChipClick = (event: React.MouseEvent<HTMLElement>, type: "industry" | "sector") => {
        setAnchorEl(event.currentTarget);
        setDropdownType(type)
    }
    // handle closing of the popUp
    const handleClose = () => {
        setAnchorEl(null);
        setDropdownType(null);
    }

    const handleCompanySelect = (symbol: string) => {
        router.push(`/company/${symbol}`);
        handleClose();
    }

    return (
        <div className="flex gap-2">
            <Chip
                className="font-[500] dark:text-primaryWhite"
                label={company.industry}
                onClick={(e) => handleChipClick(e, "industry")}
                sx={{
                    backgroundColor: getIndustryColor(company.industry).bg,
                    color: getIndustryColor(company.industry).color,
                    "&:hover": {
                        backgroundColor: getIndustryColor(company.industry).bg,
                        opacity: 0.8,
                    },
                    cursor: "pointer",
                    fontWeight: 500,
                }}
            />
            
            <Chip
                className="font-[500] dark:text-primaryWhite"
                label={company.sector}
                onClick={(e) => handleChipClick(e, "sector")}
                sx={{
                    backgroundColor: getIndustryColor(company.sector).bg,
                    color: getIndustryColor(company.sector).color,
                    "&:hover": {
                        backgroundColor: getIndustryColor(company.sector).bg,
                        opacity: 0.8,
                    },
                    cursor: "pointer",
                    fontWeight: 500,
                }}
            />
            
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List sx={{ maxHeight: 300, overflow: 'auto', minWidth: 200 }}>
                    {filteredCompanies.map((comp, index) => (
                        <ListItem disablePadding key={`${comp.symbol}-${index}`}>
                        <ListItemButton onClick={() => handleCompanySelect(comp.symbol)}>
                            <ListItemText
                            primary={comp.longName}
                            secondary={comp.symbol}
                            primaryTypographyProps={{
                                variant: 'body2',
                                noWrap: true
                            }}
                            secondaryTypographyProps={{
                                variant: 'caption',
                                noWrap: true
                            }}
                            />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
            </Popover>
        </div>
    );
};

export default Chips;
