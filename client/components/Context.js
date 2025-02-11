// // components/Context.js
// import React, { createContext, useContext, useState } from 'react';

// // Initialize with a default value
// const MyContext = createContext({
//   globalUserID: null,
//   setGlobalUserID: () => {}
// });

// export const MyProvider = ({ children }) => {
//   const [globalUserID, setGlobalUserID] = useState(null);

//   return (
//     <MyContext.Provider value={{ globalUserID,setGlobalUserID}}>
//       {children}
//     </MyContext.Provider>
//   );
// };

// export const useMyContext = () => {
//   const context = useContext(MyContext);
//   if (context === undefined) {
//     throw new Error('useMyContext must be used within a MyProvider');
//   }
//   return context;
// };