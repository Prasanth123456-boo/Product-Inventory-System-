import React from 'react';
import { AiOutlineDashboard } from "react-icons/ai";
import { FaProjectDiagram } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";


const Sidebar = () => {
    return (
        <div>
            <div className="custom-navbar-left bg-body-tertiary p-3 position-fixed border border-1" style={{height:"100%",zIndex:"1"}}>
                <div className="mt-5">
                    <div className="d-flex justify-content-center flex-column align-items-center">
                    <AiOutlineDashboard />
                        <p className="custom-p">DashBoard</p>
                    </div>
                    <div className="d-flex justify-content-center flex-column align-items-center">
                    <FaProjectDiagram />
                        <p className="custom-p">Project</p>
                    </div>
                    <div className="d-flex justify-content-center flex-column align-items-center">
                    <IoNotifications />
                        <p className="custom-p">Notification</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
