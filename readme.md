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
