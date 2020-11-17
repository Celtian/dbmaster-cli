<p align="center">
  <a href="https://github.com/Celtian/dbmaster-cli" target="blank"><img src="assets/logo.svg?sanitize=true" alt="" width="120"></a>
  <h1 align="center">DB Master Cli</h1>
</p>

[![npm version](https://badge.fury.io/js/dbmaster-cli.svg)](https://badge.fury.io/js/dbmaster-cli)
[![Build & Publish](https://github.com/celtian/dbmaster-cli/workflows/Build%20&%20Publish/badge.svg)](https://github.com/celtian/dbmaster-cli/actions)
[![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)

> Tool for converting tables between Fifa Soccer Games

## Install

_Nodejs 12 or higher need to be installed first_

```terminal
npm install -g dbmaster-cli
```

or

```terminal
yarn add -g dbmaster-cli
```

## Quick start

_Go to command line and type_

### Convert

This example converts supported table from Fifa 20 into Fifa 16 format. If some value of field is out of range or is missing it is filled by default value.

```terminal
dbmaster convert --config 'C:\Users\username\Desktop\config.yml'
```

Example of yaml file:

```yaml
input:
  version: fifa21
  folder: 'C:\Users\username\Desktop\fifa21' # folder containing tables exported by db master

actions: # actions will be called in this order
  - type: extend-contract # extend loans and contracts which are invalid
  - type: append-default # appends default values to new fields

output:
  version: fifa16
  folder: 'C:\Users\username\Desktop\fifa16'
  format: csv # csv or json
```

### Compare

This example shows you comaprsion table.

```terminal
dbmaster compare --from fifa21 --to fifa16 --table players --mode columns
```

- [from](#supported-versions-of-fifa-soccer)
- [to](#supported-versions-of-fifa-soccer)
- [table](#supported-tables)
- mode
  - column - Is the column present?
  - default - What is the default value of the column?
  - order - What is the correct order of the column?
  - range - What is the range of integer the column?
  - type - What is the correct datatype of the column?

## Supported versions of Fifa Soccer

| Fifa        | Supported |
| ----------- | --------- |
| **Fifa 11** | ✓         |
| **Fifa 12** | ✓         |
| **Fifa 13** | ✓         |
| **Fifa 14** | ✓         |
| **Fifa 15** | ✓         |
| **Fifa 16** | ✓         |
| **Fifa 17** | ✓         |
| **Fifa 18** | ✓         |
| **Fifa 19** | ✓         |
| **Fifa 20** | ✓         |
| **Fifa 21** | ✓         |

## Supported tables

| Table                  | Supported |
| ---------------------- | --------- |
| **competition**        | ✓         |
| **formations**         | ✓         |
| **leaguerefereelinks** | ✓         |
| **leagues**            | ✓         |
| **leagueteamlinks**    | ✓         |
| **manager**            | ✓         |
| **nations**            | ✓         |
| **playerboots**        | ✓         |
| **player_grudgelove**  | ✓         |
| **playerloans**        | ✓         |
| **playernames**        | ✓         |
| **players**            | ✓         |
| **previousteam**       | ✓         |
| **referee**            | ✓         |
| **rivals**             | ✓         |
| **rowteamnationlinks** | ✓         |
| **shoecolors**         | ✓         |
| **stadiums**           | ✓         |
| **teamballs**          | ✓         |
| **teamkits**           | ✓         |
| **teamnationlinks**    | ✓         |
| **teamplayerlinks**    | ✓         |
| **teams**              | ✓         |
| **teamstadiumlinks**   | ✓         |

## License

Copyright &copy; 2020 [Dominik Hladik](https://github.com/Celtian)

All contents are licensed under the [MIT license].

[mit license]: LICENSE
