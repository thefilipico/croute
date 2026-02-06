import osmium
import json
import sys

TYPE_TAGS = {
    "church": {"building": "church", "amenity": "place_of_worship"},
    "gallery": {"tourism": "art_gallery"},
    "statue": {"historic": "statue"},
    "museum": {"tourism": "museum"},
    "castle": {"historic": "castle"},
    "historic_site": {"historic": None},
}

class BuildingsHandler(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.data = []

    def node(self, n):
        type_name = self.get_type(n.tags)
        if type_name and 'name' in n.tags:
            self.data.append({
                "name": n.tags["name"],
                "lat": n.location.lat,
                "lon": n.location.lon,
                "type": type_name,
            })

    def way(self, w):
        type_name = self.get_type(w.tags)
        if type_name and 'name' in w.tags and w.nodes:
            lat = sum(node.lat for node in w.nodes) / len(w.nodes)
            lon = sum(node.lon for node in w.nodes) / len(w.nodes)
            self.data.append({
                "name": w.tags["name"],
                "lat": lat,
                "lon": lon,
                "type": type_name,
            })

    def get_type(self, tags):
        for t, criteria in TYPE_TAGS.items():
            for k, v in criteria.items():
                if k in tags and (v is None or tags[k] == v):
                    return t
        return None

pbf_path = sys.argv[1]

handler = BuildingsHandler()
handler.apply_file(pbf_path, locations=True)

with open("converted.json", "w", encoding="utf-8") as f:
    json.dump(handler.data, f, ensure_ascii=False, indent=2)