#!/usr/bin/env python
# Name: Leonie Bouma
# Student number: 10898050
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # empty list to hold information about the highest rated movies
    movies = []

    # iterate over the movies
    for movie in dom.find_all("div", {"class": "lister-item-content"}):

        # get movie title
        title = movie.select("h3 a")[0].text

        # get movie rating
        rating = movie.select("strong")[0].text

        # get year of release in numbers only
        release = movie.find("span", {"class": "lister-item-year text-muted unbold"}).text.strip('()I ')

        # get stars
        stars = ', '.join([star.text for star in movie.select("a[href*=_st_]")])

        # get runtime
        runtime = movie.find("span", {"class": "runtime"}).text.strip('min ')

        # add the acquired information to the list of lists with movie information
        movies.append([title, rating, release, stars, runtime])

    # replace an empty string in the lists with movie information with 'missing information'
    for list in range(len(movies)):
        for string in range(len(movies[list])):
            if len(movies[list][string]) < 1:
                movies[list][string] = 'missing information'

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    for movie in range(len(movies)):
        writer.writerow(movies[movie])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)


