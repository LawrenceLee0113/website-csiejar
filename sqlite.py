import os
import sqlite3

class sqlite_tool:
    def __init__(self,DATABASE):
        self.db = sqlite3.connect(DATABASE)
        self.cursor = self.db.cursor()
    def command(self,sql_str):
        self.cursor.execute(sql_str)
        a = self.cursor.fetchall()
        self.db.commit()

        # self.db.close()
        return a
    def insert(self,databaseName,data):
        
        
        self.cursor.executemany(f"INSERT INTO {databaseName} VALUES(?, ?)", data)
        
        self.db.commit()
        # self.db.close()
    def leave(self):
        self.db.close()
    """
        UPDATE table_name SET colname = "Rogers" where colname = 2
        DELETE FROM table_name WHERE column_name = "value";
        select column_name from table_name
        INSERT INTO table_name
        VALUES (value1, value2, value3...);
    """
# DATABASE = 'sqlite/csiejar.db'
# db = sqlite_tool(DATABASE)
# print(db.command("select * from signup_auth;"))
# db.insert("signup_auth",[('test','test'),('test2','test2')])
# db.command("""UPDATE signup_auth SET uuid = "testtest" where mail = "test";""") # update specific data
# db.command("""DELETE FROM signup_auth WHERE mail = "test";""")#delete specific row
# db.command("""DELETE FROM signup_auth WHERE 1;""")#delete all

# print(db.command("select * from signup_auth;"))