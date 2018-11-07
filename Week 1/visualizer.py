# Name: Leonie Bouma
# Student number: 10898050
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


def read_csv():
    """
    read input movies.csv and save the rating values per year in the global dictionary
    """
    # read the csv file as a dictionary
    with open(INPUT_CSV, newline='') as moviefile:
        reader = csv.DictReader(moviefile)

        # add the ratings to the value list of a corresponding year in data_dict
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))

def movielist(dictionary):
    """
    Create a list for the keys and the values
    :param dictionary: dictionary that needs to be split into two seperate lists
    :return: seperate lists as year and average
    """

    # calculate the average rating per year
    ratings = list(data_dict.values())
    ratings = [[float(value) for value in list] for list in ratings]
    average = []
    for list in range(len(ratings)):
        avgRating = 0
        for value in range(len(ratings[list])):
            avgRating = avgRating + ratings[list][value]
        avgRating = round(avgRating / float(len(ratings[list])), 1)
        average.append(avgRating)
    print(average)

    # year input for graph has to be a list
    year = list(data_dict.keys())

    return year, average

def plotting(x, y):
    """
    plot a graph to visualize the data and see which years had better movies on average
    :return:
    """
    # plot a graph
    plt.plot(x, y, 'bs-',)
    plt.ylabel('average rating')
    plt.xlabel('year')
    plt.title('The average rating of movies for a year between 2007 and 2017')

    plt.show()

if __name__ == "__main__":

    read_csv()
    year, average = lists(data_dict)

    plotting(year, average)



