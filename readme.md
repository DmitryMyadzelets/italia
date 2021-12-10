# Italy - Administrative Structure
[Italstat](https://www.istat.it/) - Unità amministrative territoriali: comuni, città metropolitane, province e regioni

The latest data from June 30, 2021.

## Intro
Italy is subdivided into regions. Each region is subdivided into provinces and
metropolises. Finaly, the later ones are subddivided into communes. I.e.:
```
Italy := { Regions }
Region := { Provinces and Metropolises }
Province or Metropolis := { Comunes  }
```

In dicember 2021 the amount of entities is following:
```
|Regions| = 20
|Provinces| = 93
|Metropolises| = 14
|Communes| = 7904
```

The administrative structure is constantly evolving. This project aims to
create tools to extract some usefull information in `JSON` format from the source data.

## Tools
Assume you have downloaded `zip` file, then extracted and (optionally) decoded `csv` file to
the `csv/data.csv` file. Then you can run the commands:
* `node tools/convert` - Convert `csv/data.csv` file to `json/data.json`
* `node tools/extract` - Extract some JSON data (see below)

## Extracted data
* `json/regions` - Regions' names
* `json/provinces` - Both provinces' and metropolises' names

Edit the code, create your own tool and get data you need!

## Data Source
The original data were downloaded [from
Istat](https://www.istat.it/it/archivio/6789) as a [zip file](https://www.istat.it/storage/codici-unita-amministrative/Elenco-codici-statistici-e-denominazioni-delle-unita-territoriali.zip). It contains `xls` and `csv` versions of the data. We use `csv` as a source. 

Notes:
* The source file may have `cp1252` encoding. You can convert it to
`utf8` on Linux: `iconv -f cp1252 -t utf8 source > destination`.
* There are strings containing the new line character `\n`. Some programs delete it when export `xls` file to `csv`. It may affect the keys in JSON objects.


### What's in the data? 
The `data.json` file contain all the data from the source. It's a one-dimensional array of objects, each object has the
following keys:
```js
[
  "Codice Regione",
  "Codice dell'Unità territoriale sovracomunale \n(valida a fini statistici)",
  "Codice Provincia (Storico)(1)",
  "Progressivo del Comune (2)",
  "Codice Comune formato alfanumerico",
  "Denominazione (Italiana e straniera)",
  "Denominazione in italiano",
  "Denominazione altra lingua",
  "Codice Ripartizione Geografica",
  "Ripartizione geografica",
  "Denominazione Regione",
  "Denominazione dell'Unità territoriale sovracomunale \n(valida a fini statistici)",
  "Tipologia di Unità territoriale sovracomunale",
  "Flag Comune capoluogo di provincia/città metropolitana/libero consorzio",
  "Sigla automobilistica",
  "Codice Comune formato numerico",
  "Codice Comune numerico con 110 province (dal 2010 al 2016)",
  "Codice Comune numerico con 107 province (dal 2006 al 2009)",
  "Codice Comune numerico con 103 province (dal 1995 al 2005)",
  "Codice Catastale del comune",
  "Codice NUTS1 2010",
  "Codice NUTS2 2010 (3)",
  "Codice NUTS3 2010",
  "Codice NUTS1 2021",
  "Codice NUTS2 2021 (3)",
  "Codice NUTS3 2021"
]
```
