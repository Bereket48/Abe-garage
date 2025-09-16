// ***************************Revised Code*****************************
// *********************************************************************
// Function to read employee data from localStorage
const getAuth = () => {
  try {
    const stored = localStorage.getItem("employee");
    if (!stored) return null; //To avoid parsing null firsthand if localStorage is empty, otherwise it will throw an error. Though the catch block will handle it, it's cleaner this way.

    const employee = JSON.parse(stored); // Parsing the stored JSON string to an object

    if (employee?.employee_token) {
      // Optional chaining to check if employee and employee_token exist
      const decodedToken = decodeTokenPayloadMine(employee.employee_token);

      return {
        ...employee, // Spread existing employee properties
        employee_role: decodedToken.employee_role, // Add new properties from decoded token
        employee_id: decodedToken.employee_id, // Add new properties from decoded token
        employee_first_name: decodedToken.employee_first_name, // Add new properties from decoded token
      };
    }

    return null;
  } catch (error) {
    console.error("Error reading auth:", error);
    return null;
  }
};

// ********Function to decode JWT payload*********
//*********decodeURIComponent option- Lesson's version************* *// //This option only works when the payload has only ASCII characters (common for JWT claims like id, role, exp, etc. Otherwise it may break on Unicode characters like names with emojis, Chinese, Arabic, etc.)
// const decodeTokenPayloadLesson's = (token) => {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// };

//*********TextDecoder option************* */ //This option works for both ASCII and Unicode characters, so it's more robust for general use. However, TextDecoder may not be supported in very old browsers without a polyfill (e.g., Internet Explorer).
const decodeTokenPayloadMine = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
    const jsonPayload = new TextDecoder().decode(bytes);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token:", error);
    return {};
  }
};

export default getAuth;

// ***************************Lesson's code*****************************
// *********************************************************************

// // Function to read the data from the user's local storage
// const getAuth = async () => {
//   const employee = await JSON.parse(localStorage.getItem('employee'));
//   if (employee && employee.employee_token) {
//     const decodedToken = await decodeTokenPayload(employee.employee_token);
//     employee.employee_role = decodedToken.employee_role;
//     employee.employee_id = decodedToken.employee_id;
//     employee.employee_first_name = decodedToken.employee_first_name;
//     return employee;
//   } else {
//     return {};
//   }
// };

// // Function to decode the payload from the token
// // The purpose of this code is to take a JWT token, extract its payload, decode it from Base64Url encoding, and then convert the decoded payload into a JavaScript object for further use and manipulation
// const decodeTokenPayloadLesson's = (token) => {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//       .join('')
//   );
//   return JSON.parse(jsonPayload);
// };

// export default getAuth;

// ***************************Problems with this code*****************************
// 1. await on non-async calls
// JSON.parse and localStorage.getItem are synchronous, so there’s no need for await inside getAuth. Same for decodeTokenPayload, which doesn’t return a promise.
// 2. The function returns an empty object {} when no employee data is found, which can be misleading. It would be more appropriate to return null or undefined to clearly indicate the absence of data.
// 3. Error handling
// If the token is malformed or expired, decodeTokenPayload could throw. Wrapping it in a try...catch would prevent runtime crashes.
// 4. The code could be made more readable and maintainable by using modern JavaScript features and best practices, such as optional chaining and nullish coalescing.
// 5. Calling the function decodeTokenPayLoad before defining it. Except for function declarations, JavaScript does not hoist function expressions or arrow functions. This means that if you try to call a function before it is defined, you will get a ReferenceError. A function declaration means defining a function using the function keyword, like this:
// function myFunction() { ... }, whereas a function expression means defining a function using a variable, like this:
// const myFunction = function() { ... } or const myFunction = () => { ... }. This code would still work because we aren't calling getAuth on the lines before decodeTokenPayload is defined. When importing getAuth in another file the module runs top-to-bottom, so getAuth is defined, decodeTokenPayload is defined, but nothing calls getAuth yet, getAuth just sits as a function. No ReferenceError occurs, because decodeTokenPayload exists by the time you call getAuth() in the importing file. But it's still better practice to define functions before using them to avoid confusion and potential errors in more complex scenarios unless you are using function declarations.
// 6. The decodeTokenPayload function uses decodeURIComponent and atob, which may not handle all character encodings correctly, especially for non-ASCII characters. A more robust solution would involve using a library designed for JWT decoding, which can handle various edge cases and token formats.
// 7. Security considerations 
// Storing sensitive information like tokens in localStorage can expose them to XSS attacks. Consider using more secure storage mechanisms or implementing additional security measures.  --- (I didn't implement this here yet).
// *********************************************************************
// *********************************************************************
