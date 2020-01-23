#!/usr/bin/env python
# coding: utf-8

# In[2]:


# dependencies
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import numpy as np
import getpass
import os
from datetime import datetime as dt
import glob


# ### Zillow Data Processing

# In[3]:


listing_file = 'Resources/median_list_price.csv'
listing_df = pd.read_csv(listing_file, encoding='latin1')
listing_df.head()


# In[4]:


port_listings = listing_df.loc[(listing_df['State']=='OR')]

port_listings2 = port_listings.loc[(port_listings['City']=='Portland')]

nbrhd_listings = port_listings2.drop(['State', 'Metro', 'CountyName', 'SizeRank'], axis=1)

final_nbrhd = nbrhd_listings.rename(columns={"RegionName": "Neighborhood"})

# listings_round = nbrhd_rename['2015-01', '2015-02','2015-03'].astype('int64')

final_nbrhd.fillna(0, inplace=True)

final_nbrhd

for col in final_nbrhd.columns[2:]:
    final_nbrhd[col] = final_nbrhd[col].astype('int64')

final_nbrhd


# In[5]:


renting_file = 'Resources/zillow_neighborhood_rent.csv'
renting_df = pd.read_csv(renting_file, encoding='latin1')
renting_df.head()


# In[6]:


renting_df = renting_df.loc[(renting_df['State']=='OR')]

renting_df = renting_df.loc[(renting_df['City']=='Portland')]

rental_listings = renting_df.drop(['State', 'Metro', 'CountyName', 'SizeRank', 'RegionID'], axis=1)

rental_rename = rental_listings.rename(columns={"RegionName": "Neighborhood"})

rental_rename


# In[7]:


cols = rental_rename.columns[:2].tolist()
cols_df = cols.append(rental_rename.columns[54:].tolist())


# In[8]:


cols = rental_rename.columns.tolist()


# In[9]:


new_cols = cols[:2] + cols[54:]


# In[10]:


new_rental = rental_rename[new_cols]


# In[11]:


final_rental = new_rental.fillna(0)

for col in new_rental.columns[2:]:
    final_rental[col] = final_rental[col].astype('int64')

final_rental


# In[12]:

connect_string = os.environ.get("DATABASE_URL")

# p = getpass.getpass(prompt="Password: ")
# rds_connection_string = f"postgres:{p}@localhost:5432/airbnb_db"
# engine = create_engine(f'postgresql://{rds_connection_string}')
# DATABASE_URL = "postgres://gtttqtxcivlqiv:2af955aeb6ab9bae63664bf73ab76e524ad55b3296e7c22e773536ed1d75f357@ec2-3-224-165-85.compute-1.amazonaws.com:5432/d4cjuuq2jmullg"
engine = create_engine(connect_string)

# In[13]:


engine.table_names()


# In[14]:


final_nbrhd.to_sql(name='listings', con=engine, if_exists='replace', index=True)


# In[15]:


final_rental.to_sql(name='rentals', con=engine, if_exists='replace', index=True)


# In[16]:


pd.read_sql_query('select * from listings', con=engine).head()


# In[17]:


pd.read_sql_query('select * from rentals', con=engine).head()


# ### Airbnb Data Proessing

# In[23]:


airbnb_files = []
for file in os.listdir("Resources"):
    if file.startswith("listing"):
        airbnb_files.append(file)
cols = ["date","id","name","neighbourhood","latitude","longitude","room_type","price","number_of_reviews","reviews_per_month"]


# In[27]:


df = pd.DataFrame()
for file in airbnb_files:
    date = (file.split("(")[1].split(")")[0])
    temp = pd.read_csv("Resources/"+file)[cols[1:]]
    temp["date"] = dt.strptime(date, "%b %d %Y").strftime("%Y-%m-%d")
    df = pd.concat([df,temp[cols]])
    


# In[28]:


df.head()


# In[29]:


df.to_csv("data/All_airbnb_listings.csv",sep=",",index=False)


# In[30]:


df.head()


# In[31]:


sorted_airbnb = df.sort_values(
    ["id", "date"], ascending=True).reset_index(drop=True)
sorted_airbnb.head(15)


# In[32]:


reviews = 0
current_id = 0
review_col = []
for i,row in sorted_airbnb.iterrows():
    if sorted_airbnb["id"].iloc[i] != current_id:
        current_id = sorted_airbnb["id"].iloc[i]
        reviews = sorted_airbnb["number_of_reviews"].iloc[i]
    else:
        reviews = sorted_airbnb["number_of_reviews"].iloc[i] - sorted_airbnb["number_of_reviews"].iloc[i-1]       
    
    review_col.append(reviews)


# In[33]:


sorted_airbnb['reviews'] = review_col


# In[34]:


sorted_airbnb.to_sql("airbnb_portland",con=engine,index=False, if_exists="replace")


# In[35]:


engine.execute("SELECT * FROM airbnb_portland").fetchall()


# In[36]:


sorted_airbnb.columns


# In[44]:


mean_airbnb = sorted_airbnb[['date','neighbourhood','price']].groupby(["neighbourhood","date"]).mean().reset_index()


# In[48]:


pivot_airbnb = mean_airbnb.pivot(index="neighbourhood", columns="date", values="price").fillna(0)


# In[ ]:




