# CapstoneKSU2021
2021 Capstone GA Grades Map Web Application
--------------------------------------------------------------------------------------------------------------------
Live site at: Live site at :https://baileyknez.azurewebsites.net/Capstone/CapstoneHTML.html

Does not represent our current progress. What is currently in the GitHub is the latest version. 
------------------------------------------------------------------------------------------------------------------

We are currently in Phase 2. Please Complete two tasks or more tasks each. Nobody here has a lot of experience with Javascript/Jquery and will be a learning experience for everyone. There is too much to do for everyone to only focus on one item. If you need help feel free to ask and there are a lot of great resources out there to help you learn. 
-
Phase One(set up)
1. Build out the UI design.
2. Set up the Github.
3. Build the HTML,CSS, and JS files.
4. set up live website.
5. figure out google API/georgia grades API.
6. outline the html, css, and js pages and set up website.
7. outline georgia and set up GeoJson.

Phase Two(Google Maps with schools)
1. Georgia Grades data needs to be parsed.
2. Districts need to be set in the options lists(we can do this dynamically).
3. Search function needs to work.
4. Markers need to be added and unadded to the map with data about the school name and HREF to more information about the school.
5. A list of all the searched schools need to pop up next to the map, each with the same link to more information.
6. The buttons for the school grade need to be set up. 
7. When a new search happens all of the old data needs to be taken off the screen. 
8. style the header/ logo to make it look professional. 

Phase Three(School detail page)
1. Hide everything when a URL is selected. 
2. Query the schools information onto the HTML using JS mustache.
3. Find cool ways to desplay the statical data.
4. show the data that was selected.
5. be able to go back to the map and search page.
6. Style the page to make it look professional.
7. be able to search a different school from this page and have the maps page pop up. 


-
General To do list
1.	Schoolgrades API needs to be figured out. I keep getting CORS policy errors. If unable to be fixed we might have to make our own API or find another way to use the data through the files. I have made a JSON file with all of the data or we have a CVS file depending on whats easiest. we HAVE to figure this out before anything else can get done. 
2.	School districts need to be taken and outlined on the map with googles API and Schoolgrades API.  I have Georgia outlined with the shape.geojson file. In order to add the outline the file MUST be geojson and follow the google API requirements. I have a file with 150 geojson files with all of the school districts but we would have to go through and add the google maps API requirements.
3.	A function to put all of the schools on the map with markers and a list of those schools on the side needs to be made. This would use both APIs. I have made the base function to put markers on the map but it is useless without the School API. 
4.	All of the search bars and buttons to change search settings need to gain functionality. 
5.	When you click on a school everything needs to disappear and all of the school information needs to pop up in an organized matter. This will use mainly the School Grades API and Javascript mustache. That page still needs to be built out. This one will take a long time. 
6.	The aesthetics of the page need a make over and new styling. It needs a new color set, button look, and logo redesign. It needs to look good and be professional. This will have to be done for both pages. The Map and The  School Details. 

--------------------------------------------------------------------------------------------------------------------------

RECOURCES

-------------------------------------------------------------------------------------------------------------------------

Google API/Georgia School Grades Resources

What our site is supposed to look like and function like:
https://www.greatschools.org/school-district-boundaries-map/

Georgia school dataset/API
https://www.greatschools.org/school-district-boundaries-map/

Google MAP API documentation
https://developers.google.com/maps/documentation/javascript/overview

Google MAP GeoJson reference 
https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection

Google API working with the map reference 
https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons

-----------------------------------------------------------------------------------------------------------------

Youtube Tutorials

JavaScript Turtials
https://youtube.com/playlist?list=PL0eyrZgxdwhxNGMWROnaY35NLyEjTqcgB

Javascript templating(Mustache.js)
https://www.youtube.com/watch?v=X8wh6_rdqi0

https://www.youtube.com/watch?v=mguNnJP5drw&t=504s

JQuery Library(simplifies javascript)
https://youtube.com/playlist?list=PL0eyrZgxdwhy7byLHsVkuhtRV_IpoJU7n

HTML & CSS Tutorials
https://youtube.com/playlist?list=PL0eyrZgxdwhwNC5ppZo_dYGVjerQY3xYU

JSON Files
https://www.youtube.com/watch?v=6I3qMe-jXDs

https://www.youtube.com/watch?v=uxf0--uiX0I&t=210s

APIs
https://www.youtube.com/watch?v=cuEtnrL9-H0
