# ancestry_dna_match_cvs
Script to inject into Ancestry.com DNA match page to build CSV file with matches linked to their shared matches. Used to import into graph database or visualizer like Gephi.

---

 Usage description I wrote as reply to an [interesting post](https://www.facebook.com/groups/geneticgenealogytipsandtechniques/posts/1310092829454414) on the [Genetic Genealogy Tips & Techniques](https://www.facebook.com/groups/geneticgenealogytipsandtechniques) Facebook group.

- First off, I've only really tested it with Chrome (new Edge is Chrome-based and will work) and Firefox on Windows.
- Make sure you the browser tab is on the  "DNA Matches" page - the main list.

Basically all you need to do is press F12 or CTRL+SHIFT+i to open the developer tools. In there, somewhere at the top, is the "console" tab. Now, you copy the _complete_ script, click in the console to put focus there and paste in the script. It may look a bit crazy to put all that code in there, but it's ok. Then just press enter to run it.

The script will run in the context of the Ancestry web page you have loaded and will run the requests that happen when a) you click a match, and b) click the common matches tab, and it will make a big list of all the results. When it's done, it will make a fake download event to force the browser to pop open the save dialog.

You should copy the script into notepad or another **DUMB** text editor. Don't use Word or anything that tries to be clever by e.g. changing all the quotation marks into fancy angled ones. That will break the script.

At the bottom of the script you can set the DNA size interval you want to fetch. By default the script will fetch all matches between 200 and 3490 cM - but you can change this as you like. Note, the lower you go the more matches it will fetch - the vast majority of matches is in the lower cMs. To save time keep it fairly high until you get things working.

At the top of the script is a "skip list" where you can put match names you don't want to include, e.g. close family members that will mess up the graph.

A little tip is to click the "Raw" button when you view the script file on Github. That will replace the fancy code page with only the file content. Then mark all the content in the tab and copy it to your text editor.

So, once you have your file saved on your drive, you fire up Gephi. You do File->Start new project, then File->Import spreadsheet. Find your CSV file and click open.

For the import:
- Select "COMMA" as separator.
- Leave the "import as" as "ajecency list".
- Click next and then click finish.

Next dialog:
- Select graph type: Undirected
- Edge merge strategy: First
- New workspace selected
- Click OK

Your list will be imported. Click the "Overview" tab at the very top to see the initial graph.

There is now work to be done to "massage" the data to make it look nice. This will not be described here, but there are good resources to be found elsewhere - for instance [this Youtube video](https://www.youtube.com/watch?v=Z2T_7aSL4ng).

Just to get you started you could select the "Force atlas" layout on the lower left, set "repulsion strength" to 10.000 and run it for a while and see what happens 😉

You zoom with the mouse wheel and move around in the graph by holding the right mouse button (assuming right-handed) and dragging around.
