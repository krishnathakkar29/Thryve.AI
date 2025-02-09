import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
connection = sqlite3.connect("CompanyDB.db")
cursor = connection.cursor()

# Create EmployeeTable
table_info = """
CREATE TABLE IF NOT EXISTS EmployeeTable (
    EmpID TEXT PRIMARY KEY,
    Name TEXT,
    Age INTEGER,
    Role TEXT,
    email TEXT,             
    phone INTEGER,
    TeamID INTEGER,
    paidLeaves INTEGER,
    daysWorked INTEGER,      
    daysSinceLeave INTEGER
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
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP001', 'Rajesh Sharma', 45, 'CEO', 'rajesh.sharma@company.com', 9876543201, 1, 15, 320, 150)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP002', 'Anjali Verma', 40, 'Manager', 'anjali.verma@company.com', 9876543202, 2, 12, 280, 200)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP003', 'Suresh Iyer', 38, 'HR', 'suresh.iyer@company.com', 9876543203, 3, 10, 350, 180)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP004', 'Neha Gupta', 35, 'Manager', 'neha.gupta@company.com', 9876543204, 2, 14, 290, 220)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP005', 'Vikram Reddy', 22, 'Intern', 'vikram.reddy@company.com', 9876543205, 4, 5, 150, 300)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP006', 'Priya Nair', 30, 'HR', 'priya.nair@company.com', 9876543206, 3, 8, 330, 120)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP007', 'Amitabh Joshi', 37, 'Manager', 'amitabh.joshi@company.com', 9876543207, 2, 11, 310, 250)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP008', 'Rohit Desai', 25, 'Intern', 'rohit.desai@company.com', 9876543208, 4, 6, 200, 340)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP009', 'Sneha Patil', 33, 'HR', 'sneha.patil@company.com', 9876543209, 3, 9, 290, 160)")
cursor.execute("INSERT INTO EmployeeTable (EmpID, Name, Age, Role, email, phone, TeamID, paidLeaves, daysWorked, daysSinceLeave) VALUES ('EMP010', 'Kavya Mehta', 28, 'Intern', 'kavya.mehta@company.com', 9876543210, 4, 7, 170, 370)")

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




