import csv
import json
import os
import requests
import xml.etree.ElementTree as ET
import logging
from datetime import datetime

# Setup advanced configuration for logging
logging.basicConfig(filename='parser.log', filemode='a', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class DataParser:
    """ General parser class to handle various file formats including CSV, JSON, XML, and TXT. """

    def parse_csv(self, filepath):
        """ Parse CSV file and return a list of dictionaries. """
        logging.info(f"Starting to parse CSV file: {filepath}")
        try:
            with open(filepath, mode='r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                data = [row for row in csv_reader]
                logging.info("Successfully parsed CSV file.")
                return data
        except Exception as e:
            logging.error(f"Failed to parse CSV: {e}")
            return []

    def parse_json(self, filepath):
        """ Parse JSON file and return data. """
        logging.info(f"Starting to parse JSON file: {filepath}")
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                data = json.load(file)
                logging.info("Successfully parsed JSON file.")
                return data
        except Exception as e:
            logging.error(f"Failed to parse JSON: {e}")
            return []

    def parse_xml(self, filepath):
        """ Parse XML file and return a list of dictionaries. """
        logging.info(f"Starting to parse XML file: {filepath}")
        try:
            tree = ET.parse(filepath)
            root = tree.getroot()
            data = [{child.tag: child.text for child in element} for element in root]
            logging.info("Successfully parsed XML file.")
            return data
        except Exception as e:
            logging.error(f"Failed to parse XML: {e}")
            return []

    def parse_txt(self, filepath):
        """ Parse text file and return list of lines. """
        logging.info(f"Starting to parse text file: {filepath}")
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                data = [line.strip() for line in file]
                logging.info("Successfully parsed text file.")
                return data
        except Exception as e:
            logging.error(f"Failed to parse text: {e}")
            return []

class ExternalAPIFetcher:
    """ Fetch data from external APIs to integrate with local data. """

    def fetch_data(self, url):
        """ Fetch data from a REST API and return the JSON response. """
        logging.info(f"Fetching data from external API: {url}")
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raises an HTTPError for bad responses
            logging.info("Data successfully fetched from external API.")
            return response.json()
        except requests.exceptions.HTTPError as e:
            logging.error(f"HTTP error occurred: {e}")
            return None
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching data from API: {e}")
            return None

class DataIntegrator:
    """ Integrate external API data with locally parsed data. """

    def integrate_data(self, local_data, external_data):
        """ Combine local and external data based on a common key. """
        logging.info("Integrating local and external data.")
        if not external_data:
            logging.error("No external data available for integration.")
            return local_data

        key = 'id'  # Assuming both datasets can be joined on an 'id' field
        integrated_data = {item[key]: {**item, **next((ext_item for ext_item in external_data if ext_item[key] == item[key]), {})} for item in local_data}
        logging.info("Data integration complete.")
        return integrated_data

def save_data_to_file(data, filepath):
    """ Save data to a JSON file. """
    logging.info(f"Saving data to file: {filepath}")
    try:
        with open(filepath, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4)
        logging.info(f"Data successfully saved to {filepath}.")
    except Exception as e:
        logging.error(f"Failed to save data: {e}")

if __name__ == '__main__':
    # Example usage
    parser = DataParser()
    api_fetcher = ExternalAPIFetcher()
    integrator = DataIntegrator()

    # Parse local data
    menu_items = parser.parse_csv('menu_items.csv')
    orders = parser.parse_json('orders.json')

    # Fetch external data
    external_product_details = api_fetcher.fetch_data('https://api.example.com/products')

    # Integrate local and external data
    integrated_menu_items = integrator.integrate_data(menu_items, external_product_details)

    # Save integrated data
    save_data_to_file(integrated_menu_items, 'integrated_menu_items.json')
