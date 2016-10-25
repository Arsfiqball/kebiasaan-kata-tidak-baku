#!/usr/bin/env node
var program = require('commander');
var PO = require('pofile');
var fs = require('fs');

var words = require('./words');

function checkFile(file) {
  console.log("Memuat file "+file+"\n");
  PO.load(file, function (err, po) {
    console.log("Menganalisa...\n");

    var i, j, k;
    var bugCount = 0;
    var regex;
    var text;

    for (i = 0; i < po.items.length; i++) {
      for (j = 0; j < words.length; j++) {
        regex = words[j].regex;
        text = " "+po.items[i].msgid+" ";

        if (regex.test(text)) {
          console.log("# "+words[j].info);
          console.log("# Kesalahan pada msgid:");
          console.log("\""+po.items[i].msgid+"\"\n");
          bugCount++;
        }

        for (k = 0; k < po.items[i].msgstr.length; k++) {
          text = " "+po.items[i].msgstr+" ";

          if (regex.test(text)) {
            console.log("# "+words[j].info);
            console.log("# Kesalahan pada msgstr:");
            console.log("\""+po.items[i].msgstr+"\"\n");
            bugCount++;
          }
        }
      }
    }
    console.log("Total: "+bugCount+" kesalahan ditemukan.");
  });
}

program
 .arguments('<file>')
 .option('-k, --kata <word>', 'Kata yang ingin dicari', function (word) {
  words = [word];
 })
 .action(checkFile)
 .parse(process.argv);
