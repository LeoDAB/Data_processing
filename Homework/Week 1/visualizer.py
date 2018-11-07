# Name: Leonie Bouma
# Student number: 10898050
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

def average(dict):
    """
    calculate the average ratings and save them in the global dictionary. The method that is used is explained at:
    https://stackoverflow.com/questions/30687244/python-3-4-how-to-get-the-average-of-dictionary-values
    :param dictionary: dictionary with values that need to be averaged
    :return: updated global dictionary
    """
    for year, ratings in data_dict.items():
        data_dict[year] = round(sum(ratings) / float(len(ratings)), 2)

    return data_dict


def get_lists(dict):
    """
    Split a dictionary into two separate lists for keys and values
    :param dictionary: the dictionary that needs to be split into two separate lists
    :return: two seperate lists for the keys and values as year and rating
    """
    year = list(data_dict.keys())
    rating = list(data_dict.values())

    return year, rating


def plotting(x, y):
    """
    plot a graph, using matplotlib, to visualize the data and see which year had better movies on average
    :param x: list for x-axis values
    :param y: list for y-axis values
    """

    # plot a graph
    plt.plot(x, y, 'bs-', )

    # ad textual information
    plt.ylabel('average rating')
    plt.xlabel('year')
    plt.title('IMBD 50 highest rated movies 2008 until 2018: the average rating per year')

    # annotate the year with the highest average rating
    ymax = max(y)
    xmax = x[y.index(ymax)]
    plt.annotate("2016: year with greatest movies", fontsize=8, color='purple',
                 xy=(xmax, ymax), xytext=(5.5, ymax + 0.0065))

    # show plot
    plt.show()


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


if __name__ == "__main__":
    # add the necessary data to the global dictionary
    read_csv()

    # calculate the average movie rating per year
    average(data_dict)

    # create the lists needed for a plot
    year, rating = get_lists(data_dict)

    # plot average rating against the years
    plotting(year, rating)


