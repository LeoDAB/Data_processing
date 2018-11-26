# Name: Leonie Bouma
# Student number: 10898050

import pandas as pd
import numpy as np

INFILE = 'data.csv'
OUTPUT = 'data.json'
COLUMNS = ['LOCATION', 'MEASURE', 'TIME', 'Value']

# Create dataframe from input csv
data = pd.read_csv(INFILE, sep=',', usecols=COLUMNS)

# Replace empty strings and 0 with NaN
data[COLUMNS] = data[COLUMNS].replace({'':np.NaN, '0':np.NaN})

# Create a dataframe with the mean values for KTOE and PC_PRYENRGSUPPLY for each location
df = data.groupby(['LOCATION', 'MEASURE'])['Value'].mean().unstack(level=-1)

# Convert the dataframe to a JSON
df.to_json(OUTPUT, orient='index')


