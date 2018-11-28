# Name: Leonie Bouma
# Student number: 10898050

import pandas as pd

INFILE = 'KNMI_rain.txt'
OUTPUT = 'KNMI_rain.json'
# Ik wil een JSON voor station de Bilt met datum als key en RH als value
df = pd.read_csv(INFILE, sep=',', skiprows=12, header=None, names=['station', 'date', 'rain (0.1 mm)']) # , skipinitialspace=True geeft floats

# Convert the dataframe to a JSON, country is the index
df.set_index('date', inplace=True)
df.to_json(OUTPUT, orient='index')


