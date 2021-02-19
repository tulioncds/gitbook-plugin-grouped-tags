# gitbook-plugin-grouped-tags

[![npm](https://img.shields.io/npm/v/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags) [![npm](https://img.shields.io/npm/dm/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags) [![npm](https://img.shields.io/npm/dt/gitbook-plugin-tags.svg?style=plastic)](https://npmjs.org/package/gitbook-plugin-tags)

## Grouped tags for GitBook

GitBook plugin tags do not support this feature, currently I create this plugin to create grouped tags if `tags-group: xxx` in markdown page or YAML header.

## Usage

### create `tags.md` file and put it into `SUMMARY.md`

Create files named `tags-yourgroup.md` and `tags-othergroup.md` at the root dir and put it at the last entry of `SUMMARY.md`.
A valid `SUMMARY.md` is:
```
# Summary

* [Introduction](README.md)
* [First Chapter](chapter1.md)
* [Tags Grouped](tags-yourgroup.md)
* [Tags OtherGroup](tags-othergroup.md)
```
You can keep the files `tags-yourgroup.md` and `tags-othergroup.md` empty or add header such as
```
# Tags Grouped
```

### add plugin in `book.json`

```
{
  "plugins": [
    "grouped-tags"
  ],
}
```

### add tags in page

Just drop one line such as
```
tags-yourgroup: tag1, tag2, tag3 is here

tags-othergroup: gitbook, javascript
```
tags are separated by comma.

### config placement

Tags will show after the title by default, you can config the placement in the bottom.

```
    "pluginsConfig": {
        "tags": {
            "placement": "bottom"
        },
        "groups": [
          {placeholder: "tags-yourgroup", legend: "My group: "}, 
          {placeholder: "tags-othergroup", legend: "Other group: "}, 
        ]
    }
```

Enjoy!
