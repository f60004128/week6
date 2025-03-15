import { Link } from "react-router-dom";


export default function NotFound(){
    return (
        <>
          <h2>404</h2>
          <Link to="/">返回首頁</Link>
        </>
      );
}