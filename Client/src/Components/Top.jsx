import React from 'react';
import { CgProfile } from "react-icons/cg";


const Top = () => {
  return (
    <div>
      <div className="bg-light border border-1 position-fixed w-100" style={{zIndex:"2"}}>
        <div className="d-flex justify-content-between align-items-center navbar-right-custom p-2">
          <h6>    
          Product Inventory System 
          </h6>
          <h6>
          <CgProfile /> Profile
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Top;
