# Back-end

Intended contents:

- Code-testing: Back-end functional tests.
- Code-testing: Back-end unit tests.
- Code-testing: RESTful API.
- Code-testing: Ανάλυση επιδόσεων του REST API ("benchmarking") (\*).
- Code-testing: Λειτουργίες χρέωσης του REST API (\*).
- Code-testing: Πηγαίος κώδικας εφαρμογής για εισαγωγή, διαχείριση και πρόσβαση σε πρωτογενή δεδομένα (backend).


#### Brief Instructions

Required: Node (>= v12.0) , npm

(in back-end/ dir):
- npm i
- insert your own stripe secret key and jwt secret in config/env.json file
- "npm start"

For testing:
- npm test
- (/tokens/* needs to be filled with the proper tokens(admin's, user's ...)
