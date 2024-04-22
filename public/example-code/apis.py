"""
file for defining all APIs and endpoints used,
as well as related utils
"""
from parse import parse_info
import requests

def get_delivery(info, token):
  # define doordash deliveries endpoint
  endpoint = "https://openapi.doordash.com/drive/v2/deliveries/"

  headers = {"Accept-Encoding": "application/json",
             "Authorization": "Bearer " + token,
             "Content-Type": "application/json"}

  # Create POST request
  create_delivery = requests.post(endpoint, headers=headers, json=info) 


def read_menu(filename):
  # read and parse menu txt
  pass