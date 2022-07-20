
# Constants

```
	PAY_WEEKLY = 1
	PAY_FORTNIGHTLY = 2
	PAY_MONTHLY = 3
	PAY_BIMONTHLY = 4
	PAY_QUARTERLY = 5

	ROUND_DOLLAR = 1
	ROUND_DOLLAR_DOWN = 3
	
	SUPER_TYPE_NORMAL = 1
	SUPER_TYPE_PRE_TAX = 2
	SUPER_TYPE_POST_TAX = 3

	SUPER_TYPE_FIXED = 1
	SUPER_TYPE_PERCENTAGE = 2
	
	TYPE_PRETAX_SUPER = 1
	TYPE_POSTTAX_SUPER = 2

	LINE_NORMAL = 1
	LINE_ALLOWANCE = 8
	LINE_DEDUCTION = 9
	LINE_TAX_ADJUSTMENT = 10	
	LINE_SALARY_SACRIFICE_SUPER = 16
	LINE_EMPLOYEE_SUPER = 17

	EMPLOYEE_RATETYPE_CASUAL = 3
```	

# Calculate

```
	> Calculates tax, leave etc for an employee pay run.
				
	> [LF:Leave Fraction]

		Hours = SUM(Hours) : Pay-Items
	
		if (Hours >= EmployeeStandardHoursPerWeek)
			LeaveFraction = 1

		else
			LeaveFraction = (Hours / EmployeeStandardHoursPerWeek)
		
		if (NOT: EMPLOYEE_RATETYPE_CASUAL)
			[1,2,3]
				case 1
					Rate = EmployeeAnnualLeaveEntitlement
				case 2
					Rate = EmployeeSickLeaveEntitlement
				case 3
					Rate = EmployeeLongServiceEntitlement
				
			if Rate > 0 Then
				> Record Leave

	> [GS:Gross Salary]

		GrossSalary = SUM(Hours * PayOnCostHourlyRate) : Pay-Items : IncludeInGrossSalary = 'Y'
		
	> [LL:Leave Loading], [LL-NT:Leave Loading that is Non-Taxable]

		LeaveLoading = SUM(Hours * (Rate + PayOnCostHourlyRate)) : Pay-Items : IncludeInLeaveLoading = 'Y'
		
		NoTaxLeaveLoading = 0
		
		if LeaveLoading > 0

			From = "1 Jul "
			
			if Month(PayDate) < 7 then
				From = From & (Year(PayDate) - 1)
			else
				From = From & Year(PayDate)

			ThisYearLeaveLoading = SUM(PAY_Record.LeaveLoading) : Pay-Period :
				PayDate >= From
				AND PayDate <= PayDate)
				AND Excluding This Pay Period
				
			if ((ThisYearLeaveLoading + LeaveLoading) <= 320)
				NoTaxLeaveLoading = LeaveLoading
			
			else
				NoTaxLeaveLoading = 320 - ThisYearLeaveLoading
		
	> [SPRET:Superannuation pre-tax]

		PreTaxSuper = [CalculateSuper : TYPE_PRETAX_SUPER, GrossSalary]
		
	> [TA:Taxable Allowances]

		 TaxableAllowances = SUM(Total) : Pay-Items : IncludeInAllowances = 'Y'
		
	> [NTA:Non Taxable Allowances]

		NonTaxableAllowances = SUM(Total) : Pay-Items : IncludeInNonTaxableAllowances = 'Y'
		
	> [D:Deductions]

		Deductions = SUM(Total) : Pay-Period : IncludeInDeductions = 'Y'
		
	> [TA:Tax Adjustments]
		
		TaxAdjustments = SUM(Total) : Pay-Period : IncludeInTaxAdjustments = 'Y'
		
	> [TS:Taxable Salary]: [GS]+[TA]-[LL-NT]-[SPRET]

		TaxableAmount = GrossSalary + TaxableAllowances - NoTaxLeaveLoading - PreTaxSuper
				
		if (PayPeriods <> 1)
			TaxableAmount = TaxableAmount / PayPeriods
	
	> [R:Rebate]

		TaxBeforeRebate = CalculateTax-AU(TaxableAmount)

		HECS = CalculateHECS-AU(TaxableAmount)

		TaxBeforeRebate = TaxBeforeRebate + HECS
		
		Rebate = CalculateRebates-AU()

		if (PayPeriods <> 1)
			TaxBeforeRebate = TaxBeforeRebate * PayPeriods
			Rebate = Rebate * PayPeriods
			HECS = HECS * PayPeriods

	> [TAX-R:Tax minus Rebate]: [TS]-[R]

		TaxAfterRebate = TaxBeforeRebate - Rebate

	> [NS: Net Salary]

		NetSalary = GrossSalary + TaxableAllowances + NonTaxableAllowances - TaxAfterRebate - Deductions - TaxAdjustments - PreTaxSuper

	> [SPOSTT: Post Tax Superannuation Amount (Employee Contribution on Net Salary)]

		PostTaxSuper = CalculateSuper-AU(TYPE_POSTTAX_SUPER, NetSalary) 
		
	> [NS-SPOSTT: Net Salary minus Employee Contribution]: [NS]-[SPOSTT]
		
		NetSalary = NetSalary - PostTaxSuper

	> [GS-LL:Gross Salary minus Leave Loading]

		if (EmployeeSuperannuationRate > 0 orEmployeePostTaxSuperAmount > 0)
			SuperCalculationMonthInitialGrossSalary = SUM(PAY_Record.GrossSalary),
			SuperCalculationMonthLeaveLoading = SUM(Superannuation),
			SuperCalculationMonthInitialSuperannuation = SUM(PAY_Record.LeaveLoading) :
			 	Pay-Period :
					Employee = Current Employee
					PayDate >= PayDate : FIRST_DAY_MONTH
					PayDate <= PayDate

		MonthGrossSalary = SuperCalculationMonthInitialGrossSalary - SuperCalculationMonthLeaveLoading

	> [S:Superannuation] based on [GS-LL:Gross Salary minus Leave Loading]

		MonthSuperannuation = SuperCalculationMonthInitialSuperannuation					
				
	> [SSE:Salary Superannuation Exclusions]

		SuperCalculationMonthExclusion = SUM(Rate * Hours) :
			Pay-Period :
				Employee = Current Employee
				PayDate >= PayDate : FIRST_DAY_MONTH
				PayDate <= PayDate
				(IncludeInGrossSalary = 'Y') Or OverrideIncludeInGrossSalary = 'Y')
				(IncludeInSuper = 'N' Or OverrideIncludeInSuper = 'N')

	> [AGS4S:Adjusted Gross Salary for Superannuation]: [GS-LL:Gross Salary minus Leave Loading] minus [SSE:Salary Superannuation Exclusions]

		MonthGrossSalary = MonthGrossSalary - SuperCalculationMonthExclusion

	> [AGS4S-SA:Adjusted Gross Salary for Superannuation]: [AGS4S:Adjusted Gross Salary for Superannuation] minus [SA:Superannuation Allowances]

		> Need to add the super allowances in the month (ie things not in gross, but should be in super)

		SuperCalculationMonthAllowances = SUM(Rate * Hours) :
			Pay-Period :
				Employee = Current Employee
				PayDate >= PayDate : FIRST_DAY_MONTH
				PayDate <= PayDate
				(IncludeInGrossSalary = 'N') Or OverrideIncludeInGrossSalary = 'N')
				(IncludeInSuper = 'Y' Or OverrideIncludeInSuper = 'Y')

		MonthGrossSalary = MonthGrossSalary + SuperCalculationMonthAllowances
				
		> Subtract off salary sacrifice super, and employer

		SuperCalculationMonthSalarySacrificeSuper = SUM(Rate * Hours) :
			Pay-Period :
				Employee = Current Employee
				PayDate >= PayDate : FIRST_DAY_MONTH
				PayDate <= PayDate
				IncludeInPostTaxSuper = 'Y'
		
		MonthGrossSalary = MonthGrossSalary - SuperCalculationMonthSalarySacrificeSuper
				
		if (SuperGuaranteeApplyHighIncomeCap = 'Y')
			
			> This needs to be reviewed each year via https://www.ato.gov.au/rates/key-superannuation-rates-and-thresholds/?anchor=Maximusupercontributionbase
			> Published figure  divided by three to convert it to monthly
			
			if (PayDate < '30 Jun 2018 23:59:59')
				MaxBaseGrossSalary = 17586.67
			else
				MaxBaseGrossSalary = 18010.00
			
			if (MonthGrossSalary > MaxBaseGrossSalary)
				MonthGrossSalary = MaxBaseGrossSalary
	
			SuperCalculationMonthPostHighIncomeCap = MonthGrossSalary
			
		> Need to ignore the super from the current record in the case of recalc
			 
		SuperCalculationMonthPreviousCalculation = Superannuation : Pay-Record : Current Pay Record
				
		MonthSuperannuation = MonthSuperannuation - SuperCalculationMonthPreviousCalculation

	> [S:Superannuation], [SR:Superannuation Rate]		
		
		SuperCalculationRate = EmployeeSuperannuationRate
	
		if (MonthGrossSalary > SuperThreshold)
			Super = (MonthGrossSalary * EmployeeSuperannuationRate / 100)
			PaySuperannuation = (Super - MonthSuperannuation)

```

