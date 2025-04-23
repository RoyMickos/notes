2023-04-13
Tags:

---
# Jq tricks

## Selecting fields from deeply nested objects
```
jq '.application.incomeRegister.report.incomeByEmployer[].payments[] | {payment, reportVersion: .externalData.reportVersion}'
```
- use quotes to escape characters that would be otherwise interpreted by the shell
- use [] to select all entries of an array
- use pipe | to pass the result to another jq filter
- use {} to create a new object, using js-like selector syntax
  - fieldname by itself selects a field by the same name
  - create new fields by using filter expression as a value

---
## References
1. 
