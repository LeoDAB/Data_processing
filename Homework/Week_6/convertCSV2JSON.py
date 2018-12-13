# Name: Leonie Bouma
# Student number: 10898050

import pandas as pd
import numpy as np

INFILE1 = 'voters.csv'
INFILE2 = 'employment.csv'
OUTPUT = 'data.json'
COLUMNS = ["Country", "Inequality", "Value"]

# Create dataframe from input csv
df_voters = pd.read_csv(INFILE1, sep=',', usecols=COLUMNS)
df_employment = pd.read_csv(INFILE2, sep=',', usecols=COLUMNS)

# Keep dataframe with only total percentage, woman and men percentages
df_voters= df_voters[~df_voters['Inequality'].isin(['High', 'Low'])]
df_employment= df_employment[~df_employment['Inequality'].isin(['High', 'Low'])]

# Create separate columns for each country
df_voters = df_voters.pivot(index='Country', columns='Inequality', values='Value')
df_employment = df_employment.pivot(index='Country', columns='Inequality', values='Value')

# Change column names
df_voters.columns = ['Men_voters', 'Total_voters', 'Woman_voters']
df_employment.columns = ['Men_employed', 'Total_employed', 'Woman_employed']

# Concatenate the separate dataframes into one
df_data = pd.concat([df_voters, df_employment], axis=1)
df_data['country'] = df_data.index
df_data.reset_index(level=0, inplace=True)

# Convert the dataframe to a JSON
#df_data.set_index('Country', inplace=True)
df_data.to_json(OUTPUT, orient='index')

print(df_data)