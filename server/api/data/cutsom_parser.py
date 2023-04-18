import json

from bson import json_util


def parse_json(json_data):
    return json.loads(json_util.dumps(json_data))
