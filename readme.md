# Italy - Administrative Structure
[Italstat](https://www.istat.it/) - Unità amministrative territoriali: comuni, città metropolitane, province e regioni

The latest data from December 30, 2021.

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
* `node tools/extract/regions` - Extract regions' names as JSON
* `node tools/extract/provinces` - Extract provinces' names as JSON
* `node tools/extract/italy` - Extract names of regions, provinces and comunes as JSON

## Extracted data
* `json/regions` - Regions' names
* `json/provinces` - Both provinces' and metropolises' names
* `json/italy` - Tree-like structure of regions, provinces and comunes
* `json/postcodes` - Postal codes (CAP)

The `json/italy` file includes ids for each administrative entity. The ids make
sence when you organize data from different sources which may have different
names for same entities. We use cadastral code for the comunes, two-letter
abbreviation for the provinces and origianal numeric codes for the regions as
ids.

Edit the code, create your own tool and get data you need!

## Data Sources
The original data were downloaded [from
Istat](https://www.istat.it/it/archivio/6789) as a [zip file](https://www.istat.it/storage/codici-unita-amministrative/Elenco-codici-statistici-e-denominazioni-delle-unita-territoriali.zip). It contains `xls` and `csv` versions of the data. We use `csv` as a source. 

Notes about Istat:
* The source file may have `cp1252` encoding. You can convert it to
`utf8` on Linux: `iconv -f cp1252 -t utf8 source > destination`.
* There are strings containing the new line character `\n`. Some programs delete it when export `xls` file to `csv`. It may affect the keys in JSON objects.

The postcodes are collected from different public sources, and merged to
a single file. The names of administrative entities in the file are equal to the ones used
by Istat.

Other data sources:
* [nonsoloCAP](https://www.nonsolocap.it/)

### What's in the data? 
The `data.json` file contains all the data from the source. It's an one-dimensional array of objects as e.g.:
```js
{
  "Codice Regione": "01",
  "Codice dell'Unità territoriale sovracomunale \n(valida a fini statistici)": "201",
  "Codice Provincia (Storico)(1)": "001",
  "Progressivo del Comune (2)": "001",
  "Codice Comune formato alfanumerico": "001001",
  "Denominazione (Italiana e straniera)": "Agliè",
  "Denominazione in italiano": "Agliè",
  "Denominazione altra lingua": "",
  "Codice Ripartizione Geografica": "1",
  "Ripartizione geografica": "Nord-ovest",
  "Denominazione Regione": "Piemonte",
  "Denominazione dell'Unità territoriale sovracomunale \n(valida a fini statistici)": "Torino",
  "Tipologia di Unità territoriale sovracomunale": "3",
  "Flag Comune capoluogo di provincia/città metropolitana/libero consorzio": "0",
  "Sigla automobilistica": "TO",
  "Codice Comune formato numerico": "1001",
  "Codice Comune numerico con 110 province (dal 2010 al 2016)": "1001",
  "Codice Comune numerico con 107 province (dal 2006 al 2009)": "1001",
  "Codice Comune numerico con 103 province (dal 1995 al 2005)": "1001",
  "Codice Catastale del comune": "A074",
  "Codice NUTS1 2010": "ITC",
  "Codice NUTS2 2010 (3)": "ITC1",
  "Codice NUTS3 2010": "ITC11",
  "Codice NUTS1 2021": "ITC",
  "Codice NUTS2 2021 (3)": "ITC1",
  "Codice NUTS3 2021": "ITC11"
}
```

Notes:
* Some complicated names of regions are established in the [Constiution, article 116](https://www.senato.it/istituzione/la-costituzione/parte-ii/titolo-v/articolo-116).
* Names of entities may vary even in official documents. So it's better to use
  the codes assigned to them.
* The "Codice Istat" i.e. "Codice Comune" changes when a comune passes from one
  province to another, so it can't be used to compare data from different time periods.
* The "[Codice Catastale](https://it.wikipedia.org/wiki/Codice_catastale)"
  seems to be the most appropiate thing to be used as an unique id for the comunes. 