# CalculateRebates-AU < EmployeeRebates
 
```
	if (EmployeeRebates > 0)
		Scale :
			PAY_WEEKLY 	
				CalculateRebates-AU = EmployeeRebates * 0.019 : ROUND_DOLLAR

			PAY_FORTNIGHTLY 
				CalculateRebates-AU = EmployeeRebates * 0.038 : ROUND_DOLLAR

			PAY_MONTHLY , PAY_BIMONTHLY
				CalculateRebates-AU = EmployeeRebates * 0.083 : ROUND_DOLLAR

			cPAY_QUARTERLY
				CalculateRebates-AU = EmployeeRebates * 0.0249 : ROUND_DOLLAR

```


# CalculateTax-AU < GrossSalary

```	
	HALF_MEDICARE_EXEMPTION = 3
	FULL_MEDICARE_EXEMPTION = 2

	if (GrossSalary <= 0) 
		CalculateTax-AU = 0

	else
		> Work out the weekly rate
	
		PAY_WEEKLY

			WeeklyGross = GrossSalary : ROUND_DOLLAR_DOWN
			WeeklyGross = WeeklyGross + 0.99

		PAY_FORTNIGHTLY
			WeeklyGross = GrossSalary / 2 : ROUND_DOLLAR_DOWN
			WeeklyGross = WeeklyGross + 0.99

		PAY_MONTHLY
			if (CONTAINS(acGrossSalary, '.33'))
				WeeklyGross = GrossSalary + 0.01
			else
				WeeklyGross = GrossSalary

			WeeklyGross = WeeklyGross * 3 / 13

			WeeklyGross = WeeklyGross : ROUND_DOLLAR_DOWN
			WeeklyGross = WeeklyGross + 0.99
		
		PAY_BIMONTHLY
			WeeklyGross = GrossSalary

			WeeklyGross = WeeklyGross * 24 / 52

			WeeklyGross = WeeklyGross : ROUND_DOLLAR_DOWN
			WeeklyGross = WeeklyGross + 0.99

		PAY_QUARTERLY
			WeeklyGross = GrossSalary / 13 : ROUND_DOLLAR_DOWN
			WeeklyGross = WeeklyGross + 0.99
		
		if (EmployeeSpecialTaxRate > 0)
			Scale = 0
			WeeklyTax = WeeklyGross * EmployeeSpecialTaxRate / 100
			WeeklyTax = WeeklyTax : ROUND_DOLLAR_DOWN

		else
			> Find the scale and a and b

			dA = 0
			dB = 0
			ForeignResident = 'N'
		
			if (EmployeeTFN = '')
				Scale = 4
				ForeignResident = EmployeeForeignResident
		
			if (EmployeeForeignResident = 'Y')
				Scale = 3
		
			if (EmployeeMedicareId = FULL_MEDICARE_EXEMPTION)
				Scale = 5
		
			if (EmployeeMedicareId = HALF_MEDICARE_EXEMPTION)
				Scale = 6
		
			if (EmployeeTaxFreeThreshold = 'N')
				Scale = 1
		
			if (EmployeeLeaveLoadingRate > 0 And EmployeeTaxFreeThreshold = 'Y)
				Scale = 2
				
			if (EmployeeLeaveLoadingRate = 0 And EmployeeTaxFreeThreshold = 'Y')
				Scale = 7
				
			 rateA, rateB = A, B : PAY-Tax-Rates :
			 	Scale = Scale
				FromAmount <= WeeklyGross
				(ToAmount >= WeeklyGross Or ToAmount Is Null)
				FSDebt = EmployeeFSDebt

			> Calculate tax

			WeeklyTax = (rateA * WeeklyGross) - rateB	
		
			if (Scale = 4)
				WeeklyTax = WeeklyTax : ROUND_DOLLAR_DOWN
			else
				WeeklyTax = WeeklyTax : ROUND_DOLLAR

		> Convert tax back to pay period]

		PAY_WEEKLY
			CalculateTax-AU = WeeklyTax

		PAY_FORTNIGHTLY 
			CalculateTax-AU = WeeklyTax * 2

		PAY_MONTHLY
			CalculateTax-AU = WeeklyTax * 13 / 3

			if (Scale = 4) Then
				CalculateTax-AU = PayPeriodTax : REMOVE_DECIMAL, ROUND_DOLLAR
			else
				CalculateTax-AU = PayPeriodTax : ROUND_DOLLAR

		PAY_BIMONTHLY
			CalculateTax-AU = WeeklyTax * 52 / 24
			CalculateTax-AU = PayPeriodTax : ROUND_DOLLAR

		PAY_QUARTERLY
			CalculateTax-AU = WeeklyTax * 13 : ROUND_DOLLAR

```

