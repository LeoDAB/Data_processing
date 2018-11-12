# Name: Leonie Bouma
# Student number: 10898050

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
pd.set_option("display.max_columns", 10)
pd.set_option("display.max_rows", 1000)

INPUT_CSV = "input.csv"
OUTPUT_JSON = "EDA.json"
COLUMNS = ['Country', 'Region', 'Pop. Density (per sq. mi.)',
               'Infant mortality (per 1000 births)',
               'GDP ($ per capita) dollars']

def clean_df(infile):
    """
    Note that calculating statistics with pandas always excludes NaN values. Therefore, missing values and unknowns
    are replaced with an NaN instead of deleting the complete row. The countries are still represented in the dataframe.

    :param infile:
    :return:
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

    meanCol = round(column.mean(), 2)
    medianCol = column.median()
    modeCol = column.mode()
    stdCol = round(column.std(), 2)

    # Histogram of the GDP per capita
    hist = column.hist(bins=20)
    hist.plot()
    plt.title('GDP from countries worldwide', fontsize=12)
    plt.ylabel('frequency')
    plt.xlabel('GDP: dollars($) per capita')
    plt.show()

    return meanCol, modeCol, medianCol, stdCol

def JSON(df):

    # Convert all data into a JSON file, taking country as index
    df.set_index("Country", inplace=True)
    df.to_json(OUTPUT_JSON, orient="index")

if __name__ == "__main__":
    # add the necessary data to the global dictionary
    df = clean_df(INPUT_CSV)
    meanGDP, medianGDP, modeGDP, stdGDP = central_tendancy(df['GDP ($ per capita) dollars'])
    JSON(df)

    print(f"Mean of GDP: {meanGDP}")
    print(f"Median of GDP: {medianGDP}")
    print(f"Mode of GDP: {modeGDP}")
    print(f"Standard Deviation of GDP: {stdGDP}")


