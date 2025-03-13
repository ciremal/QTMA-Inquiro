import requests
import logging
from firebase_functions import scheduler_fn, https_fn
from firebase_functions.params import StringParam
from firebase_admin import initialize_app, firestore
from firebase_functions import firestore_fn

# Initialize Firebase app when the function starts
initialize_app()

# URL parameter that can be configured in Firebase console
COMPANIES_API_URL = StringParam(
    "COMPANIES_API_URL",
    default="https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-list-of-companies",
)


def update_companies():
    """Fetches companies from API and updates Firestore with changed fields only."""
    try:
        # Get Firestore client
        db = firestore.client()

        # Fetch companies from the API
        url = COMPANIES_API_URL.value
        logging.info(f"Fetching companies from {url}")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        companies = response.json()
        logging.info(f"Fetched {len(companies)} companies")

        updates_count = 0
        new_count = 0
        no_change_count = 0

        for company in companies:
            # Get the document reference
            doc_ref = db.collection("companies").document(company["symbol"])
            # Get the current data (if it exists)
            doc = doc_ref.get()

            if doc.exists:
                # Document exists, compare and update only changed fields
                current_data = doc.to_dict()
                updates = {}
                for key, value in company.items():
                    # Check if the field exists and has a different value
                    if key not in current_data or current_data[key] != value:
                        updates[key] = value

                # Only update if there are changes
                if updates:
                    doc_ref.update(updates)
                    logging.info(
                        f"Updated {company['symbol']} with {len(updates)} changed fields"
                    )
                    updates_count += 1
                else:
                    logging.debug(f"No changes needed for {company['symbol']}")
                    no_change_count += 1
            else:
                # Document doesn't exist, create new
                doc_ref.set(company)
                logging.info(f"Added new company {company['symbol']}")
                new_count += 1

        result = {
            "success": True,
            "new": new_count,
            "updated": updates_count,
            "unchanged": no_change_count,
        }
        logging.info(
            f"Processing complete: {new_count} new companies, {updates_count} updated, {no_change_count} unchanged"
        )
        return result

    except Exception as e:
        logging.error(f"Error updating companies: {str(e)}")
        raise e


# Schedule the function to run every 30 minutes
@scheduler_fn.on_schedule(schedule="every 30 minutes")
def scheduled_update_companies(event: scheduler_fn.ScheduledEvent) -> None:
    """Firebase scheduled function that runs every 30 minutes to update companies data."""
    result = update_companies()
    logging.info(f"Scheduled run completed: {result}")


# HTTP endpoint to manually trigger the update
@https_fn.on_request()
def manual_update_companies(req: https_fn.Request) -> https_fn.Response:
    """HTTP endpoint to manually trigger the update process."""
    try:
        result = update_companies()
        return https_fn.Response(f"Update completed: {result}", status=200)
    except Exception as e:
        return https_fn.Response(f"Error: {str(e)}", status=500)
