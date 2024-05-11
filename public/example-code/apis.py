import os
import logging
from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
import requests
from datetime import datetime

# Setup basic configuration for logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s:%(message)s')

app = Flask(__name__)
api = Api(app)

# Assume environment variables for API keys and database URLs
DOORDASH_API_KEY = os.getenv('DOORDASH_API_KEY')

# Parser for menu items
menu_parser = reqparse.RequestParser()
menu_parser.add_argument('item_name', type=str, required=True, 
                         help="Name of the menu item is required")
menu_parser.add_argument('price', type=float, required=True, 
                         help="Price of the item is required")
menu_parser.add_argument('description', type=str, 
                         help="Description of the menu item")

# Parser for orders
order_parser = reqparse.RequestParser()
order_parser.add_argument('item_id', type=int, required=True, 
                          help="Menu item ID is required")
order_parser.add_argument('quantity', type=int, required=True, 
                          help="Quantity is required")
order_parser.add_argument('customer_name', type=str, required=True, 
                          help="Customer name is required")
order_parser.add_argument('customer_address', type=str, required=True, 
                          help="Customer address is required")

class MenuItem(Resource):
    def get(self, item_id):
        # Simulate fetching an item from a database
        logging.info(f"Fetching item with ID {item_id}")
        try:
            # This is a placeholder for a real database call
            response = {"id": item_id, "name": "Chocolate Cake", 
                        "price": 15.00, "description": "Rich chocolate cake"}
            return jsonify(response)
        except Exception as e:
            logging.error(f"Failed to fetch item: {str(e)}")
            return jsonify({"error": "Item could not be retrieved"}), 500

    def post(self):
        args = menu_parser.parse_args()
        # Simulate adding a new menu item to a database
        logging.info("Adding a new menu item")
        try:
            response = {"message": "Item added", "item_details": args}
            return jsonify(response)
        except Exception as e:
            logging.error(f"Failed to add item: {str(e)}")
            return jsonify({"error": "Failed to add item"}), 500

    def put(self, item_id):
        args = menu_parser.parse_args()
        # Simulate updating a menu item in a database
        logging.info(f"Updating item with ID {item_id}")
        try:
            response = {"message": "Item updated", "item_id": item_id, 
                        "new_details": args}
            return jsonify(response)
        except Exception as e:
            logging.error(f"Failed to update item: {str(e)}")
            return jsonify({"error": "Failed to update item"}), 500

    def delete(self, item_id):
        # Simulate deleting a menu item from a database
        logging.info(f"Deleting item with ID {item_id}")
        try:
            response = {"message": "Item deleted", "item_id": item_id}
            return jsonify(response)
        except Exception as e:
            logging.error(f"Failed to delete item: {str(e)}")
            return jsonify({"error": "Failed to delete item"}), 500

class Order(Resource):
    def post(self):
        args = order_parser.parse_args()
        # Simulate placing an order and saving it to a database
        logging.info("Placing a new order")
        try:
            response = {"message": "Order placed", "order_details": args}
            return jsonify(response)
        except Exception as e:
            logging.error(f"Failed to place order: {str(e)}")
            return jsonify({"error": "Failed to place order"}), 500

class DoorDashIntegration(Resource):
    def post(self, order_id):
        # Example of sending order details to DoorDash for delivery
        logging.info(f"Sending order {order_id} to DoorDash")
        order_details = {"order_id": order_id, "item_id": 1, "quantity": 2, 
                         "customer_address": "123 Baker Street"}
        headers = {'Authorization': 'Bearer {}'.format(DOORDASH_API_KEY)}
        try:
            doordash_response = requests.post("https://api.doordash.com/order", 
                                              json=order_details, headers=headers)
            if doordash_response.status_code == 200:
                response = {"message": "Order sent to DoorDash", 
                            "DoorDash_response": doordash_response.json()}
                return jsonify(response)
            else:
                return jsonify({"error": "DoorDash API error", 
                                "reason": doordash_response.text}), 500
        except Exception as e:
            logging.error(f"Failed to send order to DoorDash: {str(e)}")
            return jsonify({"error": "Failed to communicate with DoorDash API"}), 500

# Setup the Api resource routing
api.add_resource(MenuItem, '/menu/<int:item_id>', '/menu')
api.add_resource(Order, '/order')
api.add_resource(DoorDashIntegration, '/doordash/<int:order_id>')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
