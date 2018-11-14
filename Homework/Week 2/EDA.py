# Name: Leonie Bouma
# Student number: 10898050

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

INPUT_CSV = "input.csv"
OUTPUT_JSON = "EDA.json"
COLUMNS = ['Country', 'Region', 'Pop. Density (per sq. mi.)',
               'Infant mortality (per 1000 births)',
               'GDP ($ per capita) dollars']

def clean_df(infile):
    """
    Note that calculating statistics with pandas always excludes NaN values. Therefore, missing values and unknowns
    are replaced with an NaN instead of deleting the complete row. The countries are still represented in the dataframe.
    :param infile: input csv
    :return: cleaned dataframe
    """
    # create dataframe from csv with only the useful columns
    df = pd.read_csv(infile, usecols=COLUMNS)

    # remove excess white spaces from the region column
    df['Region'] = df['Region'].str.strip()

    # replace empty strings and 'unkown' with NaN and ',' in floats to '.' also omit 'dollars' in GDP
    df[COLUMNS] = df[COLUMNS].replace({'':np.nan, 'unknown':np.nan, ',':'.', ' dollars':''}, regex=True)

    # values from numeric columns are modified to a float for the statical calculations
    columns= ['Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']
    for col in columns:
        df[col] = df[col].astype('float64')

    return df

def central_tendancy(column):
    """
    Within this function the central tendancy is calculated of a dataframe column. Some additional information is
    given in Visual_Analysis.txt
    :param column: dataframe column for calculations
    :return: mean, meadian, mode and standard deviation of the column
    """

    # determine the outlier, based on initial histogram plots an outlier was spotted: see Visual_Analysis.txt
    outlier = df[df['GDP ($ per capita) dollars'] > df['GDP ($ per capita) dollars'].mean()
                  + 3 * df['GDP ($ per capita) dollars'].std()]
    outGDP = outlier['GDP ($ per capita) dollars'][193]

    # calculate the multiple measures of indicating the central tendancy
    meanCol = round(column[column < outGDP].mean(), 2)
    medianCol = column[column < outGDP].median()
    modeCol = column[column < outGDP].mode()
    stdCol = round(column[column < outGDP].std(), 2)

    # Histograms of the GDP per capita, the second subplot excludes the outlier Suriname
    fig, axs = plt.subplots(1, 2)
    column.hist(ax=axs[0], bins=20, rwidth=0.9)
    column.hist(ax=axs[1], bins=20, range=(column.min(), column[column < outGDP].max()), rwidth=0.9)
    fig.suptitle('GDP from countries worldwide', fontsize=14)
    fig.text(0.5, 0.04, 'GDP: dollars($) per capita', ha='center')
    fig.text(0.04, 0.5, 'frequency', va='center', rotation='vertical')
    plt.show()

    return meanCol, medianCol, modeCol, stdCol

def five_num_sum(column):
    """

    :param column:
    :return:
    """

    # calculate the descriptive statistics: the five number summary
    minimum = column.min()
    FQ = column.quantile(q=0.25)
    medianCol = column.median()
    TQ = column.quantile(q=0.75)
    maximum = column.max()

    # create a boxplot
    boxplot = df.boxplot(column='Infant mortality (per 1000 births)')
    boxplot.plot()
    plt.title('Infant mortality of countries world wide', fontsize=12)
    plt.ylabel('Count')
    plt.show()


    return minimum, FQ, medianCol, TQ, maximum

def JSON(df):
    """

    :param df:
    :return:
    """
    # convert the dataframe to a JSON, country is the index
    df.set_index('Country', inplace=True)
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":
    # put the iput csv in a dataframe and clean for usage
    df = clean_df(INPUT_CSV)

    # calculate the central tendancy of the GDP column and create a histogram
    meanGDP, medianGDP, modeGDP, stdGDP = central_tendancy(df['GDP ($ per capita) dollars'])
    print(f"Mean of GDP: {meanGDP}")
    print(f"Median of GDP: {medianGDP}")
    print(f"Mode of GDP: {modeGDP}")
    print(f"Standard Deviation of GDP: {stdGDP}")

    # calculate the 5 numbers summary and create a boxplot of the infant mortality column
    infantMin, infantFQ, infantMed, infantTQ, infantMax = five_num_sum(df['Infant mortality (per 1000 births)'])
    # Print 5-number summary
    print('Min: %.3f' % infantMin)
    print('Q1: %.3f' % infantFQ)
    print('Median: %.3f' % infantMed)
    print('Q3: %.3f' % infantTQ)
    print('Max: %.3f' % infantMax)

    # create a JSON file for the data
    JSON(df)





