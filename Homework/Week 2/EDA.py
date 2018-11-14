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
    Note that calculating statistics with pandas always excludes NaN values.
    Therefore, missing values and unknowns are replaced with an NaN instead of
    deleting the complete row. The countries are still represented in the
    dataframe.
    :param infile: input csv
    :return: cleaned dataframe
    """
    # Create dataframe from csv with only the useful columns
    df = pd.read_csv(infile, usecols=COLUMNS)

    # Remove excess white spaces from the region column
    df['Region'] = df['Region'].str.strip()

    # Replace empty strings and 'unkown' with NaN and ',' in floats to '.'
    # also omit 'dollars' in GDP
    df[COLUMNS] = df[COLUMNS].replace({'':np.nan, 'unknown':np.nan,
                                       ',':'.', ' dollars':''}, regex=True)

    # Values from numeric columns are modified to a float
    columns= ['Pop. Density (per sq. mi.)','Infant mortality (per 1000 births)',
              'GDP ($ per capita) dollars']
    for col in columns:
        df[col] = df[col].astype('float64')

    return df

def central_tendancy(column):
    """
    Within this function the central tendancy is calculated of a dataframe
    column. Some additional information is given in Visual_Analysis.txt
    :param column: dataframe column for calculations
    :return: mean, meadian, mode and standard deviation of the column
    """

    # Determine the outlier, based on initial histogram plots an outlier
    # was spotted: see Visual_Analysis.txt
    outlier = df[df['GDP ($ per capita) dollars'] >
                 df['GDP ($ per capita) dollars'].mean()
                 + 3 * df['GDP ($ per capita) dollars'].std()]

    out_GDP = outlier['GDP ($ per capita) dollars'][193]

    # Calculate the multiple measures of indicating the central tendancy
    mean_col = round(column[column < out_GDP].mean(), 2)
    median_col = column[column < out_GDP].median()
    mode_col = column[column < out_GDP].mode()
    std_col = round(column[column < out_GDP].std(), 2)

    # Histograms of the GDP, the second subplot excludes the outlier Suriname
    fig, axs = plt.subplots(1, 2)
    column.hist(ax=axs[0], bins=20, rwidth=0.9)
    column.hist(ax=axs[1], bins=20,
                range=(column.min(),column[column < out_GDP].max()), rwidth=0.9)
    fig.suptitle('GDP from countries worldwide', fontsize=14)
    fig.text(0.5, 0.04, 'GDP: dollars($) per capita', ha='center')
    fig.text(0.04, 0.5, 'frequency', va='center', rotation='vertical')
    plt.show()

    return mean_col, median_col, mode_col[0], std_col

def five_num_sum(column):
    """
    Here the five numbers summary is calculated for a dataframe column.
    :param column: dataframe column
    :return: minimum, first quantile, median, third quantile, maximum of a column
    """

    # Calculate the descriptive statistics: the five number summary
    min_col = column.min()
    FQ = column.quantile(q=0.25)
    median_col = column.median()
    TQ = column.quantile(q=0.75)
    max_col = column.max()

    # Create a boxplot
    boxplot = df.boxplot(column='Infant mortality (per 1000 births)')
    boxplot.plot()
    plt.title('Boxplot representing Infant mortality of countries world wide',
              fontsize=12)
    plt.ylabel('Count')
    plt.show()

    return min_col, FQ, median_col, TQ, max_col

def JSON(df):
    """
    create a JSON file from a dataframe.
    :param df: input dataframe
    """
    # Convert the dataframe to a JSON, country is the index
    df.set_index('Country', inplace=True)
    df.to_json(OUTPUT_JSON, orient='index')


if __name__ == "__main__":
    # Put the iput csv in a dataframe and clean for usage
    df = clean_df(INPUT_CSV)

    # Calculate the central tendancy of the GDP column and create a histogram
    mean_GDP, median_GDP, mode_GDP, std_GDP = \
        central_tendancy(df['GDP ($ per capita) dollars'])
    print(f'Mean of GDP per capita: {mean_GDP}')
    print(f'Median of GDP per capita: {median_GDP}')
    print(f'Mode of GDP per capita: {mode_GDP}')
    print(f'Standard Deviation of GDP per capita: {std_GDP}')

    # Get the 5 numbers summary and a boxplot of the infant mortality column
    infant_min, infant_FQ, infant_med, infant_TQ, infant_max = \
        five_num_sum(df['Infant mortality (per 1000 births)'])

    # Print 5-number summary
    print(f'Minimum of infant deaths per 1000 births in a country: {infant_min}')
    print(f'First quartile of infant deaths per 1000 births: {infant_FQ}')
    print(f'Median of infant deaths per 1000 births: {infant_med}')
    print(f'Third quantile of infant deaths per 1000 births: {infant_TQ}')
    print(f'Maximum of infant deaths per 1000 births in a country: {infant_max}')

    # Create a JSON file for the data
    JSON(df)





