test = ('EmpID TEXT PRIMARY KEY','Name TEXT','AgeGroup TEXT','BusinessTravel TEXT','Role TEXT','TeamID INTEGER','DailyRate INTEGER','Department TEXT','DistanceFromHome INTEGER','Education INTEGER','EducationField TEXT','EmployeeCount INTEGER','EmployeeNumber INTEGER','EnvironmentSatisfaction INTEGER','Gender TEXT','HourlyRate INTEGER','JobInvolvement INTEGER','JobLevel INTEGER','JobRole TEXT','JobSatisfaction INTEGER','MaritalStatus TEXT','MonthlyIncome INTEGER','SalarySlab TEXT','MonthlyRate INTEGER','NumCompaniesWorked INTEGER','Over18 TEXT','OverTime TEXT','PerformanceRating INTEGER','RelationshipSatisfaction INTEGER','StandardHours INTEGER','StockOptionLevel INTEGER','TotalWorkingYears INTEGER','TrainingTimesLastYear INTEGER','WorkLifeBalance INTEGER','YearsAtCompany INTEGER','YearsInCurrentRole INTEGER','YearsSinceLastPromotion INTEGER','YearsWithCurrManager INTEGER')
test2 = ('EMP001', 'John Smith', '40-50', 'Frequent', 'CEO', 1, 1500, 'Executive', 10, 4, 'Business', 1, 1, 4, 'Male', 95, 4, 5, 'CEO', 4, 'Married', 25000, 'High', 50000, 3, 'Y', 'No', 5, 4, 40, 3, 20, 3, 4, 15, 8, 5, 8),
print(len(test))
print(len(test2[0]))
ver = []
for i in range(len(test2[0])):
    ver.append(test[i])
print(len(ver))
for i in test:
    if i not in ver:
        print(i)

