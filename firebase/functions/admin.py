import firebase_admin
from firebase_admin import credentials, firestore
import json
import re
from urllib.parse import urlparse


def extract_domain(url):
    """Extract the domain (hostname and TLD) from a URL."""
    if not url:
        return None

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed_url = urlparse(url)
    domain = parsed_url.netloc

    # Remove 'www.' prefix if present
    domain = re.sub(r"^www\.", "", domain)

    return domain


def main():
    # Initialize Firebase Admin SDK
    # Replace with your own service account credentials path
    cred = credentials.Certificate("admin.json")
    firebase_admin.initialize_app(cred)

    # Get Firestore client
    db = firestore.client()

    # Get all documents from the "companies" collection
    companies_ref = db.collection("companies")
    companies = companies_ref.stream()

    # List to store the URL and file name pairs
    logo_data = []

    # Process each company document
    for company in companies:
        company_data = company.to_dict()
        website = company_data.get("website")
        symbol = company_data.get("symbol")

        # Skip if website or symbol is missing
        if not website or not symbol:
            continue

        # Extract domain from website URL
        domain = extract_domain(website)
        if not domain:
            continue

        # Create the logo URL and file name
        logo_url = (
            f"https://cdn.brandfetch.io/{domain}/w/400/h/400?c=1idti6vlb9PtpuACCxz"
        )
        file_name = f"{symbol}.jpg"

        # Add to the list
        logo_data.append({"url": logo_url, "file": file_name})

    # Write to JSON file
    with open("company_logos.json", "w") as f:
        json.dump(logo_data, f, indent=2)

    print(f"Successfully created company_logos.json with {len(logo_data)} entries")


if __name__ == "__main__":
    main()
