US Poverty Visualizations
Veronica Child and Adam Klein
May 12, 2017


FILE MANIFEST
-------------

 * bar.html: HTML doc that displays the bar graph visualization
 * bar.js: JS code that builds and runs the bar graph visualization

 * map.html: HTML doc that displays the map visualization
 * map.js: JS code that builds and runs the map visualization

 * povertyYoungAdults.csv: CSV file used by the map visualization that contains data attributes taken from PovertyEstimates.xls. Uses area name, total number of people in poverty (POVALL_2015)and total number of 0 - 17 year olds in poverty (POV017_2015) from the original dataset with a new, derived attribute representing the percentage of people in poverty who are 0 - 17 years old (PCT17POV_2015)
 * povertyData.csv: CSV file used by the bar graph visualization that contains data attribetus taken from PovertyEstimates.xls Uses area name, percent of people in poverty (PCTPOVALL_2015)and median income (MEDHHINC_2015)

 * PovertyEstimates.xls: the original dataset downloaded directly from the Census Bureau
 
 * VisStoryReport.pdf: PDF that describe our intent and purpose of our visualizations


OPERATION
---------

    1. In Terminal or another command-line interface, change to the directory containing all the associated files
	2. Start a local server by running the command: python3 -m http.server.
	3. Open up Google Chrome. Navigate to the local host server: http://localhost:8000/.
	4. Select the link "bar.html" to view the bar graph visualization or select the link "map.html" to view the map visualization.
