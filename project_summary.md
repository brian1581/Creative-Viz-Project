### Overview
Our goal was to show a breakdown by neighborhood of AirBNB listings by review and mean cost through a series of charts. We aimed to show this as a time series from 2015-19. In addition, our original goal was to show the time series relationship by neighborhood with the long-term rental and home values on this time set. We would do this by creating a SQL database, use a flask app to jsonify the data and then read the data through D3 into charts through a website. Our goal was to also create a leaflet map as well to show clusters by neighborhood of the number of reviews by neighborhood.

### File and Guideline
etl.ipynb is where we started the ETL process via SQL Alchemy. We took the CSVs we found through Data World and Zillow and created three SQL tables in a database called airbnb_db (rentals listings and airbnb). We did not need to create any views in the SQL database as our aim was to review all the data.

- CSVs are in the Resources folder
- HTML pages are in the templates folder
- CSS and JS in the static folder

The flask app is airbnb_app.py. We are using it to render on landing2.html with the chart coming from rentals_listings_d3.js

### Limitations
Some of the primary limitations we found with our datasets were that the AirBNB, Home Listing Values and Rental Values had different amounts of neighborhood data. For example, the rental data had twice as many listed neighborhoods. In addition, some of the data was unavailable for some of the months listed and reflects as zero. It was also pointed out that reviewing this as a mean or median listing can be difficult given that each neighborhood has a different number of rentals and listings. We realized a time series line chart would not work given the dozens of neighborhoods we found as well.

We wanted to be able to host our project on Heroku, however, the size of our Postgres database was too large for a free database through Heroku.  We attempted to change how the data is stored and limit the rows to be able to add to Heroku, however, time limitations prevented us from being able to finish this aspect.

### After Action Review

One area to improve would be to clean or remove all the data which has a value of zero. In addition, we would add a slider to the AirBNB Listing v Rent/Own chart.
The questions that we wanted to answer according to our proposal are
1. Is popularity of portland AirBNB increasing with time, 2015 to 2019? 
* For this, we used airbnb review trend over years. 
2. How is the average price of portland AirBNB changing over time?
* To plot average price of portland AirBNB changing over time , to make the graph informative we had to find mean price in each year.
3. Compare prices of AirBNB and house listing prices over time.
* We used d3.js to plot all the graphs.Combining different persons codes to single .js file was also a challenge. 

Leaflet library is used to get the map on our web page.  Marker clusters were used to show density of listings for the most recent data we have available.  Neighborhood boundaries were included to be able to see visually which neighborhood a listing was in.  Pie charts were added to neighborhoods to show the distribution of room types available in that neighborhood.
