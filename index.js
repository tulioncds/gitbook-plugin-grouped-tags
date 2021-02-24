var tags_map = {};
var slug = require('github-slugid');
var eol = require('os').EOL;

var tags_map = {}

module.exports = {
  book: {
    assets: './assets',
    css: [
      "plugin.css"
    ]
  },
  hooks: {
    "page:before": function(page) {
      if (this.output.name != 'website') return page;

      var pageName = page.path.replace('.md', '');

      if (page.path.indexOf('tags-') > -1) {
        for (var key in tags_map[pageName]) {
          if (tags_map[pageName].hasOwnProperty(key)) {
            var tag_header = eol.concat('## ', key, eol);
            page.content = page.content.concat(tag_header);
            tags_map[pageName][key].forEach(function(e) {
              var tag_body = eol.concat('- ', '[', e.title, ']', '(', e.url, ')');
              page.content = page.content.concat(tag_body);
            })
            page.content = page.content.concat(eol);
          }
        }
        return page;
      }

      var groupedTags = this.config.get('pluginsConfig.tags.groups') || [{"placeholder": "tags", "legend": ""}];

      for (var i = 0; i < groupedTags.length; i++) {
        // extract tags from page or YAML
        var rawtags = '';
        if (page.tags) {
          // extract from YAML
          rawtags = page.tags;
        } else {
          // extract from page
          page.content = page.content.concat(eol);  // prevent no end of line
          var reg = new RegExp("\^\\s*"+groupedTags[i].placeholder+":\\s*\\[*(.*?)\\]*$", 'im')
          var _tag_exist = page.content.match(reg);
          if (!_tag_exist) return page;
          rawtags = _tag_exist[1];
        }

        // process both YAML and RegExp string
        rawtags = ('' + rawtags).split(',');
        var tags = {}
        tags[groupedTags[i].placeholder] = []
        rawtags.forEach(function(e) {
          var tags_ = e.match(/^\s*['"]*\s*(.*?)\s*['"]*\s*$/)[1];
          if (tags_) tags[groupedTags[i].placeholder].push(tags_);
        })
        
        // push to tags_map
        if (!tags_map[groupedTags[i].placeholder]) {
          tags_map[groupedTags[i].placeholder] = {}
        }
        tags[groupedTags[i].placeholder].forEach(function(e) {
          if (!tags_map[groupedTags[i].placeholder][e]) tags_map[groupedTags[i].placeholder][e] = [];
          tags_map[groupedTags[i].placeholder][e].push({
            url: page.path,
            title: page.title
          });
        })

        // generate tags before html
        var tags_before_ = [];
        tags[groupedTags[i].placeholder].forEach(function(e) {
          if (page.type === 'markdown') {
            tags_before_.push('[' + e + ']' + '(' + '/'+groupedTags[i].placeholder+'.html#' + slug(e) + ')');
          } else {
            tags_before_.push('link:/'+groupedTags[i].placeholder+'.html#' + slug(e) + '[' + e + ']');
          }
        })
        if (page.type === 'markdown') {
          if (groupedTags[i].legend) {
            var tags_before = eol + groupedTags[i].legend + tags_before_.join(' ') + eol;
          } else {
            var tags_before = eol + '<i class="fa fa-tags" aria-hidden="true"></i> ' + tags_before_.join(' ') + eol;
          }
        } else {
          if (groupedTags[i].legend) {
            var tags_before = eol + '*'+groupedTags[i].legend+'* ' + tags_before_.join(' ') + eol;  
          } else {
            var tags_before = eol + '*ADOCTAGS* ' + tags_before_.join(' ') + eol;
          }
        }

        var reg = new RegExp("\^\\s?"+groupedTags[i].placeholder+":\\s?\\[?(.*?)\\]?$", 'im')
        // override raw tags in page
        page.content = page.content.replace(reg, eol);
        
        // replace tags info from page and YAML
        var tags_format = eol.concat(eol, groupedTags[i].placeholder+'start', eol, tags_before, eol, groupedTags[i].placeholder+'stop', eol);
        var placement = this.config.get('pluginsConfig.tags.placement') || 'top';
        if (placement === 'bottom') {
          page.content = page.content.concat(tags_format);
        } else {
          if (page.type === 'markdown') {
            page.content = page.content.replace(/^#\s*(.*?)$/m, '#$1' + tags_format);
          } else {
            page.content = page.content.replace(/^=\s*(.*?)$/m, '=$1' + tags_format);
          }
        }
      }
      
      return page;
    },

    "page": function(page) {
      var groupedTags = this.config.get('pluginsConfig.tags.groups') || [{"placeholder": "tags", "legend": ""}];

      for (var i = 0; i < groupedTags.length; i++) {

        var regStart = new RegExp('(<div class="paragraph">)?\\s*<p>'+groupedTags[i].placeholder+'start<\\/p>\\s*(<\\/div>)?');
        var regStop = new RegExp('(<div class="paragraph">)?\\s*<p>'+groupedTags[i].placeholder+'stop<\\/p>\s*(<\\/div>)?');
        // add tags id and class
        page.content = page.content.replace(regStart, '<!-- tags --><div id="tags" class="tags '+groupedTags[i].placeholder+'">');
        page.content = page.content.replace(regStop, '</div><br /><!-- tagsstop -->');
        page.content = page.content.replace('<strong>ADOCTAGS</strong>', '<i class="fa fa-tags" aria-hidden="true"></i> ');
      }
      return page;
    }
  }
};
