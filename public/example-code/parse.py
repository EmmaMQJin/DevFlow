import json

def parse_info(lines):
    outfile_path = "menu_info.json"
    for line in lines:
        parsed = line.strip().split('|')
        name, pic_link, price = parsed[0], parsed[1], parsed[2]
        json_obj = {name : name, pic: pic_link, price: price}
        json.dump(json_obj, outfile_path, indent=4)