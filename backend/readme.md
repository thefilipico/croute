## Priprema podataka

1. Preuzmite `croatia-latest.osm.pbf` s Geofabrik servisa: https://download.geofabrik.de/europe/croatia.html
2. Instalirajte osmium Python knjižnicu, najjednostavnije naredom `pip install osmium`, za druge načine posjetite [pyosmium repozitorij](https://github.com/osmcode/pyosmium)
3. Pokrenite `parser.py` skriptu s preuzetom datotekom kao prvim argumentom
```
python parser.py croatia-DDMMYY.osm.pbf
```


## Izvor podataka

Dataset preuzet s https://download.geofabrik.de/europe/croatia.html u `.osm.pbf` formatu, dostupan pod [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/) licencom. Za više informacija o licenciranju OpenStreetMap podataka vidi [ovo](https://www.openstreetmap.org/copyright/hr)
