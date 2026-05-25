from sqlalchemy import create_engine

# MySQL Connection
engine = create_engine(
    "mysql+pymysql://root:Messi3010@localhost/spotify_dashboard"
)

print("MySQL Connected Successfully!")