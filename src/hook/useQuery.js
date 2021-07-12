import React from "react";
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useQuery();