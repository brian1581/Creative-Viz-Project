

function createChart(air, rent, own) {

}

function checkHoods(data) {
    return 
}


d3.json("/data/airbnb",function(airbnbData) {
    d3.json("/data/rentals", function(rentalData){
        d3.json("/data/listings", function(listingData){
            console.log(airbnbData);
            console.log(rentalData);
            console.log(listingData);
            createChart(airbnbData,rentalData,listingData)

            var neighborhoods = []
            listingData.forEach(own => {
                console.log(own.Neighborhood);
                hood = own.Neighborhood;
                if (neighborhoods.includes(hood)) {
                    console.log(`${hood} is in there`);
                } else {
                    neighborhoods.push(hood);
                    console.log(`${hood} was added`);
                };
            });


            var filteredAir = airbnbData.filter(item => neighborhoods.includes(item.neighbourhood));
            console.log(filteredAir);

            var grouped = filteredAir.groupBy('neighbourhood', price);
            console.log(grouped);

            var filteredRent = rentalData.filter(item => neighborhoods.includes(item.Neighborhood));
            


        })
    })
});
