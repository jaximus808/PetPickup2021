# PetPickup2021

This project is for the 2021 HACC created by team JrBytes

This project's main goal is to speed up the process of quarentining pets and allows automatic messaging of pet's status. 

Our demo is at: https://808petquarentine.azurewebsites.net/

Video demo: https://www.youtube.com/watch?v=1_xUIxu93yw

Devpost: https://devpost.com/software/808petquarentine

Admin credentials will only be given to judges for testing through the judging email given.

Security Proposal:
Our solution has multiple methods of authentication inside of it with the major one having accounts with encrypted passwords. Accounts are hosted on MongoDB with encrypted passwords and the database only allows access from the azure server and team members’ public IPs. To counteract cyber attacks, our solution features password hashing and session authentication for security. Only after successfully logging in with authorized credentials can an administrator add or pull private information from the server including client information like names, addresses, phone numbers, etc. No such data is available publicly for non-administrators to view, and clients interact with the server database through an authenticated session also. The system is secure from the outside and all confidential data is stored in a backend MongoDB database which is inaccessible without administrator privileges. System administrators have full access to server and database information and are able to manually adjust private user information if necessary to maintain accuracy with other records or to rectify prior mistakes. In the case of a cyber-attack where user confidentiality is compromised, the architecture of our deployment makes it easy to clear/modify private information and to port data in bulk to a different server deployment if necessary. Both client and administrator interfaces expose no outside backend data and no confidential data is stored to any client whatsoever—this vastly reduces the risk of cyber-attacks and greatly improves application security. Our credential hashing uses a crypto module that requires the random salt and the secret for our hashing. Without it, the password is defended from individuals deciphering our account’s passwords. creating a vacuum seal in the project’s security which stops attackers from utilizing common exploits to gain access to a client or administrator interface which they do not have permission. When a user passes their login credentials to be validated, authentication takes place on the server, and no hashing and authentication is given to the client. In the case that the user’s credentials are valid, they automatically gain access to a regarding their own contact information and pet status. These accounts deactivate after their pet is released from quarantine. Admin accounts also follow the same authentication method and had their passwords encrypted with our secret and random salt. Logging into the application will assign a session token for the user to use to read and tamper with the admin functionality of our application. 
