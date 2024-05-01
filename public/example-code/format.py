import logging
import json

# Setup logging configuration
logging.basicConfig(filename='formatting.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class WebContentFormatter:
    """ Class to format web content for various parts of the bakery website. """

    def format_menu(self, menu_items):
        """ Format menu items into HTML for display on the website. """
        logging.info("Formatting menu items for web display.")
        try:
            html_content = '<div class="menu">\n'
            for item in menu_items:
                html_content += f'<div class="menu-item">\n'
                html_content += f'  <h3>{item["name"]}</h3>\n'
                html_content += f'  <p>{item["description"]}</p>\n'
                html_content += f'  <span class="price">${item["price"]:.2f}</span>\n'
                html_content += '</div>\n'
            html_content += '</div>'
            return html_content
        except Exception as e:
            logging.error(f"Error formatting menu: {e}")
            return None

    def format_footer(self, footer_data):
        """ Format footer content, including contact info and social media links. """
        logging.info("Formatting footer for web display.")
        try:
            html_content = '<footer>\n'
            html_content += f'<p>{footer_data["contact_info"]}</p>\n'
            if footer_data.get("social_media"):
                html_content += '<ul class="social-media">\n'
                for platform, link in footer_data["social_media"].items():
                    html_content += f'  <li><a href="{link}">{platform.capitalize()}</a></li>\n'
                html_content += '</ul>\n'
            html_content += '</footer>'
            return html_content
        except Exception as e:
            logging.error(f"Error formatting footer: {e}")
            return None

    def format_header(self, header_data):
        """ Format header content, including navigation links and logo. """
        logging.info("Formatting header for web display.")
        try:
            html_content = '<header>\n'
            html_content += f'<img src="{header_data["logo"]}" alt="Bakery Logo" class="logo">\n'
            html_content += '<nav>\n<ul>\n'
            for link, url in header_data["navigation"].items():
                html_content += f'  <li><a href="{url}">{link}</a></li>\n'
            html_content += '</ul>\n</nav>\n'
            html_content += '</header>'
            return html_content
        except Exception as e:
            logging.error(f"Error formatting header: {e}")
            return None

def save_formatted_html(html_content, output_file):
    """ Save formatted HTML content to a file. """
    try:
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(html_content)
        logging.info(f"Formatted HTML content successfully saved to {output_file}.")
    except Exception as e:
        logging.error(f"Failed to save formatted HTML: {e}")

if __name__ == '__main__':
    formatter = WebContentFormatter()

    # Example data
    menu_data = [
        {"name": "Chocolate Cake", "description": "A rich chocolate sponge with chocolate ganache", "price": 7.50},
        {"name": "Cheesecake", "description": "Classic New York cheesecake with a berry compote", "price": 6.50}
    ]
    footer_data = {
        "contact_info": "123 Bakery Lane, Sweetstown, CA 90210",
        "social_media": {
            "facebook": "https://facebook.com/examplebakery",
            "instagram": "https://instagram.com/examplebakery"
        }
    }
    header_data = {
        "logo": "path/to/logo.png",
        "navigation": {
            "Home": "/",
            "Menu": "/menu",
            "About": "/about"
        }
    }

    # Formatting sections
    formatted_menu = formatter.format_menu(menu_data)
    formatted_footer = formatter.format_footer(footer_data)
    formatted_header = formatter.format_header(header_data)

    # Saving formatted content
    save_formatted_html(formatted_menu, 'formatted_menu.html')
    save_formatted_html(formatted_footer, 'formatted_footer.html')
    save_formatted_html(formatted_header, 'formatted_header.html')
