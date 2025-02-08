import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
connection = sqlite3.connect("Startup.db")
cursor = connection.cursor()

# Create EmployeeTable
table_info = """
CREATE TABLE IF NOT EXISTS EmployeeTable (
    EmpID TEXT PRIMARY KEY,
    Name TEXT,
    Age INTEGER,
    Role TEXT,
    TeamID INTEGER
);
"""
cursor.execute(table_info)

# Create Teams Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS Teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    teamIcon TEXT,
    manager_id TEXT NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES EmployeeTable(EmpID)
);
""")

# Create TeamMembers Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS TeamMembers (
    team_id INTEGER NOT NULL,
    member_id TEXT NOT NULL,
    PRIMARY KEY (team_id, member_id),
    FOREIGN KEY (team_id) REFERENCES Teams(id),
    FOREIGN KEY (member_id) REFERENCES EmployeeTable(EmpID)
);
""")

# Create Projects Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS Projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    location TEXT NOT NULL,
    client_name TEXT NOT NULL,
    team_id INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Teams(id)
);
""")
# Insert data into EmployeeTable
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP001', 'Tony Stark', 45, 'CEO', 1)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP002', 'Steve Rogers', 38, 'Manager', 1)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP003', 'Bruce Banner', 40, 'Employee', 1)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP004', 'Natasha Romanoff', 35, 'HR', 2)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP005', 'Clint Barton', 39, 'Employee', 2)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP006', 'Peter Parker', 25, 'Employee', 2)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP007', 'Wanda Maximoff', 30, 'HR', 3)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP008', 'Vision', 35, 'Manager', 3)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, TeamID) VALUES ('EMP009', 'Sam Wilson', 33, 'Employee', 3)")

# Insert data into Teams (only 3 teams)
cursor.execute("INSERT INTO Teams (name, teamIcon, manager_id) VALUES ('Cloud Engineering', 'cloud_icon.png', 'EMP002')")
cursor.execute("INSERT INTO Teams (name, teamIcon, manager_id) VALUES ('Cyber Security', 'security_icon.png', 'EMP008')")
cursor.execute("INSERT INTO Teams (name, teamIcon, manager_id) VALUES ('Data Science', 'data_icon.png', 'EMP002')")

# Insert data into TeamMembers (distribute employees properly)
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (1, 'EMP001')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (1, 'EMP002')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (1, 'EMP003')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (2, 'EMP004')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (2, 'EMP005')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (2, 'EMP006')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (3, 'EMP007')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (3, 'EMP008')")
cursor.execute("INSERT INTO TeamMembers (team_id, member_id) VALUES (3, 'EMP009')")

# Insert data into Projects (only 3 projects assigned to teams)
cursor.execute("INSERT INTO Projects (project_name, location, client_name, team_id) VALUES ('Cloud Migration', 'New York', 'Amazon', 1)")
cursor.execute("INSERT INTO Projects (project_name, location, client_name, team_id) VALUES ('Cyber Defense', 'Washington DC', 'NSA', 2)")
cursor.execute("INSERT INTO Projects (project_name, location, client_name, team_id) VALUES ('AI Research', 'San Francisco', 'Google', 3)")

print("\nThe inserted employee records are:")
data = cursor.execute("SELECT * FROM EmployeeTable")
for row in data:
    print(row)

# Display All Records from Teams Table
print("\nThe inserted team records are:")
data = cursor.execute("SELECT * FROM Teams")
for row in data:
    print(row)

# Display All Records from Projects Table
print("\nThe inserted project records are:")
data = cursor.execute("SELECT * FROM Projects")
for row in data:
    print(row)

# Commit changes and close connection
connection.commit()
connection.close()




