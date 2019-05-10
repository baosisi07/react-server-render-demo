import React from "react"
import { Route } from "react-router-dom"

function Status({ code, children }) {
    return (
        <Route
            render={({ staticContext }) => {
                if (staticContext) staticContext.status = code;
                return children;
            }}
        />
    );
}
export default Status