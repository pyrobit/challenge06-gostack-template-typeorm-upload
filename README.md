# Application Backend

## A nodejs express backend API to manage income outcome transactions with business rules and route to upload transactions with csv file

### Technologies:
- nodejs
- express
- typeorm
- multer

### Requriments:
- forbid outcome transactions when balance is not enough
- do not register duplicated transaction categories, use the existing transaction id instead
- automatically register new transaction categories
- Route to upload transaction lot through csv files
