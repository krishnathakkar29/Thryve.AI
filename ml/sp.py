import sqlite3

## Connectt to SQlite
connection=sqlite3.connect("student.db")

# Create a cursor object to insert record,create table

cursor=connection.cursor()

## create the table
table_info="""
Create table STUDENT(NAME VARCHAR(25),CLASS VARCHAR(25),
SECTION VARCHAR(25),MARKS INT);

"""
cursor.execute(table_info)

## Insert Some more records

cursor.execute('''Insert Into STUDENT values('Krish','Data Science','A',90)''')
cursor.execute('''Insert Into STUDENT values('Sudhanshu','Data Science','B',100)''')
cursor.execute('''Insert Into STUDENT values('Darius','Data Science','A',86)''')
cursor.execute('''Insert Into STUDENT values('Vikash','DEVOPS','A',50)''')
cursor.execute('''Insert Into STUDENT values('Dipesh','DEVOPS','A',35)''')

## Disspaly ALl the records

print("The isnerted records are")
data=cursor.execute('''Select * from STUDENT''')
for row in data:
    print(row)

## Commit your changes int he databse
connection.commit()
connection.close()

CREATE TABLE IF NOT EXISTS EmployeeTable (
    EmpID TEXT PRIMARY KEY,
    Name TEXT,
    AgeGroup TEXT,
    BusinessTravel TEXT,
    Role TEXT,
    TeamID INTEGER,
    DailyRate INTEGER,
    Department TEXT,
    DistanceFromHome INTEGER,
    Education INTEGER,
    EducationField TEXT,
    EmployeeCount INTEGER,
    EmployeeNumber INTEGER,
    EnvironmentSatisfaction INTEGER,
    Gender TEXT,
    HourlyRate INTEGER,
    JobInvolvement INTEGER,
    JobLevel INTEGER,
    JobRole TEXT,
    JobSatisfaction INTEGER,
    MaritalStatus TEXT,
    MonthlyIncome INTEGER,
    SalarySlab TEXT,
    MonthlyRate INTEGER,
    NumCompaniesWorked INTEGER,
    Over18 TEXT,
    OverTime TEXT,
    PerformanceRating INTEGER,
    RelationshipSatisfaction INTEGER,
    StandardHours INTEGER,
    StockOptionLevel INTEGER,
    TotalWorkingYears INTEGER,
    TrainingTimesLastYear INTEGER,
    WorkLifeBalance INTEGER,
    YearsAtCompany INTEGER,
    YearsInCurrentRole INTEGER,
    YearsSinceLastPromotion INTEGER,
    YearsWithCurrManager INTEGER
);