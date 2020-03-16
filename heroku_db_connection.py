import os
import psycopg2
import urllib


def set_up_connection():

    urllib.parse.uses_netloc.append('postgres')

    url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))

    connection = psycopg2.connect(

        database=url.path[1:],

        user=url.username,

        password=url.password,

        host=url.hostname,

        port=url.port

    )

    return connection