# CalculateHECS-AU < GrossSalary, EmployeeDeductHECS

```
	## [H:HELP]

	if (EmployeeDeductHECS != 'Y')
		CalculateHECS = 0
	
	else
	
		PAY_WEEKLY
			YearlyGross = GrossSalary * 52

		PAY_FORTNIGHTLY
			YearlyGross = GrossSalary * 26

		PAY_MONTHLY
			YearlyGross = GrossSalary * 12
	
		PAY_BIMONTHLY
			YearlyGross = GrossSalary * 24

		PAY_QUARTERLY
			YearlyGross = GrossSalary * 4

		Percentage = Percentage : Pay-HECS :
			FromAmount <= YearlyGross 
			ToAmount >= YearlyGross
			TaxFreeThreshold = EmployeeTaxFreeThreshold

	CalculateHECS-AU = GrossSalary * Percentage

```			


# CalculateSuper-AU < Salary, Type

```
	## [SPRET-SALARY] [SPOSTT-SALARY]

	CalculateSuperAmount = 0
	
	if Prefix = "Pre"
		CalculateSuperAmount = EmployeePreTaxSuperAmount
		TypeId = EmployeePreTaxSuperAmountType
	else
		CalculateSuperAmount = EmployeePostTaxSuperAmount
		Type = EmployeePostTaxSuperAmountType		

	if (cAmount > 0)
		Type:
			NOT SUPER_TYPE_FIXED
				CalculateSuperAmount = (CalculateSuperAmount / 100) * Salary
	
	if CalculateSuperAmount > Salary
			CalculateSuperAmount = Salary
```	

