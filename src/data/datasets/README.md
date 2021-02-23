# Data Management

Our data is structured in terms of events, places and characters, with the source of truth being the [Lotr Timeline](https://docs.google.com/spreadsheets/d/1jjK2k4YQfwzXMNRvTeVkhbjVtklHxEd5lfmManNPYm8/edit#gid=0) spreadsheet in our project drive folder.

The data client expects the datasets to be in JSON format, so the spreadsheets need to be converted from CSV to JSON using some process, we have been using [this online tool](https://csvjson.com/csv2json).

## Datasets
Following are descriptions of the attributes of each record in the different data classes after processing.

### Characters
- id: Integer, unique identifier
- color1: String, the primary color for a character in hexcode format 
- color2: String, the secondary color for a character in hexcode format
- name: String, the name of the character
- events: Integer[], a list of eventIds that the character are associated to

### Events
- id: Integer, unique identifier 
- name: String, the name of the even
- placeId: Integer, the id of the place where the event took place
- date: String, the date string identifying when the event occured
- chapter: Integer, the chapter number in which the event occurred
- description: String, description of the event

### Places
- id: unique identifier
- name: String, name of the event
- x: Integer, x position on the svg map
- y: Integer, y position on the svg map