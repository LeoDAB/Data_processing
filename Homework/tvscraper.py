#!/usr/bin/env python
# Name: Leonie Bouma
# Student number: 10898050
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM, plaintext, Element

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # create an empty list to save serie info in
    series = []

    # start iterating over each serie
    for serie in dom.by_tag('div.lister-item-content'):

        # get title from the serie
        title = serie.by_tag('a')[0].content

        # encode with utf-8 to be able to write info into csv file
        title = title.encode("utf-8")

        # get the rating of the serie
        rating = serie.by_tag("strong")[0].content

        # get the genre of the serie and strip al white spaces
        genre = serie.by_tag("span.genre")[0].content
        genre = genre.strip()

        # get the main actors/actresses in the serie in a csv string
        stars = ""
        for star in serie.by_tag('p')[2].by_tag('a'):
            stars = stars + star.content + ', '

        # remove last comma and space and encode with utf-8 to be able to write info into csv file
        stars = stars[:-2]
        stars = stars.encode("utf-8")

        # get the runtime of the serie
        runtime = serie.by_tag('span.runtime')[0].content
        runtime = runtime.split(' ', 1)[0]

        # put all obtained info in series info list as a list
        series.append([title, rating, genre, stars, runtime])

    # return this info list to be used for the csv file
    return series


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write tvseries into the csv file
    for serie in range(len(tvseries)):
        writer.writerow(tvseries[serie])

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)