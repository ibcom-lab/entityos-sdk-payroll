# entityOS SDK

entityOS SDK for Payroll.

- https://learn.entityos.cloud

entityOS includes functionality to help an entity with employee payroll management.

## Cloud Service

The cloud service methods are availabe at the FINANCIAL endpoint:
- https://docs.entityos.cloud

The FINANCIAL_PAYROLL_PAY_PROCESS method is an Australian specific method for calculating tax etc.  The logic for the calculations are provided within this repo to verifiy the logic suits your needs.
- https://github.com/ibcom-lab/entityos-sdk-payroll/blob/main/cloud/payroll-calculations.md
- https://docs.entityos.cloud/FINANCIAL_PAYROLL_PAY_PROCES

If the entity is in any other country, or if in Australia and want to control all the logic, you can build your own logic with in the user interface or a node app.

All code is provided as is and should be fully tested in relation to your obligations under any countries governance obligations/law.

## User Interface (js)

There is also example code that can be used to build your own interface and also connect to government reporting cloud services.








